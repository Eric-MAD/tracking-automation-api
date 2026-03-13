import oauth2Client from "../config/googleAuth.js"
import { googleScopes } from "../utils/googleScopes.js"
import { setGoogleTokens } from "../utils/storeGoogleTokens.js"


export const googleAuth = (req, res) => {

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: googleScopes
  })

  res.redirect(url)
}

export const googleCallback = async (req, res) => {

  const code = req.query.code
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)
  setGoogleTokens(tokens)

  res.json({
    message: "Google Auth success",
    tokens
  })

}