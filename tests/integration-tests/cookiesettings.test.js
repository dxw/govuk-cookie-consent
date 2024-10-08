/* global page expect */

const { clearAllCookies, getConsentSettings } = require('./util');

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
    const cookieText = await page.evaluate(() => document.querySelector('#govuk-cookie-page_form').innerText);
    await expect(cookieText).toMatch('Do you want to accept analytics cookies?');
    await expect(cookieText).toMatch('Do you want to accept marketing cookies?');
    await expect(cookieText).toMatch('Do you want to accept preference cookies?');
  });

  it('should allow all settings to be set', async () => {
    await page.click('#statistics-cookies');
    await page.click('#marketing-cookies');
    await page.click('#preferences-cookies');

    await page.click('#govuk-cookie-page_save');

    const cookieText = await page.evaluate(() => document.querySelector('.govuk-notification-banner__heading').innerText);
    await expect(cookieText).toMatch('You’ve set your cookie preferences.');

    const consentSettings = await getConsentSettings();

    await expect(consentSettings.consented).toEqual(true);

    await expect(consentSettings.statistics).toEqual(true);
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

  it('should allow statistics settings to be set', async () => {
    await page.click('#statistics-cookies');
    await page.click('#govuk-cookie-page_save');

    await loadPage();

    await page.click('#statistics-cookies-2');
    await page.click('#govuk-cookie-page_save');

    consentSettings = await getConsentSettings();

    await expect(consentSettings.statistics).toEqual(false);
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
    const statisticsValue = await page.evaluate(async () => document.querySelector('#statistics-cookies-2').checked);
    const marketingValue = await page.evaluate(async () => document.querySelector('#marketing-cookies-2').checked);
    const preferencesValue = await page.evaluate(async () => document.querySelector('#preferences-cookies-2').checked);

    expect(statisticsValue).toBe(true);
    expect(marketingValue).toBe(true);
    expect(preferencesValue).toBe(true);
  });

  it('should set the statistics options once they have been set', async () => {
    await page.click('#statistics-cookies');
    await page.click('#govuk-cookie-page_save');

    await loadPage();

    const statisticsValue = await page.evaluate(async () => document.querySelector('#statistics-cookies').checked);

    expect(statisticsValue).toBe(true);
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
