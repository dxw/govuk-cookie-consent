/* global page expect */

import { clearAllCookies, getConsentSettings } from './util';

const waitForSettings = async () => {
  await page.waitForSelector('#govuk-cookie-page_form');
};

const loadPage = async () => {
  await page.goto('http://localhost:8080/tests/example/cookie-settings.html');
  await waitForSettings();
};

describe('Settings form is usable', () => {
  beforeEach(async () => {
    await clearAllCookies();
    await loadPage();
  });

  it('should show all the settings', async () => {
    await expect(page).toMatch('Do you want to accept analytics cookies?');
    await expect(page).toMatch('Do you want to accept marketing cookies?');
    await expect(page).toMatch('Do you want to accept preference cookies?');
  });

  it('should allow all settings to be set', async () => {
    await page.click('#analytics-cookies');
    await page.click('#marketing-cookies');
    await page.click('#preferences-cookies');

    await page.click('#govuk-cookie-page_save');

    await expect(page).toMatch('You’ve set your cookie preferences.');

    const consentSettings = await getConsentSettings();

    await expect(consentSettings.consented).toEqual(true);

    await expect(consentSettings.analytics).toEqual(true);
    await expect(consentSettings.marketing).toEqual(true);
    await expect(consentSettings.preferences).toEqual(true);
  });
});

describe('setting and resetting values', () => {
  let consentSettings;

  beforeEach(async () => {
    await clearAllCookies();
    await loadPage();
  });

  it('should allow analytics settings to be set', async () => {
    await page.click('#analytics-cookies');
    await page.click('#govuk-cookie-page_save');

    await loadPage();

    await page.click('#analytics-cookies-2');
    await page.click('#govuk-cookie-page_save');

    consentSettings = await getConsentSettings();

    await expect(consentSettings.analytics).toEqual(false);
  });

  it('should allow marketing settings to be set', async () => {
    await page.click('#marketing-cookies');
    await page.click('#govuk-cookie-page_save');

    await loadPage();

    await page.click('#marketing-cookies-2');
    await page.click('#govuk-cookie-page_save');

    consentSettings = await getConsentSettings();

    await expect(consentSettings.marketing).toEqual(false);
  });

  it('should allow preferences settings to be set', async () => {
    await page.click('#preferences-cookies');
    await page.click('#govuk-cookie-page_save');

    await loadPage();

    await page.click('#preferences-cookies-2');
    await page.click('#govuk-cookie-page_save');

    consentSettings = await getConsentSettings();

    await expect(consentSettings.preferences).toEqual(false);
  });
});

describe('default values', () => {
  beforeEach(async () => {
    await clearAllCookies();
    await loadPage();
  });

  it('should set all radio buttons to "No" by default', async () => {
    const analyticsValue = await page.evaluate(async () => document.querySelector('#analytics-cookies-2').checked);
    const marketingValue = await page.evaluate(async () => document.querySelector('#marketing-cookies-2').checked);
    const preferencesValue = await page.evaluate(async () => document.querySelector('#preferences-cookies-2').checked);

    expect(analyticsValue).toBe(true);
    expect(marketingValue).toBe(true);
    expect(preferencesValue).toBe(true);
  });

  it('should set the analytics options once they have been set', async () => {
    await page.click('#analytics-cookies');
    await page.click('#govuk-cookie-page_save');

    await loadPage();

    const analyticsValue = await page.evaluate(async () => document.querySelector('#analytics-cookies').checked);

    expect(analyticsValue).toBe(true);
  });

  it('should set the marketing options once they have been set', async () => {
    await page.click('#marketing-cookies');
    await page.click('#govuk-cookie-page_save');

    await loadPage();

    const marketingValue = await page.evaluate(async () => document.querySelector('#marketing-cookies').checked);

    expect(marketingValue).toBe(true);
  });

  it('should set the preferences options once they have been set', async () => {
    await page.click('#preferences-cookies');
    await page.click('#govuk-cookie-page_save');

    await loadPage();

    const preferencesValue = await page.evaluate(async () => document.querySelector('#preferences-cookies').checked);

    expect(preferencesValue).toBe(true);
  });
});
