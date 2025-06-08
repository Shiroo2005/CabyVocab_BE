import passport, { Profile } from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { VerifyCallback } from 'passport-oauth2'
import { userService } from './user.service'
import { v4 as uuidv4 } from 'uuid'
import { OAUTH_PROVIDER } from '~/constants/oauth'
import { generateUniqueUsername } from '~/utils'
import { User } from '~/entities/user.entity'

interface OAuthConfig {
  provider: OAUTH_PROVIDER
  clientID: string
  clientSecret: string
  callbackURL: string
  scope: string[]
  getProfile: (profile: any) => Promise<{ email: string; fullName: string }> // function handle profile
}

export class OAuthStrategyFactory {
  static create(config: OAuthConfig) {
    let StrategyClass: any

    switch (config.provider) {
      case OAUTH_PROVIDER.GOOGLE:
        StrategyClass = GoogleStrategy
        break
      case OAUTH_PROVIDER.FACEBOOK:
        StrategyClass = FacebookStrategy
        break
      default:
        throw new Error('Unsupported OAuth provider')
    }

    passport.use(
      config.provider,
      new StrategyClass(
        {
          clientID: config.clientID,
          clientSecret: config.clientSecret,
          callbackURL: config.callbackURL,
          scope: config.scope
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
          try {
            const { email } = await config.getProfile(profile)
            if (!email) {
              return done(new Error('No email from Google'), undefined)
            }

            // check user exists
            let foundUser = await User.findOne({
              where: {
                email
              },

              relations: ['role'],
              select: {
                id: true,
                role: {
                  id: true
                }
              }
            })

            if (!foundUser) {
              const baseUsername = email.split('@')[0]
              const username = await generateUniqueUsername(baseUsername)

              const newUser = (await userService.createUser({
                email,
                password: uuidv4(),
                roleId: 1, // hard code for user role,
                username
              })) as User
              foundUser = newUser
            }

            return done(null, foundUser)
          } catch (err) {
            return done(err)
          }
        }
      )
    )
  }
}
