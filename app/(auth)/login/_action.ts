"use server"

import { loginFormSchema } from "@/forms/schema";
import { auth } from "@/lib/auth";

interface LoginFormData {
  email: string;
  password: string;
}

export async function signIn(formData: LoginFormData) {
  try {
    const validatedData = loginFormSchema.parse(formData)
    await auth.api.signInEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password
      }
    })
    return { success: true }
  } catch (error) {
    return { success: false, message: error }
  }
}
