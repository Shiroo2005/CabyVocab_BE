import { parseInt } from 'lodash'

export const isValidNumber = (num: string) => !Number.isNaN(parseInt(num))
