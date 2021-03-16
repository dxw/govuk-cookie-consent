/* global page, expect, beforeAll */

describe('Javascript API', () => {
  const getGlobal = async () => page.evaluate(async () => window.GovUkCookieConsent);

  beforeAll(async () => {
    await page.goto('http://localhost:8080/tests/example/');
  });

  it('should expose a global object', async () => {
    const GovUkCookieConsent = await getGlobal('GovUkCookieConsent');
    expect(typeof GovUkCookieConsent).toBe('object');
  });

  it('should show the version', async () => {
    const GovUkCookieConsent = await getGlobal('GovUkCookieConsent');
    expect(typeof GovUkCookieConsent.VERSION).toBe('string');
  });

  it('version should be a semver string', async () => {
    const GovUkCookieConsent = await getGlobal('GovUkCookieConsent');
    const version = GovUkCookieConsent.VERSION;

    // simple regex matching three numbers separated by dots.
    expect(version).toMatch(/^([0-9]+)\.([0-9]+)\.([0-9]+)$/);
  });
});
