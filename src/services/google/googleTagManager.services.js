import { google } from "googleapis"

export const listGTMAccounts = async (auth) => {

  const tagmanager = google.tagmanager({
    version: "v2",
    auth
  })

  const res = await tagmanager.accounts.list()

  return res.data
}