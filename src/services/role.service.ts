import { CreateRoleBodyReq } from '~/dto/req/roles/createRoleBody.req'
import { Role } from '~/entities/role.entity'

class RoleService {
  createRole = async ({ name, description }: CreateRoleBodyReq) => {
    const createdRole = await Role.save({ name, description })
    return createdRole
  }

  getAllRole = async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    // parse
    page = Number(page)
    limit = Number(limit)

    const offset = (page - 1) * limit

    const [foundRoles, total] = await Role.findAndCount({
      skip: offset,
      take: limit
    })

    return {
      foundRoles,
      page,
      limit,
      total
    }
  }

  getRoleById = async (id: number) => {
    const foundRole = await Role.findOne({
      where: {
        id
      }
    })
    if (!foundRole) return {}
    return foundRole
  }

  putRoleById = async ({ id, name, description }: { id: string; name: string; description: string }) => {
    const roleToUpdate = await Role.findOne({ where: { id: Number(id) } })
    if (!roleToUpdate) {
      throw new Error('Role not found')
    }
    roleToUpdate.name = name
    roleToUpdate.description = description

    const updatedRole = await Role.save(roleToUpdate)
    return updatedRole
  }

  deleteRoleById = async ({ id }: { id: number }) => {
    return await Role.getRepository().softDelete({
      id
    })
  }
}

export const roleService = new RoleService()
