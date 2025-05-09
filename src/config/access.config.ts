import { AccessControl } from 'accesscontrol'
import { Resource, RoleName } from '~/constants/access'

export const ac = new AccessControl()

ac.grant(RoleName.USER)
  .readAny(Resource.USER)
  .updateOwn(Resource.USER)
  .readAny(Resource.COURSE)
  .readAny(Resource.TOPIC)
  .createOwn(Resource.TOPIC)

  //premium user
  .grant(RoleName.PREMIUM)
  .extend(RoleName.USER)
  .readAny(Resource.WORD)

  //admin
  .grant(RoleName.ADMIN)
  //user resoucre
  .createAny(Resource.USER)
  .updateAny(Resource.USER)
  .deleteAny(Resource.USER)

  //word resource
  .createAny(Resource.WORD)
  .updateAny(Resource.WORD)
  .deleteAny(Resource.WORD)

  //topic resource
  .createAny(Resource.TOPIC)
  .updateAny(Resource.TOPIC)
  .deleteAny(Resource.TOPIC)

  //course resource
  .createAny(Resource.COURSE)
  .updateAny(Resource.COURSE)
  .deleteAny(Resource.COURSE)
