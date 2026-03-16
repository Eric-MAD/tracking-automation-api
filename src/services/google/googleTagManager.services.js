import { google } from "googleapis"

export const listGTMAccounts = async (auth) => {

  const tagmanager = google.tagmanager({
    version: "v2",
    auth
  })

  const res = await tagmanager.accounts.list()

  return res.data
}

export const createConversionLinkerTag = async (
  auth,
  accountId,
  containerId,
  workspaceId
) => {
  const tagmanager = google.tagmanager({
    version: "v2",
    auth
  })

  const parent = `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`

  const response = await tagmanager.accounts.containers.workspaces.tags.create({
    parent: parent,
    requestBody: {
      name: "Conversion Linker - API",
      type: "gclidw", 
            parameter: [
        {
          type: "boolean",
          key: "enableCrossDomain",
          value: "false"
        },
        {
          type: "boolean",
          key: "enableUrlPassthrough",
          value: "false"
        },
        {
          type: "boolean",
          key: "enableCookieOverrides",
          value: "false"
        }
      ],
      firingTriggerId: ["2147479553"]
    }
  })

  return response.data
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
