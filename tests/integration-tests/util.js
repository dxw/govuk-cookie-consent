/* eslint-disable import/prefer-default-export */
/* global page */

async function clearAllCookies() {
  // send clearBrowserCookies to raw devtools protocol.
  // https://github.com/GoogleChrome/puppeteer/issues/1632#issuecomment-353086292
  // need to be on localhost to clear cookies for this domain
  await page.goto('http://localhost:8080');
  await page._client().send('Network.clearBrowserCookies'); // eslint-disable-line no-underscore-dangle
}

async function getConsentSettings() {
  const allCookies = await page._client().send('Network.getAllCookies'); // eslint-disable-line no-underscore-dangle
  const rawconsentSettings = allCookies.cookies.find(obj => obj.name === 'govuk-cookie-consent');

  return JSON.parse(decodeURIComponent(rawconsentSettings.value));
}

module.exports = { clearAllCookies, getConsentSettings };
