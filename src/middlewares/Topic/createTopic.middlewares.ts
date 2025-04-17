import { validate } from '../validation.middlewares'
import { checkSchema } from 'express-validator'
import { Topic } from "~/entities/topic.entity";
import { isRequired, isUsername, isLength } from "../common.middlewares";
import { title } from 'process';

export const createUserValidation = validate(
  checkSchema (
    {
        title: {
            trim: true,
            ...isRequired('Title'),

        }
    }
  )
)