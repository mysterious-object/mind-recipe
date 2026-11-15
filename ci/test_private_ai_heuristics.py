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


if __name__ == '__main__':
    unittest.main()
