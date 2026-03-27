export const TAG_TYPES = {
  GOOGLE_TAG: 'googtag',   
  CONVERSION_LINKER: 'gclidw', 
  GA4_EVENT: 'ga4e'
};

/**
 * @param {Object} paramsObj - Un simple objet { key: value }
 */
export const buildGTMParameters = (paramsObj) => {
  return Object.entries(paramsObj).map(([key, value]) => {
    let type = "template";
    if (typeof value === "boolean") type = "boolean";
    
    return {
      type: type,
      key: key,
      value: String(value)
    };
  });
};