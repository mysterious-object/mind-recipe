"""Offline tests: no Kubernetes/Vault access, credentials or account changes."""
import contextlib
import importlib.util
import io
from pathlib import Path
import unittest
from unittest.mock import patch


def load(name):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).with_name(name + ".py"))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class RestartProbeTests(unittest.TestCase):
    def setUp(self):
        self.probe = load("verify-staging-auth-restart")

    def test_no_ready_pod_never_restarts(self):
        with patch("sys.argv", ["probe", "--restart-staging"]), \
                patch.object(self.probe, "ready_pod", return_value=None), \
                patch.object(self.probe, "run") as run:
            with self.assertRaises(RuntimeError):
                self.probe.main()
            run.assert_not_called()

    def test_same_key_in_new_pod_passes_without_printing_digest(self):
        output = io.StringIO()
        with patch("sys.argv", ["probe", "--restart-staging"]), \
                patch.object(self.probe, "ready_pod", side_effect=["old", "new"]), \
                patch.object(self.probe, "probe", return_value={"digest": "test-only-digest"}), \
                patch.object(self.probe, "run") as run, contextlib.redirect_stdout(output):
            self.probe.main()
        run.assert_called_once_with("rollout", "restart", "deployment/mind-recipe-api")
        self.assertIn("PASS", output.getvalue())
        self.assertNotIn("test-only-digest", output.getvalue())

    def test_key_change_fails(self):
        with patch("sys.argv", ["probe", "--restart-staging"]), \
                patch.object(self.probe, "ready_pod", side_effect=["old", "new"]), \
                patch.object(self.probe, "probe", side_effect=[{"digest": "a"}, {"digest": "b"}]), \
                patch.object(self.probe, "run"), contextlib.redirect_stdout(io.StringIO()):
            with self.assertRaisesRegex(RuntimeError, "changed"):
                self.probe.main()

    def test_stalled_rollout_only_reconciles_metadata_once(self):
        with patch("sys.argv", ["probe", "--restart-staging"]), \
                patch.object(self.probe, "ready_pod", side_effect=["old", None, None, "new"]), \
                patch.object(self.probe, "probe", return_value={"digest": "same"}), \
                patch.object(self.probe.time, "monotonic", side_effect=[0, 61, 61, 62, 63]), \
                patch.object(self.probe.time, "time_ns", return_value=123), \
                patch.object(self.probe.time, "sleep"), \
                patch.object(self.probe, "run") as run, contextlib.redirect_stdout(io.StringIO()):
            self.probe.main()
        self.assertEqual(run.call_count, 2)
        run.assert_called_with("annotate", "deployment/mind-recipe-api",
                               "mindrecipe.io/auth-verification=123", "--overwrite")


if __name__ == "__main__":
    unittest.main()
