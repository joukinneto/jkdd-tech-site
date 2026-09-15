(() => {
  const renderAtlasSafely = () => {
    document.querySelectorAll('.atlas').forEach(el => {
      if (el.dataset.safeAtlas === '1') return;
      const styles = getComputedStyle(el);
      const x = Number.parseFloat(styles.getPropertyValue('--x')) || 0;
      const y = Number.parseFloat(styles.getPropertyValue('--y')) || 0;
      const size = styles.getPropertyValue('--size').trim() || '90px';

      el.dataset.safeAtlas = '1';
      el.style.backgroundImage = 'none';
      el.style.background = 'none';
      el.style.position = 'relative';
      el.style.display = 'block';
      el.style.width = size;
      el.style.height = size;
      el.style.minWidth = size;
      el.style.minHeight = size;
      el.style.overflow = 'hidden';
      el.style.flex = '0 0 auto';

      const img = document.createElement('img');
      img.src = '/assets/brand/product-atlas.webp?v=20260914-6';
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.decoding = 'async';
      img.style.position = 'absolute';
      img.style.left = '0';
      img.style.top = '0';
      img.style.width = '500%';
      img.style.height = '400%';
      img.style.maxWidth = 'none';
      img.style.objectFit = 'fill';
      img.style.transformOrigin = 'top left';
      img.style.transform = `translate(${-x * 20}%, ${-y * 25}%)`;
      img.style.pointerEvents = 'none';
      img.style.userSelect = 'none';
      el.appendChild(img);
    });
  };

  renderAtlasSafely();

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