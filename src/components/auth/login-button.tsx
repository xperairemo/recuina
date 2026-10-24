import { loginAction } from "@/server/actions/auth.actions";

interface LoginButtonProps {
  provider?: string;
  className?: string;
}

export function LoginButton({
  provider = "google",
  className,
}: LoginButtonProps) {
  return (
    <form
      action={async () => {
        "use server";
        await loginAction(provider);
      }}
    >
      <button
        type="submit"
        className={
          className ??
          "px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors shadow-sm cursor-pointer"
        }
      >
        Iniciar sesión
      </button>
    </form>
  );
}