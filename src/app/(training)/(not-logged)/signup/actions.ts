"use server";

import { redirect } from "next/navigation";

import { signup as signupAPI } from "@olinfo/training-api";
import { revalidatePath } from "next/cache";

export async function signup(
  email: string,
  username: string,
  password: string,
  firstName: string,
  lastName: string,
  institute?: string,
  recaptchaResponse?: string,
): Promise<string | undefined> {
  try {
    await signupAPI(email, username, password, firstName, lastName, institute, recaptchaResponse);
  } catch (err) {
    return (err as Error).message;
  }
  revalidatePath("/", "layout");
  redirect("/");
}
