import { logoutAction } from "@/server/actions/auth.actions";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <form
      action={async () => {
        "use server";
        await logoutAction();
      }}
    >
      <button
        type="submit"
        className={
          className ??
          "px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
        }
      >
        Cerrar sesión
      </button>
    </form>
  );
}