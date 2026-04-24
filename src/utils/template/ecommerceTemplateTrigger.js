import { mapFilterToGTM } from "../mapper/ecommerceGtmFilterMapper.js";

const buildFilters = (conditions) => {
  if (!conditions || !Array.isArray(conditions)) {
    throw new Error("conditions must be an array")
  }

  return conditions.map(mapFilterToGTM)
}

const clickTriggerTemplate = (config) => {
  return {
    name: config.triggerName,
    type: "click",
    filter: buildFilters(config.conditions)
  }
}

const pageViewTriggerTemplate = (config) => {
  return {
    name: config.triggerName,
    type: "pageview",
    filter: buildFilters(config.conditions)
  }
}
const eventTriggerTemplate = (config) => {
  if (!config.conditions || config.conditions.length === 0) {
    throw new Error("Custom event requires at least one condition")
  }

  const eventCondition = config.conditions.find(
    (c) => c.variable === "{{_event}}"
  )

  if (!eventCondition) {
    throw new Error("Custom event trigger requires a {{_event}} condition")
  }

  const otherConditions = config.conditions.filter(
    (c) => c.variable !== "{{_event}}"
  )

  return {
  name: config.triggerName,
  type: "customEvent",
  customEventName: eventCondition.value,     
  customEventFilter: [mapFilterToGTM(eventCondition)],
  ...(otherConditions.length > 0 && {
    filter: otherConditions.map(mapFilterToGTM)
  })
}
}

export const addToCartGenerateTriggerConfig = (config) => {
  const triggerName = "Add to cart - Trigger"

  switch (config.type) {
    case "click":
      return clickTriggerTemplate({ ...config, triggerName })

    case "pageview":
      return pageViewTriggerTemplate({ ...config, triggerName })

    case "customEvent":
      return eventTriggerTemplate({ ...config, triggerName })

    default:
      throw new Error(`Unsupported trigger type: ${config.type}`)
  }
}

export const beginCheckoutGenerateTriggerConfig = (config) => {
  const triggerName = "Begin Checkout - Trigger"

  switch (config.type) {
    case "click":
      return clickTriggerTemplate({ ...config, triggerName })

    case "pageview":
      return pageViewTriggerTemplate({ ...config, triggerName })

    case "customEvent":
      return eventTriggerTemplate({ ...config, triggerName })

    default:
      throw new Error(`Unsupported trigger type: ${config.type}`)
  }
}