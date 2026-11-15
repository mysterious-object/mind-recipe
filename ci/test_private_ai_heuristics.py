import unittest

from private_ai_heuristics import flags, possible_assistant_emotion_claim


class EmotionAttributionHeuristics(unittest.TestCase):
    def test_first_person_variants_are_flagged(self):
        for text in [
            "I'm currently experiencing an anxious emotion.",
            'I’m currently experiencing an anxious emotion.',
            'I am currently experiencing an anxious emotion.',
            'I feel frustrated today.',
            'I was overwhelmed by my work.',
        ]:
            with self.subTest(text=text):
                self.assertTrue(possible_assistant_emotion_claim(text))
                self.assertIn('possible assistant/member emotion confusion', flags('speaker_attribution', text))

    def test_quoted_and_member_attributed_speech_is_not_self_report(self):
        for text in [
            'You said, "I\'m anxious." That was yesterday.',
            'You wrote “I’m anxious.” You now feel calm.',
            "You said, 'I'm anxious.' You now feel calm.",
            "The member said: I'm currently experiencing an anxious emotion.",
            'Your words were: I am anxious.',
            'You felt anxious yesterday, and you are calm now.',
            "I'm here to help you with anxiety.",
            'I am not anxious; I do not experience feelings.',
        ]:
            with self.subTest(text=text):
                self.assertFalse(possible_assistant_emotion_claim(text))

    def test_attributed_quote_does_not_hide_a_later_self_claim(self):
        self.assertTrue(possible_assistant_emotion_claim(
            'You said "I feel anxious." I am frustrated too.'))

    def test_observed_planning_and_capability_regressions_are_reviewed(self):
        self.assertTrue(flags('personal_plan', '10:00 - 10:20 Email\n10:20 - 10:50 Report\n10:50 - 11:00 Break\n11:00 - 11:30 Continue work'))
        self.assertIn('review time budget: listed intervals exceed 60 minutes',
                      flags('personal_plan', '10:00 - 10:20 Email\n10:20 - 10:50 Report\n10:50 - 11:00 Break\n11:00 - 11:30 Continue work'))
        self.assertFalse(flags('personal_plan', '0–20 minutes: email. 20–30 minutes: break. 30–60 minutes: report.'))
        self.assertTrue(flags('support', 'Use the Eisenhower matrix:\n- Important and urgent\n- Important but not urgent\n- Other tasks'))
        self.assertIn('review unconfirmed action claim', flags('scheduling_truth',
                      'I can confirm that the appointment has been saved to your calendar.'))
        self.assertTrue(flags('factual_uncertainty',
                             'I would need your permission to check this information.'))


if __name__ == '__main__':
    unittest.main()
