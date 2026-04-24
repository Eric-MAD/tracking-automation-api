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


const getTagByName = async (auth, accountId, containerId, workspaceId, name) => {
  const tags = await listWorkspaceTags(auth, accountId, containerId, workspaceId)
  return tags.find(t => t.name === name)
}

const getTriggerByName = async (auth, accountId, containerId, workspaceId, name) => {
  const triggers = await listWorkspaceTriggers(auth, accountId, containerId, workspaceId)
  return triggers.find(t => t.name === name)
}

export const createDynamicTriggerSafe = async (
  auth,
  accountId,
  containerId,
  workspaceId,
  config
) => {

  const existing = await getTriggerByName(
    auth,
    accountId,
    containerId,
    workspaceId,
    config.name
  )

  if (existing) {
    console.log(`Trigger "${config.name}" already exists`)
    return existing
  }

  return await createDynamicTrigger(
    auth,
    accountId,
    containerId,
    workspaceId,
    config
  )
}

export const createDynamicTagSafe = async (
  auth,
  accountId,
  containerId,
  workspaceId,
  config
) => {

  const existing = await getTagByName(
    auth,
    accountId,
    containerId,
    workspaceId,
    config.name
  )

  if (existing) {
    console.log(`Tag "${config.name}" already exists`)
    return existing
  }

  return await createDynamicTag(
    auth,
    accountId,
    containerId,
    workspaceId,
    config
  )
}

export const createTriggerFromConfig = async (
  auth,
  accountId,
  containerId,
  workspaceId,
  config 
) => {
  const tagmanager = google.tagmanager({ version: "v2", auth });
  const parent = `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`;

  const triggers = await listWorkspaceTriggers(auth, accountId, containerId, workspaceId);
  const existing = triggers.find(t => t.name === config.name);

  if (existing) {
    console.log(`Trigger "${config.name}" already exists`);
    return existing;
  }

  const response = await tagmanager.accounts.containers.workspaces.triggers.create({
    parent,
    requestBody: config 
  });

  return response.data;
};

export const createTagFromConfig = async (
  auth,
  accountId,
  containerId,
  workspaceId,
  config
) => {
  const tagmanager = google.tagmanager({ version: "v2", auth });
  const parent = `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`;

  const tags = await listWorkspaceTags(auth, accountId, containerId, workspaceId);
  const existing = tags.find(t => t.name === config.name);

  if (existing) {
    console.log(`Tag "${config.name}" already exists`);
    return existing;
  }

  const response = await tagmanager.accounts.containers.workspaces.tags.create({
    parent,
    requestBody: config
  });

  return response.data;
};