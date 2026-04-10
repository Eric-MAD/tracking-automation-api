import { createDynamicTriggerSafe, createDynamicTagSafe } from "./googleTagManager.services.js";

export const setupBaseTracking = async (
  auth,
  accountId,
  containerId,
  workspaceId,
  config
) => {

  // Trigger All Pages (SAFE)
  const pageViewTrigger = await createDynamicTriggerSafe(
    auth,
    accountId,
    containerId,
    workspaceId,
    {
      name: "All Pages",
      type: "pageview"
    }
  )

  // Conversion Linker
  const conversionLinker = await createDynamicTagSafe(
    auth,
    accountId,
    containerId,
    workspaceId,
    {
      name: "Conversion Linker",
      type: "gclidw",
      parameters: {},
      firingTriggerIds: [pageViewTrigger.triggerId]
    }
  )

  // GA4 Google Tag
  const ga4GoogleTag = await createDynamicTagSafe(
    auth,
    accountId,
    containerId,
    workspaceId,
    {
      name: "GA4 Configuration Tag",
      type: "googtag",
      parameters: {
        tagId: config.ga4MeasurementId 
      },
      firingTriggerIds: [pageViewTrigger.triggerId]
    }
  )

  // Google Ads Tag
  const gadsGoogleTag = await createDynamicTagSafe(
    auth,
    accountId,
    containerId,
    workspaceId,
    {
      name: "GADS Configuration Tag",
      type: "googtag",
      parameters: {
        tagId: config.gadsMeasurementId
      },
      firingTriggerIds: [pageViewTrigger.triggerId]
    }
  )

  return {
    success: true,
    triggerId: pageViewTrigger.triggerId,
    tags: {
      conversionLinker,
      ga4GoogleTag,
      gadsGoogleTag
    }
  }
}