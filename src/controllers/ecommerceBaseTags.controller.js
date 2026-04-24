import oauth2Client from "../config/googleAuth.js"
import { ecommerceBaseTags } from "../services/google/ecommerceBaseTags.services.js"

export const createEcommerceSetup = async (req, res) => {

  try {

    const {
      accountId,
      containerId,
      workspaceId,
      config
    } = req.body

    if (!accountId || !containerId || !workspaceId) {
      return res.status(400).json({
        error: "Missing required fields"
      })
    }

    const result = await ecommerceBaseTags(
      oauth2Client,
      accountId,
      containerId,
      workspaceId,
      config
    )

    res.json(result)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}