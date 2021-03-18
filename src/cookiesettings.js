import settingsHtml from './html/settings.html';

import statisticsSettings from './html/_statistics_settings.html';
import marketingSettings from './html/_marketing_settings.html';
import preferencesSettings from './html/_preferences_settings.html';

function appendSettings(doc, html) {
  const div = doc.createElement('div');
  const settingsWrapper = doc.getElementById('govuk-cookie-page_settings');

  div.innerHTML = html;
  settingsWrapper.appendChild(div);
}

function applyDefault(key, form, consentSettings) {
  const element = form.elements[`${key}-cookies`];
  const setting = !!consentSettings[key];

  if (element !== undefined) {
    if (setting === true) {
      element.value = 'yes';
    } else {
      element.value = 'no';
    }
  }
}

function applyDefaults(consentSettings) {
  const form = document['govuk-cookie-page_form'];

  applyDefault('statistics', form, consentSettings);
  applyDefault('marketing', form, consentSettings);
  applyDefault('preferences', form, consentSettings);
}

/**
 * Insert the cookie preferences form into a specified portion of a page
 * @param {Element} element the element to inject the form into
 * @param {object} consentSettings the existing consent settings, so we can set defaults.
 * Returns the form element that has been injected
 */
export default function insertCookieSettings(element, consentSettings) {
  const wrapper = element;
  const doc = document.implementation.createHTMLDocument('');

  doc.body.innerHTML = settingsHtml;

  if (element.dataset.statistics !== undefined) {
    appendSettings(doc, statisticsSettings);
  }

  if (element.dataset.marketing !== undefined) {
    appendSettings(doc, marketingSettings);
  }

  if (element.dataset.preferences !== undefined) {
    appendSettings(doc, preferencesSettings);
  }

  wrapper.innerHTML = doc.body.innerHTML;

  applyDefaults(consentSettings);

  return document.getElementById('govuk-cookie-page_form');
}
