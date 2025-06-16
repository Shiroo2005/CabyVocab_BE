import { OAuth2Client } from 'google-auth-library'

export const OauthGoogleService = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
