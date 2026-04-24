export const ga4EventTagTemplate = ({ tagName, eventName, measurementId, triggerId }) => ({
  name: tagName,
  type: "gaawe",
  parameter: [
    { type: "template", key: "eventName", value: eventName },
    { type: "template", key: "measurementIdOverride", value: measurementId }
  ],
  firingTriggerId: [triggerId]
})

export const googleAdsTagTemplate = ({ tagName, eventName, conversionId, conversionLabel, triggerId }) => ({
  name: tagName,
  type: "awct",
  parameter: [
    { type: "template", key: "eventName", value: eventName },
    { type: "integer", key: "conversionId", value: conversionId },
    { type: "template", key: "conversionLabel", value: conversionLabel }
  ],
  firingTriggerId: [triggerId]
})