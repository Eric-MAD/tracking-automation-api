import oauth2Client from "../config/googleAuth.js"
import { listGA4Accounts } from "../services/google/googleAnalytics.services.js"
import { listGTMAccounts } from "../services/google/googleTagManager.services.js"
import { getGoogleTokens } from "../utils/storeGoogleTokens.js"


export const listGoogleAccounts = async (req, res) => {

  try {

    const tokens = getGoogleTokens()

    if (!tokens) {
      return res.status(401).json({
        error: "Google not authenticated"
      })
    }

    oauth2Client.setCredentials(tokens)

    const ga4 = await listGA4Accounts(oauth2Client)
    const gtm = await listGTMAccounts(oauth2Client)

    res.json({
      ga4,
      gtm
    })

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}