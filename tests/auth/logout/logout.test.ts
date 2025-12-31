import { RefreshToken } from '~/entities/token.entity'
import { authService } from '~/services/auth.service'

describe('AuthService.logout', () => {
  const mockSoftDelete = jest.fn()

  beforeEach(() => {
    jest.spyOn(RefreshToken, 'getRepository').mockReturnValue({
      softDelete: mockSoftDelete
    } as any)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('LOGOUT-008 should delete refresh token from database', async () => {
    // arrange
    const refreshToken = 'mock-refresh-token'
    mockSoftDelete.mockResolvedValue({ affected: 1 })

    // act
    const result = await authService.logout({ refreshToken })

    // assert
    expect(mockSoftDelete).toHaveBeenCalledTimes(1)
    expect(mockSoftDelete).toHaveBeenCalledWith({ refreshToken })
    expect(result).toEqual({ affected: 1 })
  })
})
