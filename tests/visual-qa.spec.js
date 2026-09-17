const { test, expect } = require('@playwright/test');

const routes = [
  { name: 'Home', path: '/', minAssets: 20 },
  { name: 'JKDD Field', path: '/products/field/', minAssets: 15 },
  { name: 'Family Finance', path: '/products/family-finance/', minAssets: 1 },
  { name: 'LIOSYNA AI', path: '/products/liosyna-ai/', minAssets: 2 },
  { name: 'Websites', path: '/websites/', minAssets: 4 }
];

for (const route of routes) {
  test(`${route.name}: official assets render visibly and layout stays inside viewport`, async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    await page.goto(route.path, { waitUntil: 'domcontentloaded' });

    await page.waitForFunction(() => window.__JKDD_ASSET_QA__?.ready === true, null, { timeout: 15_000 });
    const qa = await page.evaluate(() => ({ ...window.__JKDD_ASSET_QA__ }));

    expect(qa.failed, `Asset materializer failures on ${route.path}`).toBe(0);
    expect(qa.rendered, `Expected official assets on ${route.path}`).toBeGreaterThanOrEqual(route.minAssets);

    const officialAssetState = await page.locator('.atlas-frame, .atlas, .field-sprite').evaluateAll(elements =>
      elements.map(el => {
        const img = el.querySelector('img.official-asset-img');
        const rect = el.getBoundingClientRect();
        let visiblePixels = 0;
        let totalPixels = 0;

        if (img && img.complete && img.naturalWidth > 0) {
          const canvas = document.createElement('canvas');
          canvas.width = 32;
          canvas.height = 32;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            ctx.clearRect(0, 0, 32, 32);
            ctx.drawImage(img, 0, 0, 32, 32);
            const pixels = ctx.getImageData(0, 0, 32, 32).data;
            totalPixels = pixels.length / 4;
            for (let i = 3; i < pixels.length; i += 4) {
              if (pixels[i] > 12) visiblePixels += 1;
            }
          }
        }

        return {
          label: img?.alt || el.getAttribute('aria-label') || 'unnamed asset',
          materialized: el.dataset.assetMaterialized,
          hasImage: Boolean(img),
          naturalWidth: img?.naturalWidth || 0,
          naturalHeight: img?.naturalHeight || 0,
          width: rect.width,
          height: rect.height,
          visiblePixels,
          totalPixels
        };
      })
    );

    for (const asset of officialAssetState) {
      expect(asset.materialized, asset.label).toBe('true');
      expect(asset.hasImage, asset.label).toBe(true);
      expect(asset.naturalWidth, asset.label).toBeGreaterThan(0);
      expect(asset.naturalHeight, asset.label).toBeGreaterThan(0);
      expect(asset.width, asset.label).toBeGreaterThan(20);
      expect(asset.height, asset.label).toBeGreaterThan(20);
      expect(asset.totalPixels, asset.label).toBeGreaterThan(0);
      expect(asset.visiblePixels, `${asset.label} rendered as an empty/transparent image`).toBeGreaterThan(12);
    }

    await page.waitForLoadState('networkidle').catch(() => {});

    const brokenImages = await page.locator('img').evaluateAll(images =>
      images
        .filter(img => img.complete && img.naturalWidth === 0)
        .map(img => img.currentSrc || img.src || img.alt || 'unknown image')
    );
    expect(brokenImages, `Broken <img> elements on ${route.path}`).toEqual([]);

    const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - window.innerWidth));
    expect(overflow, `Horizontal overflow on ${route.path}`).toBeLessThanOrEqual(2);
    expect(pageErrors, `JavaScript errors on ${route.path}`).toEqual([]);
  });
}
