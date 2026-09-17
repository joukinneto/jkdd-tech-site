const { test, expect } = require('@playwright/test');

const routes = [
  { name: 'Home', path: '/', minIcons: 15 },
  { name: 'JKDD Field', path: '/products/field/', minIcons: 15 },
  { name: 'Family Finance', path: '/products/family-finance/', minIcons: 1 },
  { name: 'JKDD Connect', path: '/products/connect/', minIcons: 1 },
  { name: 'JKDD Leads', path: '/products/leads/', minIcons: 1 },
  { name: 'LIOSYNA AI', path: '/products/liosyna-ai/', minIcons: 1 },
  { name: 'Websites', path: '/websites/', minIcons: 3 }
];

for (const route of routes) {
  test(`${route.name}: official assets render and layout stays inside viewport`, async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    await page.goto(route.path, { waitUntil: 'networkidle' });

    const iconState = await page.locator('.icon-frame > img').evaluateAll(images =>
      images.map(img => ({
        src: img.currentSrc || img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        rectWidth: img.parentElement.getBoundingClientRect().width,
        rectHeight: img.parentElement.getBoundingClientRect().height
      }))
    );

    expect(iconState.length, `Expected sprite icons on ${route.path}`).toBeGreaterThanOrEqual(route.minIcons);
    for (const icon of iconState) {
      expect(icon.naturalWidth, `Broken sprite image ${icon.src} on ${route.path}`).toBeGreaterThan(0);
      expect(icon.naturalHeight, `Broken sprite image ${icon.src} on ${route.path}`).toBeGreaterThan(0);
      expect(icon.rectWidth, `Zero-size icon frame for ${icon.src} on ${route.path}`).toBeGreaterThan(10);
      expect(icon.rectHeight, `Zero-size icon frame for ${icon.src} on ${route.path}`).toBeGreaterThan(10);
    }

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
