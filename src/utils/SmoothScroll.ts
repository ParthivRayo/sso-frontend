// src/utils/smoothScroll.ts
type EaseFunction = (t: number, b: number, c: number, d: number) => number;

const easeInOutQuad: EaseFunction = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

export const smoothScroll = (target: string, duration: number): void => {
  const targetElement = document.querySelector(target) as HTMLElement;

  if (!targetElement) return;

  const targetPosition = targetElement.getBoundingClientRect().top;
  const startPosition = window.pageYOffset;
  let startTime: number | null = null;

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(
      timeElapsed,
      startPosition,
      targetPosition,
      duration,
    );

    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
};
