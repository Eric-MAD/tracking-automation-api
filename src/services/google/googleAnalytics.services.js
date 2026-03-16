import { google } from "googleapis"

export const listGA4Accounts = async (auth) => {

  const analyticsAdmin = google.analyticsadmin({
    version: "v1beta",
    auth
  })

  const res = await analyticsAdmin.accounts.list()

  return res.data
}