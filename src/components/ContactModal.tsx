
import React, { useEffect, useRef, useState } from "react";
import { X, Mail, User, MessageSquare, Phone, Send, Loader2 } from "lucide-react";
import { Button } from "./ui//button"; 

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  /** Your Formspree form ID (e.g. "abcdwxyz"). */
  formspreeFormId?: string;
  /** Optional default subject that will be sent as a hidden field. */
  subject?: string;
}

export default function ContactModal({ open, onClose, formspreeFormId ="xvzzzzbw", subject = "Nowa wiadomość ze strony" }: ContactModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Close when clicking the backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Focus the dialog when opening
  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formspreeFormId) {
      setErrorMsg("Brak Formspree ID. Dodaj formspreeFormId w propsach.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeFormId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const j = await res.json().catch(() => ({} as any));
        setErrorMsg(j?.errors?.[0]?.message || "Coś poszło nie tak. Spróbuj ponownie.");
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg("Nie udało się wysłać formularza. Sprawdź połączenie i spróbuj ponownie.");
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      aria-labelledby="contact-title"
      role="dialog"
      aria-modal="true"
    >
      {/* soft glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[720px] h-[60vw] max-h-[720px] rounded-full blur-3xl opacity-30 bg-[radial-gradient(ellipse_at_center,theme(colors.violet.500)_0%,transparent_60%)]" />
        <div className="absolute left-[20%] top-[30%] w-[40vw] h-[40vw] rounded-full blur-3xl opacity-20 bg-[radial-gradient(ellipse_at_center,theme(colors.indigo.400)_0%,transparent_60%)]" />
      </div>

      {/* card with gradient border */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-lg"
      >
         <div
    aria-hidden
    className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl
               bg-gradient-to-br from-violet-500/40 via-indigo-500/25 to-blue-500/20
               blur-3xl opacity-80"
  />
          <div className="rounded-2xl bg-black/90">
            {/* header */}
            <div className="flex items-start justify-between p-5">
              <div>
                <h2 id="contact-title" className="text-xl font-semibold text-white tracking-tight">Skontaktuj się</h2>
                <p className="text-xs text-white/60 mt-1">Masz projekt lub pytanie? Napisz wiadomość – odpowiem najszybciej jak się da.</p>
              </div>
              <button onClick={onClose} className="inline-flex items-center justify-center rounded-full p-2 text-white/70 hover:text-white hover:bg-white/10 transition">
                <X size={18} aria-hidden="true" />
                <span className="sr-only">Zamknij</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 pt-0">
              <input type="hidden" name="subject" value={subject} />
              {/* honeypot */}
              <input type="text" name="_gotcha" className="hidden" aria-hidden="true" tabIndex={-1} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="group">
                  <label className="text-xs text-white/70">Imię i nazwisko</label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 focus-within:border-indigo-400/60">
                    <User size={16} className="text-white/50" />
                    <input name="name" required placeholder="Jan Kowalski" className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none" />
                  </div>
                </div>
                <div className="group">
                  <label className="text-xs text-white/70">Email</label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 focus-within:border-indigo-400/60">
                    <Mail size={16} className="text-white/50" />
                    <input name="email" type="email" required placeholder="twoj@email.com" className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none" />
                  </div>
                </div>
                <div className="group sm:col-span-2">
                  <label className="text-xs text-white/70">Telefon (opcjonalnie)</label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 focus-within:border-indigo-400/60">
                    <Phone size={16} className="text-white/50" />
                    <input name="phone" type="tel" placeholder="+48 600 000 000" className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none" />
                  </div>
                </div>
                <div className="group sm:col-span-2">
                  <label className="text-xs text-white/70">Wiadomość</label>
                  <div className="mt-1.5 flex gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 focus-within:border-indigo-400/60">
                    <MessageSquare size={16} className="mt-1.5 text-white/50" />
                    <textarea name="message" required rows={5} placeholder="Opowiedz krótko o projekcie albo zapytaj o wycenę..." className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none resize-y min-h-[120px]" />
                  </div>
                </div>
              </div>

              {/* footer */}
              <div className="mt-5 flex flex-wrap items-center gap-3 sm:flex-nowrap sm:justify-between">
                <p className="text-[11px] text-white/50 sm:pr-6">Wysyłając formularz akceptujesz kontakt mailowy. Odpowiadam zwykle w 24h.</p>
                <Button type="submit" disabled={status === "submitting"} className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-0 hover:from-indigo-400 hover:to-violet-400 shadow-lg shadow-indigo-500/20">
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Wysyłanie
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Wyślij
                    </>
                  )}
                </Button>
              </div>

              {status === "success" && (
                <div className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                  Dziękuję! Wiadomość została wysłana.
                </div>
              )}
              {status === "error" && (
                <div className="mt-4 rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {errorMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
  );
}
