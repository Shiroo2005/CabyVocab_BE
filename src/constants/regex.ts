export const Regex = {
  EMAIL: /^[\w.-]+@([\w-]+\.)+[\w-]{2,20}$/,
  PASSWORD: /^(?=.*[A-Z]).{6,}$/, // Min: 6 chars, 1 upper_case
  FULL_NAME: /^(?=.*[a-zA-Z])[a-zA-Z0-9]{6,}$/ // Min: 6 chars, 1 letter, only letter & number
}
