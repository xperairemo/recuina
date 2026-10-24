"use server";

import { signIn, signOut } from "@/lib/auth";

/**
 * Inicia sesión redirigiendo al proveedor especificado (por defecto Google)
 */
export async function loginAction(provider: string = "google") {
  await signIn(provider, { redirectTo: "/" });
}

/**
 * Cierra la sesión activa del usuario y redirige a la portada
 */
export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}