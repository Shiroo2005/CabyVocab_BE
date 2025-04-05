import { ValidationChain, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "~/core/error.response";

export const validate = (validate: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validate.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if(errors.isEmpty()){
           throw new BadRequestError({
            message: errors.array().map(err => err.msg).join(', ')
           }) 
        }
        next()
    }
}