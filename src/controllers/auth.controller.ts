import { Request, Response } from 'express';
import { NextFunction, ParamsDictionary } from 'express-serve-static-core';
import { BadRequestError, ErrorResponse } from '~/core/error.response';
import { CREATED, SuccessResponse } from '~/core/success.response';
import {authService} from '~/services/auth.service';

class AuthController{
    register = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
        try {
            const result = await authService.register(req.body);
            return new CREATED({
                message: 'Register successful!',
                metaData: result
            }).send(res)
        } catch (error) {
            next(error);
        }
    }
    login = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
        try {
            const result = await authService.login(req.body);
            return new SuccessResponse({
                message: 'Login successful!',
                metaData: result
            }).send(res)
        } catch (error) {
            next(error);
        }
    }
}
export const authController = new AuthController()
