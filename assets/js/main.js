(() => {
  const isFluidHome = Boolean(document.querySelector('.hero-orbit') && document.querySelector('.product-river'));

  if (isFluidHome) {
    const legacy = document.querySelector('link[href*="/assets/css/styles.css"]');
    const fluid = document.createElement('link');
    fluid.rel = 'stylesheet';
    fluid.href = '/assets/css/home-fluid.css?v=20260916-fluid-1';
    fluid.onload = () => legacy?.remove();
    document.head.appendChild(fluid);

    const script = document.createElement('script');
    script.src = '/assets/js/home-fluid.js?v=20260916-fluid-1';
    document.body.appendChild(script);
    return;
  }

  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const year = document.querySelector('[data-year]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (year) year.textContent = new Date().getFullYear();
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      menu.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    }));
  }

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.classList.add('on');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
      el.classList.add('on');
    });
  }
})();
