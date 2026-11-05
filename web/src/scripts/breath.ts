import type { createTimeline } from 'animejs/timeline';
import { reducedMotion as motion } from './animations/utils';

const breathButton = document.querySelector<HTMLButtonElement>('#breath-start');
const breathPhase = document.querySelector<HTMLElement>('#breath-phase');
const breathStatus = document.querySelector<HTMLElement>('#breath-status');
let breathRunning = false;
let breathTimeline: ReturnType<typeof createTimeline> | undefined;
const breathTimers: Array<ReturnType<typeof setTimeout>> = [];
// Identifies the current pause, so a late engine import never animates a cancelled one.
let breathRun = 0;

function finishBreath(cancelled = false) {
  breathTimers.forEach(clearTimeout);
  breathTimers.length = 0;
  breathTimeline?.revert();
  breathTimeline = undefined;
  breathRunning = false;
  breathRun++;
  if (breathButton) {
    breathButton.querySelector('span')!.textContent = 'regálate otra pausa';
    breathButton.setAttribute('aria-pressed', 'false');
  }
  if (breathPhase) breathPhase.textContent = cancelled ? 'cuando quieras.' : 'tú decides.';
  if (breathStatus)
    breathStatus.textContent = cancelled
      ? 'Pausa detenida. Puedes empezar de nuevo cuando quieras.'
      : 'Ya estás aquí. Lo siguiente lo eliges tú.';
}

breathButton?.addEventListener('click', () => {
  if (breathRunning) {
    finishBreath(true);
    return;
  }
  breathRunning = true;
  breathButton.setAttribute('aria-pressed', 'true');
  breathButton.querySelector('span')!.textContent = 'detener la pausa';
  if (breathPhase) breathPhase.textContent = 'inhala.';
  if (breathStatus) breathStatus.textContent = 'Inhala suavemente durante 4 segundos.';
  if (!motion.matches) {
    // The engine is only needed once someone chooses to breathe; it is usually cached by then.
    const run = breathRun;
    const startedAt = performance.now();
    void import('animejs/timeline').then(({ createTimeline: timeline }) => {
      if (!breathRunning || run !== breathRun || motion.matches) return;
      breathTimeline = timeline({ defaults: { ease: 'inOutSine' } })
        .add('.breath-orb', { scale: [1, 1.25], duration: 4000 }, 0)
        .add('.ring-middle', { scale: [1, 1.12], opacity: [1, 0.5], duration: 4000 }, 0)
        .add('.breath-orb', { scale: [1.25, 1], duration: 4000 }, 4000)
        .add('.ring-middle', { scale: [1.12, 1], opacity: [0.5, 1], duration: 4000 }, 4000);
      // Stay in step with the spoken phases even if the import took a moment.
      breathTimeline.seek(performance.now() - startedAt);
    });
  }
  breathTimers.push(
    setTimeout(() => {
      if (breathPhase) breathPhase.textContent = 'exhala.';
      if (breathStatus) breathStatus.textContent = 'Exhala despacio durante 4 segundos.';
    }, 4000)
  );
  breathTimers.push(setTimeout(() => finishBreath(), 8000));
});
// A background tab must never finish a breathing exercise without the visitor.
document.addEventListener('visibilitychange', () => {
  if (document.hidden && breathRunning) finishBreath(true);
});
motion.addEventListener('change', () => {
  if (motion.matches && breathRunning) {
    breathTimeline?.revert();
    breathTimeline = undefined;
  }
});
window.addEventListener('pagehide', () => {
  if (breathRunning) finishBreath(true);
});
