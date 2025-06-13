// import { env } from 'process'
// import { OAUTH_PROVIDER } from '~/constants/oauth'
// import { OAuthStrategyFactory } from '~/services/oauth.service'

// // Login google
// OAuthStrategyFactory.create({
//   provider: OAUTH_PROVIDER.GOOGLE,
//   clientID: env.GOOGLE_CLIENT_ID as string,
//   clientSecret: env.GOOGLE_CLIENT_SECRET as string,
//   callbackURL: env.GOOGLE_CALLBACK_URL as string,
//   scope: ['profile', 'email'],
//   getProfile: async (profile) => {
//     const email = profile.emails?.[0]?.value
//     const fullName = profile.displayName
//     return { email, fullName }
//   }
// })
