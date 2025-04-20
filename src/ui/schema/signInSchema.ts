import { z } from "zod";
import { passwordValidation, usernameValidation } from "./signUpSchema";

export const signInSchema = z.object({
  username: usernameValidation,
  password: passwordValidation,
});
