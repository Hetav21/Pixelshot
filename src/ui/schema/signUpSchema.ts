import { z } from "zod";
import { passwordRegex } from "./regex";

export const usernameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters");

export const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    passwordRegex,
    "Password must contain at least one digit, one lowercase letter, one uppercase letter",
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  password: passwordValidation,
});
