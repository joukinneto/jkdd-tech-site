(() => {
  const assetQa = window.__JKDD_ASSET_QA__ = {
    total: 0,
    rendered: 0,
    failed: 0,
    ready: false,
    source: '/assets/brand/product-atlas.webp?v=20260916-materialize-2'
  };

  const getAtlasCoordinates = (el) => {
    const positionClass = [...el.classList].find(name => /^[fs]\d\d$/.test(name));
    if (positionClass) {
      return [Number(positionClass[1]), Number(positionClass[2])];
    }

    if (el.classList.contains('field-app-sprite')) return [0, 0];

    const styles = getComputedStyle(el);
    const x = Number.parseInt(styles.getPropertyValue('--x') || el.style.getPropertyValue('--x') || '0', 10);
    const y = Number.parseInt(styles.getPropertyValue('--y') || el.style.getPropertyValue('--y') || '0', 10);
    return [Number.isFinite(x) ? x : 0, Number.isFinite(y) ? y : 0];
  };

  const ensureAssetFrame = (el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width > 1 && rect.height > 1) return;

    const styles = getComputedStyle(el);
    const declaredSize = styles.getPropertyValue('--size').trim() || el.style.getPropertyValue('--size').trim();
    const fallback = el.classList.contains('atlas') ? '116px' : '96px';
    const size = declaredSize || fallback;

    el.style.display = 'block';
    el.style.position = 'relative';
    el.style.width = size;
    el.style.height = size;
    el.style.minWidth = size;
    el.style.minHeight = size;
    el.style.flex = '0 0 auto';
    el.style.overflow = 'hidden';
  };

  const materializeOfficialAssets = () => {
    const targets = [...document.querySelectorAll('.atlas-frame, .atlas, .field-sprite')]
      .filter(el => !el.dataset.assetMaterialized);

    assetQa.total = targets.length;
    if (!targets.length) {
      assetQa.ready = true;
      window.dispatchEvent(new CustomEvent('jkdd:assets-ready', { detail: assetQa }));
      return;
    }

    targets.forEach(ensureAssetFrame);

    const atlas = new Image();
    atlas.decoding = 'async';
    atlas.src = assetQa.source;

    atlas.onload = () => {
      const columns = 5;
      const rows = 4;
      const cellWidth = Math.round(atlas.naturalWidth / columns);
      const cellHeight = Math.round(atlas.naturalHeight / rows);
      const cache = new Map();

      targets.forEach(el => {
        try {
          const [x, y] = getAtlasCoordinates(el);
          if (x < 0 || x >= columns || y < 0 || y >= rows) throw new Error(`Invalid atlas cell ${x},${y}`);

          const key = `${x}:${y}`;
          let src = cache.get(key);
          if (!src) {
            const canvas = document.createElement('canvas');
            canvas.width = cellWidth;
            canvas.height = cellHeight;
            const ctx = canvas.getContext('2d', { alpha: true });
            if (!ctx) throw new Error('Canvas 2D context unavailable');
            ctx.clearRect(0, 0, cellWidth, cellHeight);
            ctx.drawImage(
              atlas,
              x * cellWidth,
              y * cellHeight,
              cellWidth,
              cellHeight,
              0,
              0,
              cellWidth,
              cellHeight
            );
            src = canvas.toDataURL('image/png');
            cache.set(key, src);
          }

          const existingImg = el.querySelector('img');
          const label = el.getAttribute('aria-label') || existingImg?.alt || '';
          const rendered = document.createElement('img');
          rendered.src = src;
          rendered.alt = label;
          rendered.className = 'official-asset-img';
          rendered.decoding = 'sync';
          rendered.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:contain;display:block;transform:none;left:0;top:0;';

          el.replaceChildren(rendered);
          el.style.backgroundImage = 'none';
          el.dataset.assetMaterialized = 'true';
          el.classList.add('official-asset-ready');
          assetQa.rendered += 1;
        } catch (error) {
          assetQa.failed += 1;
          el.dataset.assetMaterialized = 'failed';
          el.classList.add('official-asset-failed');
          console.error('[JKDD assets] render failed', error, el);
        }
      });

      assetQa.ready = true;
      window.dispatchEvent(new CustomEvent('jkdd:assets-ready', { detail: assetQa }));
    };

    atlas.onerror = () => {
      assetQa.failed = targets.length;
      assetQa.ready = true;
      targets.forEach(el => el.classList.add('official-asset-failed'));
      console.error('[JKDD assets] product atlas failed to load:', assetQa.source);
      window.dispatchEvent(new CustomEvent('jkdd:assets-ready', { detail: assetQa }));
    };
  };

  materializeOfficialAssets();

  const isFluidHome = Boolean(document.querySelector('.hero-orbit') && document.querySelector('.product-river'));

  if (isFluidHome) {
    const legacy = document.querySelector('link[href*="/assets/css/styles.css"]');
    const fluid = document.createElement('link');
    fluid.rel = 'stylesheet';
    fluid.href = '/assets/css/home-fluid.css?v=20260916-fluid-2';
    fluid.onload = () => legacy?.remove();
    document.head.appendChild(fluid);

    const script = document.createElement('script');
    script.src = '/assets/js/home-fluid.js?v=20260916-fluid-2';
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
