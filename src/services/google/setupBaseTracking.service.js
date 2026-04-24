import { createDynamicTriggerSafe, createDynamicTagSafe } from "./googleTagManager.services.js";

export const setupBaseTracking = async (
  auth,
  accountId,
  containerId,
  workspaceId,
  config
) => {

  const conversionLinkerTrigger = await createDynamicTriggerSafe(
    auth,
    accountId,
    containerId,
    workspaceId,
    {
      name: "All Pages",
      type: "pageview"
    }
  );

  const googleTagTrigger = await createDynamicTriggerSafe(
    auth,
    accountId,
    containerId,
    workspaceId,
    {
      name: "Initialization - All Pages",
      type: "init"
    }
  );

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
      firingTriggerIds: [conversionLinkerTrigger.triggerId]
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
      firingTriggerIds: [googleTagTrigger.triggerId]
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
      firingTriggerIds: [googleTagTrigger.triggerId]
    }
  )

  return {
    success: true,
    triggerId: [{ conversionLinkerTriggerId: conversionLinkerTrigger.triggerId }, { googleTagTriggerId: googleTagTrigger.triggerId }],
    tags: {
      conversionLinker,
      ga4GoogleTag,
      gadsGoogleTag
    }
  }
}