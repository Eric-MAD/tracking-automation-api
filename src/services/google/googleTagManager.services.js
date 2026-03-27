import { google } from "googleapis"
import { buildGTMFilter } from "../../utils/googleTriggerTypes.js"
import { buildGTMParameters } from "../../utils/googleTagTypes.js"
export const listGTMAccounts = async (auth) => {

  const tagmanager = google.tagmanager({
    version: "v2",
    auth
  })

  const res = await tagmanager.accounts.list()

  return res.data
}

export const listWorkspaceTags = async (
  auth,
  accountId,
  containerId,
  workspaceId
) => {
  const tagmanager = google.tagmanager({
    version: "v2",
    auth
  });

  const parent = `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`;

  const response = await tagmanager.accounts.containers.workspaces.tags.list({
    parent: parent
  });

  return response.data.tag || [];
};

export const listWorkspaceTriggers = async (
  auth,
  accountId,
  containerId,
  workspaceId
) => {
  const tagmanager = google.tagmanager({
    version: "v2",
    auth
  });

  const parent = `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`;

  const response = await tagmanager.accounts.containers.workspaces.triggers.list({
    parent: parent
  });

  return response.data.trigger || [];
};

export const createDynamicTrigger = async (auth, accountId, containerId, workspaceId, config) => {
  const tagmanager = google.tagmanager({ version: "v2", auth });
  const parent = `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`;

  const { name, type, conditions } = config;
  const requestBody = {
    name: name,
    type: type,
  };

  if (conditions && conditions.length > 0) {
    const filters = conditions.map(cond => 
      buildGTMFilter(cond.variable, cond.operator, cond.value)
    );
    if (type === 'customEvent') {
      requestBody.customEventFilter = filters;
    } else {
      requestBody.filter = filters;
    }
  }

  const response = await tagmanager.accounts.containers.workspaces.triggers.create({
    parent: parent,
    requestBody: requestBody
  });

  return response.data;
};

export const setupBuiltInVariables = async (auth, accountId, containerId, workspaceId, variableTypes) => {
  const tagmanager = google.tagmanager({ version: "v2", auth });
  const parent = `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`;

  return await tagmanager.accounts.containers.workspaces.built_in_variables.create({
    parent: parent,
    type: variableTypes
  });
};

export const createDynamicTag = async (auth, accountId, containerId, workspaceId, config) => {
  const tagmanager = google.tagmanager({ version: "v2", auth });
  const parent = `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`;

  const { name, type, parameters, firingTriggerIds } = config;

  const requestBody = {
    name: name,
    type: type,
    parameter: buildGTMParameters(parameters),
    firingTriggerId: firingTriggerIds || [] // Liste des IDs de triggers
  };

  const response = await tagmanager.accounts.containers.workspaces.tags.create({
    parent: parent,
    requestBody: requestBody
  });

  return response.data;
};