import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { BadRequestError } from "~/core/error.response";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new BadRequestError({
            message: 'Access token is required'
        })
    }
    const accessToken = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string) as { userId: number }
        req.user = decoded
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new BadRequestError({
                message: 'Access token is expired'
            })
        }
        throw new BadRequestError({
            message: 'Invalid access token'
        })
    }
}

export const verifyRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body
    if (!refreshToken) {
        throw new BadRequestError({
            message: 'Refresh token is required'
        })
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { userId: number }
        req.user = { userId: decoded.userId }
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new BadRequestError({
                message: 'Refresh token is expired'
            })
        }
        throw new BadRequestError({
            message: 'Invalid refresh token'
        })
    }
}