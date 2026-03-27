import oauth2Client from "../config/googleAuth.js"
import { listWorkspaceTags ,
  listWorkspaceTriggers, createDynamicTrigger, createDynamicTag } from "../services/google/googleTagManager.services.js"
import { getGoogleTokens } from "../utils/storeGoogleTokens.js"
import { 
  TRIGGER_TYPES, 
  GTM_VARIABLES, 
  GTM_OPERATORS 
} from "../utils/googleTriggerTypes.js";
import { TAG_TYPES } from "../utils/googleTagTypes.js";

export const getTagsDiagnostic = async (req, res) => {
  try {
    const { accountId, containerId, workspaceId } = req.body;
    
    if (!accountId || !containerId || !workspaceId) {
      return res.status(400).json({
        error: "Missing required parameters"
      });
    }

    const tokens = getGoogleTokens();
    if (!tokens) {
      return res.status(401).json({ error: "Google tokens not found" });
    }

    oauth2Client.setCredentials(tokens);

    const tags = await listWorkspaceTags(
      oauth2Client,
      accountId,
      containerId,
      workspaceId
    );

    // On simplifie la réponse pour y voir clair
    const simplifiedTags = tags.map(tag => ({
      name: tag.name,
      type: tag.type,
      tagId: tag.tagId,
      parameter: tag.parameter
    }));

    res.json({
      total: tags.length,
      tags: simplifiedTags
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const getTriggersDiagnostic = async (req, res) => {
  try {
    const { accountId, containerId, workspaceId } = req.body;
    const tokens = getGoogleTokens();
    oauth2Client.setCredentials(tokens);

    const triggers = await listWorkspaceTriggers(
      oauth2Client,
      accountId,
      containerId,
      workspaceId
    );

    const detailedTriggers = triggers.map(t => {
      // On fusionne les différentes sources de filtres possibles
      const rawConditions = [
        ...(t.condition || []),
        ...(t.filter || []),
        ...(t.customEventFilter || [])
      ];

      return {
        name: t.name,
        type: t.type,
        triggerId: t.triggerId,
        filters: rawConditions.length > 0 ? rawConditions.map(c => ({
          variable: c.parameter?.find(p => p.key === "arg0")?.value || "unknown",
          operator: c.type,
          value: c.parameter?.find(p => p.key === "arg1")?.value || "unknown"
        })) : "All events (No filter found in API)"
      };
    });

    res.json({
      total: triggers.length,
      triggers: detailedTriggers
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleCreateTrigger = async (req, res) => {
  try {
    const { accountId, containerId, workspaceId, triggerData } = req.body;
    if (!accountId || !containerId || !workspaceId || !triggerData) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const tokens = getGoogleTokens();
    if (!tokens) return res.status(401).json({ error: "Google tokens not found" });
    oauth2Client.setCredentials(tokens);

    const formattedConfig = {
      name: triggerData.name,
      type: TRIGGER_TYPES[triggerData.typeKey],
      conditions: triggerData.conditions.map(c => ({
        variable: GTM_VARIABLES[c.varKey],
        operator: GTM_OPERATORS[c.opKey],
        value: c.value
      }))
    };

    const newTrigger = await createDynamicTrigger(
      oauth2Client,
      accountId,
      containerId,
      workspaceId,
      formattedConfig
    );

    res.status(201).json({
      message: "Trigger créé avec succès",
      trigger: newTrigger
    });

  } catch (error) {
    res.status(error.code || 500).json({
      error: error.message,
      details: error.errors || null
    });
  }
};

export const handleCreateTag = async (req, res) => {
  try {
    const { accountId, containerId, workspaceId, tagData } = req.body;
    const tokens = getGoogleTokens();
    oauth2Client.setCredentials(tokens);
    let parameters = {};

    if (tagData.typeKey === 'GOOGLE_TAG') {
      parameters = { tagId: tagData.trackingId };
    } else if (tagData.typeKey === 'CONVERSION_LINKER') {
      parameters = {
        enableCrossDomain: false,
        enableUrlPassthrough: false,
        enableCookieOverrides: false
      };
    }

    const formattedConfig = {
      name: tagData.name,
      type: TAG_TYPES[tagData.typeKey],
      parameters: parameters,
      firingTriggerIds: tagData.triggerIds
    };

    const newTag = await createDynamicTag(
      oauth2Client,
      accountId,
      containerId,
      workspaceId,
      formattedConfig
    );

    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};