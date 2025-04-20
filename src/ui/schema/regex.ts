// Regex for password validation
// min 8 character long
// At least one digit, one lowercase letter, one uppercase letter
// Can contain special characters
export const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
