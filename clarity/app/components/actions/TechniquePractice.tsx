import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/button';

const steps: Record<string, string[]> = {
  '54321': ['Notice five things you can see.', 'Notice four things you can feel against your skin.', 'Listen for three sounds.', 'Notice two scents, or remember two familiar ones.', 'Notice one taste. Take a comfortable breath.'],
  'box-breathing': ['Breathe gently in for four counts.', 'Pause for four counts, only if comfortable.', 'Breathe gently out for four counts.', 'Pause for four counts. Repeat at your own pace, or finish.'],
  'body-grounding': ['Sit comfortably and notice where your body meets the chair.', 'Feel both feet on the floor. Notice the pressure under each foot.', 'Look around and name where you are and today’s date.', 'Move your fingers and toes gently. Notice one thing that feels steady.'],
  'pmr': ['Let your hands rest. Gently tense them for a few seconds, then release.', 'Gently lift your shoulders, then let them drop. Skip any movement that hurts.', 'Press your feet gently against the floor, then release.', 'Let your body rest. Notice the difference between tension and release.'],
};
export function TechniquePractice({ id, name, onClose }: { id: string; name: string; onClose: () => void }) {
  const { setScreen, saveCheckIn } = useApp();
  const { getBackgroundClasses, getTextClasses, getCardClasses } = useTheme();
  const [index, setIndex] = useState(0);
  const instructions = steps[id];
  return <div className={`min-h-screen p-6 ${getBackgroundClasses()} ${getTextClasses()}`}>
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <Button variant="outline" onClick={onClose}>Back to techniques</Button>
      <h2 className="text-3xl">{name}</h2>
      <p>Move at your own pace. You can stop at any time.</p>
      <div className={`rounded-3xl p-8 space-y-6 ${getCardClasses()}`}>
        <p>Step {index + 1} of {instructions.length}</p>
        <p className="text-2xl" aria-live="polite">{instructions[index]}</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous</Button>
        {index < instructions.length - 1 ? <Button onClick={() => setIndex(index + 1)}>Next step</Button> :
          <Button onClick={() => { saveCheckIn([`practice:${id}`]); setScreen('home'); }}>Finish and save</Button>}
      </div>
      {index === instructions.length - 1 && <Button variant="outline" onClick={() => setIndex(0)}>Repeat practice</Button>}
    </div>
  </div>;
}
