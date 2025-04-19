import { AccessControl } from 'accesscontrol'
import { Resource, RoleName } from '~/constants/access'

export const ac = new AccessControl()

ac.grant(RoleName.USER)
  .readAny(Resource.USER)
  .updateOwn(Resource.USER)
  .readAny(Resource.COURSE)
  .readAny(Resource.TOPIC)

  //premium user
  .grant(RoleName.PREMIUM)
  .extend(RoleName.USER)
  .readAny(Resource.WORD)

  //admin
  .grant(RoleName.ADMIN)
  .createAny(Resource.USER)
  .createAny(Resource.WORD)
  .createAny(Resource.TOPIC)
  .createAny(Resource.COURSE)
