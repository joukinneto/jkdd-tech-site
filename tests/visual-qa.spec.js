const { test, expect } = require('@playwright/test');

const routes = [
  { name: 'Home', path: '/', minAssets: 20 },
  { name: 'JKDD Field', path: '/products/field/', minAssets: 15 },
  { name: 'Family Finance', path: '/products/family-finance/', minAssets: 1 },
  { name: 'LIOSYNA AI', path: '/products/liosyna-ai/', minAssets: 2 },
  { name: 'Websites', path: '/websites/', minAssets: 4 }
];

for (const route of routes) {
  test(`${route.name}: official assets render and layout stays inside viewport`, async ({ page }) => {
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
        return {
          materialized: el.dataset.assetMaterialized,
          hasImage: Boolean(img),
          naturalWidth: img?.naturalWidth || 0,
          naturalHeight: img?.naturalHeight || 0,
          width: rect.width,
          height: rect.height
        };
      })
    );

    for (const asset of officialAssetState) {
      expect(asset.materialized).toBe('true');
      expect(asset.hasImage).toBe(true);
      expect(asset.naturalWidth).toBeGreaterThan(0);
      expect(asset.naturalHeight).toBeGreaterThan(0);
      expect(asset.width).toBeGreaterThan(20);
      expect(asset.height).toBeGreaterThan(20);
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
