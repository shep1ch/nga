(function () {
  const preloader = document.getElementById('preloader');
  const percentEl = document.getElementById('preloader-percent');
  const site = document.getElementById('site');
  const ring = document.querySelector('.ring-fg');

  let percent = 0;
  let simulated = true;

  const SIM = {
    minStep: 1,
    maxStep: 6,
    interval: 70,
    safeFinish: 95,
    autoHideAfter: 500
  };

  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

  function setPercent(p) {
    percent = Math.max(0, Math.min(100, Math.round(p)));
    percentEl.textContent = percent + '%';
    if (ring) {
      const radius = 20;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference * (1 - percent / 100);
      ring.style.strokeDashoffset = offset;
    }
  }

  function finishAndHide() {
    setPercent(100);
    setTimeout(() => {
      preloader.classList.add('disappearing');
      site.classList.add('ready');
      site.removeAttribute('aria-hidden');

      // удалить после окончания анимации
      preloader.addEventListener('animationend', () => {
        preloader.remove();
      }, { once: true });
    }, SIM.autoHideAfter);
  }

  let simTimer = null;
  function startSimulation() {
    simTimer = setInterval(() => {
      if (!simulated) return clearInterval(simTimer);
      const step = rand(SIM.minStep, SIM.maxStep);
      const target = percent + step;
      if (target >= SIM.safeFinish) {
        setPercent(SIM.safeFinish);
        clearInterval(simTimer);
        return;
      }
      setPercent(target);
    }, SIM.interval);
  }

  setPercent(0);
  startSimulation();

  function onRealLoad() {
    simulated = false;
    clearInterval(simTimer);

    const start = percent;
    const duration = 350;
    const steps = 12;
    const stepTime = Math.round(duration / steps);
    let i = 0;

    const smoother = setInterval(() => {
      i++;
      const next = start + (100 - start) * (i / steps);
      setPercent(next);
      if (i >= steps) {
        clearInterval(smoother);
        finishAndHide();
      }
    }, stepTime);
  }

  if (document.readyState === 'complete') {
    onRealLoad();
  } else {
    window.addEventListener('load', onRealLoad, { once: true, passive: true });

    setTimeout(() => {
      if (simulated) {
        simulated = false;
        clearInterval(simTimer);
        finishAndHide();
      }
    }, 6000);
  }

  preloader.addEventListener('click', () => finishAndHide());
})();
