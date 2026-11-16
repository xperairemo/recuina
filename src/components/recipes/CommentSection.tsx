"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import {
  createCommentAction,
  deleteCommentAction,
} from "@/server/actions/recipe.actions";

export interface CommentItem {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface CommentSectionProps {
  recipeId: string;
  recipeAuthorId: string;
  currentUserId?: string;
  comments: CommentItem[];
}

export function CommentSection({
  recipeId,
  recipeAuthorId,
  currentUserId,
  comments,
}: CommentSectionProps) {
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!content.trim()) {
      setErrorMessage("Escribe tu nota o consejo antes de publicar.");
      return;
    }

    startTransition(async () => {
      const result = await createCommentAction(recipeId, content);
      if (!result.success) {
        setErrorMessage(result.message ?? "No se pudo publicar el comentario.");
        return;
      }
      setContent("");
    });
  };

  const handleDelete = (commentId: string) => {
    const confirmed = window.confirm("¿Seguro que quieres eliminar este comentario?");
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteCommentAction(commentId, recipeId);
      if (!result.success && result.message) {
        alert(result.message);
      }
    });
  };

  return (
    <section
      aria-label="Notas y comentarios de la comunidad"
      className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2DA] shadow-sm space-y-6"
    >
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-[#4A6B53]" />
          <h2 className="font-serif text-xl sm:text-2xl text-[#23211E]">
            Notas y consejos de cocina
          </h2>
        </div>

        <span className="text-xs font-medium text-[#6B665F] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#E7E2DA]">
          {comments.length} {comments.length === 1 ? "comentario" : "comentarios"}
        </span>
      </div>

      {/* Formulario para añadir comentario o aviso de login */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="rounded-2xl border border-[#E7E2DA] bg-[#FAF8F5]/60 p-3 focus-within:border-[#4A6B53] focus-within:bg-white transition-colors">
            <textarea
              rows={3}
              maxLength={600}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comparte algún truco de cocción, variante de ingredientes o cómo te quedó en casa..."
              className="w-full bg-transparent text-sm text-[#23211E] placeholder:text-[#9E988F] resize-none focus:outline-none"
            />
            <div className="flex items-center justify-between pt-2 border-t border-[#E7E2DA]/70">
              <span className="text-[11px] text-[#9E988F]">
                {content.length}/600 caracteres
              </span>

              <button
                type="submit"
                disabled={isPending || content.trim().length < 3}
                className="inline-flex items-center gap-2 bg-[#2F4435] hover:bg-[#3D5844] disabled:opacity-50 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isPending ? "Publicando..." : "Publicar nota"}</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl">
              {errorMessage}
            </p>
          )}
        </form>
      ) : (
        <div className="rounded-2xl bg-[#FAF8F5] border border-[#E7E2DA] p-4 text-center text-sm text-[#6B665F]">
          Inicia sesión con tu cuenta de Google en la barra superior para dejar tus notas o consejos culinarios.
        </div>
      )}

      {/* Listado de comentarios */}
      {comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((comment) => {
            const canDelete =
              currentUserId &&
              (currentUserId === comment.author.id ||
                currentUserId === recipeAuthorId);

            return (
              <li
                key={comment.id}
                className="p-4 rounded-2xl bg-[#FAF8F5]/70 border border-[#E7E2DA] space-y-2.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {comment.author.image ? (
                      <Image
                        src={comment.author.image}
                        alt={comment.author.name ?? "Usuario"}
                        width={32}
                        height={32}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full border border-stone-300 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 font-semibold text-xs flex items-center justify-center">
                        {comment.author.name?.charAt(0).toUpperCase() ?? "U"}
                      </div>
                    )}

                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-[#23211E] leading-tight">
                        {comment.author.name ?? "Cocinero de Recuina"}
                      </p>
                      <p className="text-[11px] text-[#9E988F]">
                        {new Date(comment.createdAt).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id)}
                      disabled={isPending}
                      title="Eliminar comentario"
                      aria-label="Eliminar comentario"
                      className="p-1.5 rounded-lg text-[#9E988F] hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-sm text-[#23211E] leading-relaxed whitespace-pre-line">
                  {comment.content}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-center text-sm text-[#9E988F] py-4">
          Todavía no hay notas en esta receta. ¡Sé el primero en aportar un consejo!
        </p>
      )}
    </section>
  );
}