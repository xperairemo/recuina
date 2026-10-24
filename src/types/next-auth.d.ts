import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extiende la interfaz de Session para incluir el ID del usuario
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  /**
   * Extiende la interfaz de User si se requieren campos adicionales
   */
  interface User {
    id?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extiende el token JWT para almacenar el ID
   */
  interface JWT {
    sub?: string;
  }
}