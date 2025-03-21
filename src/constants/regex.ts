export const Regex = {
  EMAIL: /^[\w.-]+@([\w-]+\.)+[\w-]{2,20}$/,
  PASSWORD: /^(?=.*[A-Z]).{6,}$/, // Min: 6 chars, 1 upper_case
  NAME: /^(?=.*[a-zA-Z])[a-zA-Z0-9]{6,}$/, // Min: 6 chars, 1 letter, only letter & number
  ONLY_LETTER_AND_NUMBER_AND_MUST_BE_1_LETTER: /^(?=.*[a-zA-Z])[a-zA-Z0-9]{1,}$/
}
