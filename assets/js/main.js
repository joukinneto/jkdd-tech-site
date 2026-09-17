(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu], [data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const progress = document.querySelector('.scroll-progress span');
  const year = document.querySelector('[data-year]');

  if (year) year.textContent = new Date().getFullYear();

  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 24);
    if (progress) {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.style.transform = `scaleX(${Math.min(1, window.scrollY / max)})`;
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      nav.classList.toggle('open', open);
      menu.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    }));
  }

  const revealFallback = () => {
    const nodes = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      nodes.forEach(el => el.classList.add('visible', 'on'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible', 'on');
        observer.unobserve(entry.target);
      });
    }, { threshold: .1, rootMargin: '0px 0px -5%' });
    nodes.forEach(el => observer.observe(el));
  };

  const isFluidHome = Boolean(document.querySelector('.hero-orbit') && document.querySelector('.product-river'));

  if (!isFluidHome || !window.gsap || !window.ScrollTrigger || reduceMotion) {
    revealFallback();
    return;
  }

  document.documentElement.classList.add('gsap-ready');
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  gsap.set('.hero-copy > *', { autoAlpha: 0, y: 34 });
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .to('.hero-eyebrow', { autoAlpha: 1, y: 0, duration: .65 })
    .to('.hero h1', { autoAlpha: 1, y: 0, duration: 1 }, '-=.38')
    .to('.lede', { autoAlpha: 1, y: 0, duration: .7 }, '-=.55')
    .to('.hero-actions', { autoAlpha: 1, y: 0, duration: .65 }, '-=.4');

  gsap.from('.core-logo', { scale: .72, autoAlpha: 0, duration: 1.1, ease: 'back.out(1.4)', delay: .25 });
  gsap.from('.orbit-line', { scale: .7, autoAlpha: 0, duration: 1.3, stagger: .13, ease: 'power3.out', delay: .3 });
  gsap.from('.float-product', { scale: .72, autoAlpha: 0, y: 20, duration: .75, stagger: .09, ease: 'back.out(1.6)', delay: .55 });

  gsap.to('.blob-a', { x: -80, y: 120, rotation: 20, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 } });
  gsap.to('.blob-b', { x: 90, y: -70, rotation: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.4 } });
  gsap.to('.blob-c', { y: 150, rotation: 35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });

  gsap.utils.toArray('.float-product').forEach((el, i) => {
    gsap.to(el, { y: i % 2 ? 9 : -10, rotation: i % 2 ? 1.2 : -1.1, duration: 2.8 + i * .17, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  });

  gsap.from('.fluid-head > *', { autoAlpha: 0, y: 36, duration: .85, stagger: .14, ease: 'power3.out', scrollTrigger: { trigger: '.fluid-head', start: 'top 82%', once: true } });
  gsap.utils.toArray('.river-card').forEach((card, i) => {
    gsap.from(card, { autoAlpha: 0, x: i % 2 ? 70 : -70, rotation: i % 2 ? 1.2 : -1.2, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 86%', once: true } });
  });

  gsap.from('.field-intro > *', { autoAlpha: 0, y: 34, duration: .8, stagger: .14, ease: 'power3.out', scrollTrigger: { trigger: '.field-intro', start: 'top 80%', once: true } });

  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const track = document.querySelector('[data-field-track]');
    const pin = document.querySelector('.field-pin');
    if (!track || !pin) return;
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${distance()}`,
        scrub: .9,
        pin: true,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });
    gsap.utils.toArray('.module-bubble').forEach((card, i) => {
      gsap.fromTo(card, { scale: .92, opacity: .58 }, {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          containerAnimation: tween,
          start: 'left 88%',
          end: 'center 58%',
          scrub: true
        }
      });
    });
  });

  mm.add('(max-width: 900px)', () => {
    gsap.from('.module-bubble', { autoAlpha: 0, y: 30, duration: .65, stagger: .055, ease: 'power2.out', scrollTrigger: { trigger: '.field-track', start: 'top 88%', once: true } });
  });

  gsap.to('.liosyna-rings i:nth-child(1)', { rotation: 360, duration: 32, repeat: -1, ease: 'none' });
  gsap.to('.liosyna-rings i:nth-child(2)', { rotation: -360, duration: 26, repeat: -1, ease: 'none' });
  gsap.to('.liosyna-rings i:nth-child(3)', { rotation: 360, duration: 21, repeat: -1, ease: 'none' });
  gsap.from('.liosyna-art .icon-frame', { autoAlpha: 0, scale: .68, rotation: -8, duration: 1.1, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.liosyna', start: 'top 68%', once: true } });
  gsap.from('.liosyna-copy > *', { autoAlpha: 0, y: 32, duration: .75, stagger: .11, ease: 'power3.out', scrollTrigger: { trigger: '.liosyna-copy', start: 'top 76%', once: true } });

  gsap.utils.toArray('.studio-piece').forEach((piece, i) => {
    gsap.from(piece, { autoAlpha: 0, y: 65, rotation: i % 2 ? 1.6 : -1.3, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: piece, start: 'top 86%', once: true } });
  });

  gsap.from('.principles-copy > *', { autoAlpha: 0, y: 28, duration: .75, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.principles', start: 'top 78%', once: true } });
  gsap.from('.principle', { autoAlpha: 0, scale: .78, y: 25, duration: .7, stagger: .1, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.principle-orbit', start: 'top 78%', once: true } });
  gsap.to('.principle-orbit', { rotation: 3, ease: 'none', scrollTrigger: { trigger: '.principles', start: 'top bottom', end: 'bottom top', scrub: 1.5 } });

  gsap.from('.contact > *:not(.contact-orb)', { autoAlpha: 0, y: 38, duration: .85, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.contact', start: 'top 78%', once: true } });
  gsap.to('.contact-orb', { rotation: 28, y: 80, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: 1.4 } });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 180);
  }, { passive: true });
})();
