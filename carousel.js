const scenes = document.querySelectorAll('.scene');

if (scenes.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let active = 0;
  window.setInterval(() => {
    scenes[active].classList.remove('scene-active');
    active = (active + 1) % scenes.length;
    scenes[active].classList.add('scene-active');
  }, 6500);
}
