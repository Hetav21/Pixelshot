import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters");

export const passwordValidation = z
  .string()
  .min(4, "Password must be at least 4 characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  password: passwordValidation,
});
