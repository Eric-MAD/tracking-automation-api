import oauth2Client from "../config/googleAuth.js"
import { createConversionLinkerTag, listWorkspaceTags,listWorkspaceTriggers } from "../services/google/googleTagManager.services.js"
import { getGoogleTokens } from "../utils/storeGoogleTokens.js"


export const createTestTag = async (req, res) => {
  try {
    const { accountId, containerId, workspaceId } = req.body;
    
    if (!accountId || !containerId || !workspaceId) {
      return res.status(400).json({
        error: "Missing required parameters: accountId, containerId, workspaceId"
      })
    }

    const tokens = getGoogleTokens()
    if (!tokens) {
      return res.status(401).json({ error: "Google tokens not found" })
    }

    oauth2Client.setCredentials(tokens);

    const tag = await createConversionLinkerTag(
      oauth2Client,
      accountId,
      containerId,
      workspaceId
    )

    res.status(201).json({
      message: "Tag created successfully",
      tag: tag
    })

  } catch (error) {
    // Si l'erreur persiste, on renvoie le message détaillé de Google
    res.status(error.code || 500).json({
      error: error.message,
      details: error.errors || null
    })
  }
}

export const getTagsDiagnostic = async (req, res) => {
  try {
    const { accountId, containerId, workspaceId } = req.body; // Ou req.query si vous préférez du GET
    
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