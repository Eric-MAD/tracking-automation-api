import { setupBaseTracking } from "../services/google/setupBaseTracking.service.js"
import oauth2Client from "../config/googleAuth.js"
import { getGoogleTokens } from "../utils/storeGoogleTokens.js"

export const setupBaseTrackingController = async (req, res) => {
  try {
    const { accountId, containerId, workspaceId, ga4MeasurementId, gadsMeasurementId } = req.body;

    const tokens = getGoogleTokens();
    if (!tokens) {
      return res.status(401).json({ error: "Google tokens not found" });
    }

    oauth2Client.setCredentials(tokens);

    const result = await setupBaseTracking(
      oauth2Client,
      accountId,
      containerId,
      workspaceId,
        {ga4MeasurementId, gadsMeasurementId}
    )

    res.json(result)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}