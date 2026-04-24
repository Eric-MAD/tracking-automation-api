export const GTM_OPERATORS = {
  CONTAINS: 'contains',
  EQUALS: 'equals',
  MATCHES_CSS: 'cssSelector', 
  STARTS_WITH: 'startsWith',
  REGEX: 'regex'
};

export const GTM_VARIABLES = {
  CLICK_ELEMENT: '{{Click Element}}',
  CLICK_CLASSES: '{{Click Classes}}',
  CLICK_ID: '{{Click ID}}',
  CLICK_URL: '{{Click URL}}',
  PAGE_PATH: '{{Page Path}}',
  PAGE_URL: '{{Page URL}}',
  FORM_ID: '{{Form ID}}'
};

export const TRIGGER_TYPES = {
  INITIALIZATION: 'init',  
  CONSENT_INIT: 'consent_init',
  PAGE_VIEW: 'pageview',
  CLICK_ALL: 'click',
  CLICK_LINKS: 'linkClick',
  FORM_SUBMISSION: 'formSubmission',
  CUSTOM_EVENT: 'customEvent',
  HISTORY_CHANGE: 'historyChange'
};

export const buildGTMFilter = (variable, operator, value) => {
  return {
    type: operator,
    parameter: [
      { type: "template", key: "arg0", value: variable },
      { type: "template", key: "arg1", value: value }
    ]
  };
};