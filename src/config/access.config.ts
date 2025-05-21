import { AccessControl } from 'accesscontrol'
import { Resource, RoleName } from '~/constants/access'

export const ac = new AccessControl()

ac.grant(RoleName.USER)
  .readAny(Resource.USER)
  .updateOwn(Resource.USER)
  .readAny(Resource.COURSE)
  .readAny(Resource.TOPIC)
  .readAny(Resource.EXERCISE)
  .updateOwn(Resource.EXERCISE)
  .deleteOwn(Resource.EXERCISE)
  .createOwn(Resource.EXERCISE)

  //admin
  .grant(RoleName.ADMIN)
  .extend(RoleName.USER)
  .createAny(Resource.USER)
  .createAny(Resource.WORD)
  .createAny(Resource.TOPIC)
  .createAny(Resource.COURSE)
  .readAny(Resource.SYSTEM_EARNING)
