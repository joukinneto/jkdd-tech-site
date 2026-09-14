(() => {
  const iconStyles = document.createElement('link');
  iconStyles.rel = 'stylesheet';
  iconStyles.href = '/assets/css/field-icons-hotfix.css?v=20260914-3';
  document.head.appendChild(iconStyles);

  // Render the official JKDD product/module atlas with browser-safe values.
  // CSS multiplication inside calc() is not supported consistently by Safari,
  // so positions are resolved here using ordinary JavaScript arithmetic.
  const renderOfficialAtlas = () => {
    document.querySelectorAll('.atlas').forEach(el => {
      const styles = getComputedStyle(el);
      const x = Number.parseInt(styles.getPropertyValue('--x').trim() || '0', 10) || 0;
      const y = Number.parseInt(styles.getPropertyValue('--y').trim() || '0', 10) || 0;

      el.style.backgroundImage = "url('/assets/brand/product-atlas.webp')";
      el.style.backgroundSize = '500% 400%';
      el.style.backgroundPosition = `${x * 25}% ${y * (100 / 3)}%`;
      el.style.backgroundRepeat = 'no-repeat';
    });
  };

  renderOfficialAtlas();
  window.addEventListener('pageshow', renderOfficialAtlas);

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
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  const canTilt = !reduceMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (canTilt) {
    document.querySelectorAll('.tilt').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => card.style.transform = '');
    });
  }
})();