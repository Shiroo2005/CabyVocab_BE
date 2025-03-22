import { CreateRoleBodyReq } from '~/dto/req/roles/createRoleBody.req'
import { Role } from '~/entities/role.entitity'

class RoleService {
  createRole = async ({ name, description }: CreateRoleBodyReq) => {
    const createdRole = await Role.create({ name, description }, { returning: true })
    return createdRole
  }

  getAllRole = async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    // parse
    page = Number(page)
    limit = Number(limit)

    const offset = (page - 1) * limit

    const [foundRoles, total] = await Promise.all([
      Role.findAll({
        limit: limit,
        offset,
        where: {
          isDeleted: false
        },
        attributes: ['id', 'name', 'description']
      }),
      Role.count({
        where: {
          isDeleted: false
        }
      })
    ])

    return {
      foundRoles,
      page,
      limit,
      total
    }
  }

  getRoleById = async (id: string) => {
    const foundRole = await Role.findByPk(id, {
      attributes: ['id', 'name', 'description']
    })
    if (!foundRole) return {}
    return foundRole
  }

  putRoleById = async ({ id, name, description }: { id: string; name: string; description?: string }) => {
    const updatedRole = await Role.update(
      {
        name,
        description
      },
      {
        where: {
          id
        },
        returning: true
      }
    )
    return updatedRole
  }

  deleteRoleById = async ({ id }: { id: string }) => {
    return await Role.update({ isDeleted: true }, { where: { id } })
  }
}

export const roleService = new RoleService()
