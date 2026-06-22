import { useState, useEffect, Component, ReactNode } from "react";
import { MapPin, Heart, Martini, Utensils, Music, Car, Shirt, Check, Copy } from "lucide-react";
import EnvelopeIntro from "./components/ui/EnvelopeIntro";
import { motion } from "motion/react";
import LogIn from "./auth/logIn";
import Dashboard from "./dashboard/Dashboard";
import { supabase } from "./lib/supabaseClient";
import confetti from "canvas-confetti";

function Dress(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 3 L9 9 L12 7 L15 9 L18 3" />
      <path d="M9 9 L5 21 L19 21 L15 9 Z" />
      <path d="M8.5 12 L15.5 12" />
    </svg>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center my-4 max-w-xs mx-auto opacity-70">
      <div className="h-px bg-border flex-grow" style={{ backgroundColor: "var(--border)" }} />
      <div className="w-1.5 h-1.5 rounded-full mx-3 bg-primary" style={{ backgroundColor: "var(--primary)" }} />
      <div className="h-px bg-border flex-grow" style={{ backgroundColor: "var(--border)" }} />
    </div>
  );
}

const WEDDING_DATE = new Date("2026-11-21T18:00:00");

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  return timeLeft;
}

const GALLERY = [
  { url: "/gallery3.mp4", alt: "Casona333", wide: true },
  { url: "/gallery2.jpg", alt: "Beso elegante", wide: false },
  { url: "/gallery1.jpg", alt: "Frente a frente", wide: false },
  { url: "/gallery4.jpg", alt: "Momento íntimo", wide: false },
  { url: "/gallery5.jpg", alt: "Traje blanco", wide: false },
];

function SectionHeader({ eyebrow, title, eyebrowColor, titleColor }: { eyebrow: string; title?: string; eyebrowColor?: string; titleColor?: string }) {
  return (
    <motion.div
      className="text-center mb-10"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <p
        className="text-xs tracking-[0.35em] uppercase mb-3 font-semibold"
        style={{ 
          fontFamily: "var(--font-body)", 
          color: eyebrowColor || "var(--muted-foreground)" 
        }}
      >
        {eyebrow}
      </p>
      {title && (
        <h2
          className="text-4xl text-foreground"
          style={{ fontFamily: "var(--font-display)", 
            fontWeight: 400,
            color: titleColor || "var(--foreground)" }}
        >
          {title}
        </h2>
      )}
      <div className="w-10 h-px mx-auto mt-4" style={{ backgroundColor: "var(--accent)" }} />
    </motion.div>
  );
}

function RsvpForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<unknown[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  
  // RSVP Form fields
  const [confirmado, setConfirmado] = useState<boolean | null>(true);
  const [pasesConfirmados, setPasesConfirmados] = useState(0);
  const [asistentes, setAsistentes] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;
    setIsSearching(true);
    setSearchMessage("");
    setSearchResults([]);
    setSelectedGuest(null);

    try {
      const { data, error } = await supabase
        .from("invitados")
        .select("*")
        .ilike("nombre_invitacion", `%${term}%`);

      if (error) {
        setSearchMessage("Ocurrió un error al buscar. Inténtalo de nuevo.");
      } else if (!data || data.length === 0) {
        setSearchMessage("No encontramos ninguna invitación con ese nombre. Intenta buscando con un apellido o nombre diferente.");
      } else {
        setSearchResults(data);
      }
    } catch (err) {
      console.error(err);
      setSearchMessage("Error de conexión. Revisa tu internet.");
    } finally {
      setIsSearching(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectGuest = (guest: any) => {
    setSelectedGuest(guest);
    setConfirmado(guest.confirmado !== null ? guest.confirmado : true);
    setPasesConfirmados(guest.pases_confirmados || guest.pases_totales);
    
    const initialAsistentes = [...(guest.nombres_asistentes || [])];
    while (initialAsistentes.length < guest.pases_totales) {
      initialAsistentes.push("");
    }
    setAsistentes(initialAsistentes);
    setSearchResults([]);
  };

  const handleAttendeeNameChange = (index: number, value: string) => {
    const nextAsistentes = [...asistentes];
    nextAsistentes[index] = value;
    setAsistentes(nextAsistentes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) return;
    setIsSubmitting(true);

    const finalAsistentes = confirmado
      ? asistentes.slice(0, pasesConfirmados).map(n => n.trim()).filter(Boolean)
      : [];

    const updatedData = {
      confirmado: confirmado,
      pases_confirmados: confirmado ? pasesConfirmados : 0,
      nombres_asistentes: finalAsistentes
    };

    try {
      const { error } = await supabase
        .from("invitados")
        .update(updatedData)
        .eq("id", selectedGuest.id);

      if (error) {
        alert("Ocurrió un error al enviar tu confirmación: " + error.message);
      } else {
        setHasSubmitted(true);
        if (confirmado) {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetRsvp = () => {
    setSearchTerm("");
    setSearchResults([]);
    setSelectedGuest(null);
    setHasSubmitted(false);
  };

  useEffect(() => {
    const checkHashToken = async () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/rsvp/")) {
        const token = hash.replace("#/rsvp/", "").trim();
        if (token) {
          setIsSearching(true);
          setSearchMessage("");
          try {
            const { data, error } = await supabase
              .from("invitados")
              .select("*")
              .eq("token", token)
              .maybeSingle();

            if (error) {
              console.error("Error loading token guest:", error);
            } else if (data) {
              handleSelectGuest(data);
            } else {
              setSearchMessage("El enlace de invitación no es válido.");
            }
          } catch (err) {
            console.error("Token search exception:", err);
          } finally {
            setIsSearching(false);
          }
        }
      }
    };

    checkHashToken();
    window.addEventListener("hashchange", checkHashToken);
    return () => window.removeEventListener("hashchange", checkHashToken);
  }, []);

  return (
    <section id="confirmacion-rsvp" className="py-20 px-6 max-w-2xl mx-auto">
      <SectionHeader eyebrow="Confirmación" title="¿Nos acompañas?" />
      
      <div 
        className="bg-card border border-border rounded-lg shadow-xl p-8 relative overflow-hidden"
        style={{ boxShadow: "0 10px 40px rgba(42, 31, 18, 0.06)" }}
      >
        <div
          className="absolute top-0 inset-x-0 h-1.5"
          style={{
            background: "linear-gradient(90deg, var(--accent), var(--primary), var(--accent))",
          }}
        />

        {hasSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-4"
          >
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl text-foreground font-medium" style={{ fontFamily: "var(--font-display)" }}>
              {confirmado ? "¡Gracias por confirmar!" : "Confirmación enviada"}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              {confirmado 
                ? "Estamos muy emocionados de compartir este día tan especial contigo. ¡Te esperamos!" 
                : "Lamentamos mucho que no puedas asistir. Agradecemos tu respuesta de corazón y te extrañaremos ese día."
              }
            </p>
            <button
              onClick={resetRsvp}
              className="mt-6 px-6 py-2.5 bg-muted hover:bg-muted-foreground/15 text-muted-foreground hover:text-foreground text-xs font-semibold rounded tracking-wider transition-all cursor-pointer"
            >
              Modificar o buscar otra invitación
            </button>
          </motion.div>
        ) : !selectedGuest ? (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Ingresa el nombre que aparece en tu invitación (ej. &quot;Familia Ruiz&quot; o &quot;Carlos Bermúdez&quot;) para buscar y registrar tu confirmación de asistencia.
            </p>
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                required
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre de la invitación..."
                className="flex-grow px-4 py-3 border border-border rounded-sm text-sm bg-input-background text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase rounded-sm hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                style={{ backgroundColor: "var(--primary)" }}
              >
                {isSearching ? "Buscando..." : "Buscar"}
              </button>
            </form>

            {searchMessage && (
              <p className="text-xs text-amber-700 text-center font-medium bg-amber-500/5 p-3 rounded border border-amber-500/10">
                {searchMessage}
              </p>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Coincidencias encontradas:</p>
                <div className="divide-y divide-border border border-border rounded overflow-hidden">
                  {searchResults.map((guest) => (
                    <button
                      key={guest.id}
                      onClick={() => handleSelectGuest(guest)}
                      className="w-full text-left p-4 hover:bg-muted/30 active:bg-muted/50 transition-colors flex justify-between items-center bg-card cursor-pointer"
                    >
                      <div>
                        <span className="font-semibold text-foreground text-sm">{guest.nombre_invitacion}</span>
                        <span className="block text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                          {guest.pases_totales} {guest.pases_totales === 1 ? "pase asignado" : "pases asignados"}
                        </span>
                      </div>
                      <span className="text-xs text-primary font-bold tracking-widest uppercase hover:underline">
                        Seleccionar →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-border pb-4 flex justify-between items-start">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Invitación seleccionada</p>
                <h4 className="text-lg font-semibold text-foreground mt-0.5">{selectedGuest.nombre_invitacion}</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGuest(null)}
                className="text-xs text-primary hover:underline font-semibold cursor-pointer"
              >
                Cambiar
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] tracking-wider uppercase font-bold text-muted-foreground">
                ¿Confirmas tu asistencia?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmado(true)}
                  className={`flex-1 py-3.5 rounded border text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer
                    ${confirmado === true 
                      ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 ring-1 ring-emerald-500/30" 
                      : "bg-transparent text-muted-foreground border-border hover:bg-muted"
                    }`}
                >
                  Sí, asistiré
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmado(false)}
                  className={`flex-1 py-3.5 rounded border text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer
                    ${confirmado === false 
                      ? "bg-rose-500/10 text-rose-700 border-rose-500/30 ring-1 ring-rose-500/30" 
                      : "bg-transparent text-muted-foreground border-border hover:bg-muted"
                    }`}
                >
                  No podré asistir
                </button>
              </div>
            </div>

            {confirmado && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-6 overflow-hidden"
              >
                <div className="space-y-2">
                  <label htmlFor="pases-confirm" className="block text-[10px] tracking-wider uppercase font-bold text-muted-foreground">
                    ¿Cuántos pases utilizarás? (Máximo {selectedGuest.pases_totales})
                  </label>
                  <select
                    id="pases-confirm"
                    value={pasesConfirmados}
                    onChange={(e) => setPasesConfirmados(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded bg-input-background text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  >
                    {Array.from({ length: selectedGuest.pases_totales }, (_, i) => i + 1).map((val) => (
                      <option key={val} value={val}>
                        {val} {val === 1 ? "pase" : "pases"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] tracking-wider uppercase font-bold text-muted-foreground">
                    Nombres de las personas que asistirán:
                  </label>
                  <div className="space-y-2.5">
                    {Array.from({ length: pasesConfirmados }).map((_, idx) => (
                      <input
                        key={idx}
                        type="text"
                        required
                        value={asistentes[idx] || ""}
                        onChange={(e) => handleAttendeeNameChange(idx, e.target.value)}
                        placeholder={`Nombre completo del asistente ${idx + 1}`}
                        className="w-full px-3 py-2.5 border border-border rounded bg-input-background text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-primary text-primary-foreground font-semibold text-xs tracking-wider uppercase rounded hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {isSubmitting ? "Enviando..." : "Confirmar Respuesta"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-900 border border-red-200 rounded m-4 font-mono text-xs max-w-xl mx-auto my-12 shadow-lg">
          <h2 className="text-lg font-bold mb-2">Error de Ejecución (Runtime Error):</h2>
          <p className="mb-4">Por favor copia y reporta este error para solucionarlo:</p>
          <pre className="bg-red-100 p-4 rounded overflow-auto max-w-full text-left font-mono font-semibold whitespace-pre-wrap">
            {this.state.error?.stack || this.state.error?.message}
          </pre>
          <button 
            onClick={() => {
              window.location.hash = "#/";
              window.location.reload();
            }} 
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded font-sans font-semibold hover:bg-red-700 transition-colors"
          >
            Volver a la Invitación
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash;
    if (hash === "#/login" || hash === "#/couple") return "login";
    if (hash === "#/dashboard") return "dashboard";
    return "invitation";
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession()
      .then((res) => {
        const session = res?.data?.session || null;
        setSession(session);
        setAuthLoading(false);
      })
      .catch((err) => {
        console.error("Error getting session:", err);
        setSession(null);
        setAuthLoading(false);
      });

    const res = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    const subscription = res?.data?.subscription || res;

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#/login" || hash === "#/couple") {
        setCurrentRoute("login");
      } else if (hash === "#/dashboard") {
        setCurrentRoute("dashboard");
      } else {
        setCurrentRoute("invitation");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  if (currentRoute === "login") {
    if (session) {
      window.location.hash = "#/dashboard";
    }
    return (
      <ErrorBoundary>
        <LogIn />
      </ErrorBoundary>
    );
  }

  if (currentRoute === "dashboard") {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-semibold">Cargando Panel...</p>
        </div>
      );
    }

    if (!session) {
      window.location.hash = "#/couple";
      return (
        <ErrorBoundary>
          <LogIn />
        </ErrorBoundary>
      );
    }

    return (
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    );
  }

const handleCopyClabe = () => {
    const clabe = "014690920016940652";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(clabe).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch((err) => {
        console.error(err);
        fallbackCopyText(clabe);
      });
    } else {
      fallbackCopyText(clabe);
    }
  };
  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div
      className="min-h-screen bg-background"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="w-full min-h-screen bg-background text-foreground relative overflow-x-hidden">
        <EnvelopeIntro />
        {/* ── Hero ── */}
      <section className="relative h-[100svh] flex flex-col items-center justify-center pb-20">
        <div className="absolute inset-0">
          <img
            src="/hero.jpg"
            alt="Mariana y Mariano"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "rgba(0, 00, 0, 0.6)",
            }}
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <motion.p
            className="text-xs tracking-[0.4em] uppercase mb-5"
            style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Nos casamos
          </motion.p>
          <motion.h1
            className="text-7xl text-white leading-none mb-1"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Mariana
          </motion.h1>
          <motion.p
            className="text-3xl my-2 italic"
            style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            &amp;
          </motion.p>
          <motion.h1
            className="text-7xl text-white leading-none mb-8"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Mariano
          </motion.h1>
          <motion.div 
            className="w-14 h-px mx-auto mb-5" 
            style={{ backgroundColor: "var(--accent)" }}
            initial={{ width: 0 }}
            animate={{ width: 56 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          />
        </div>
        <div className='absolute bottom-20 left-2 right-0 flex justify-center'>
          <motion.p
            className="text-white/80 text-sm tracking-[0.25em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            21 · Noviembre · 2026
          </motion.p>
        </div>
      </section>

      {/* ── Sello Decorativo ── */}
      <div className="w-full h-[4px] mx-auto" style={{ backgroundColor: "var(--accent)" }} />      

      {/* ── Countdown ── */}
      <section
        className="pt-16 pb-8 px-6 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-timer.jpg')" }}
      >
        <div 
          className="absolute inset-0 backdrop-blur-[2px]" 
          style={{ backgroundColor: "rgba(250, 247, 242, 0.75)" }} 
        />
        <div 
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--background))"
          }}
        />
        
        {/* Sello Decorativo overlapping the top border */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div 
            className="w-24 h-24 rounded-full p-2 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img
              src="/sello.png"
              alt="Sello"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
        <SectionHeader eyebrow="Nuestro día" eyebrowColor="var(--foreground)" />
        <h1 
          className="text-center text-3xl my-5 mb-8 text-foreground"
          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
        >
          21 · Noviembre · 2026
        </h1>
        <motion.div 
          className="flex items-start justify-center gap-2 sm:gap-4 max-w-md mx-auto"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { value: days, label: "Días" },
            { value: hours, label: "Horas" },
            { value: minutes, label: "Min" },
            { value: seconds, label: "Seg" },
          ].map(({ value, label }, index) => (
            <div key={label} className="flex items-start">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-16 sm:w-20 h-16 sm:h-20 rounded-sm flex items-center justify-center border border-border bg-background"
                  style={{ boxShadow: "0 1px 4px rgba(42,31,18, 0.4)" }}
                >
                  <span
                    className="text-3xl tabular-nums"
                    style={{ 
                      fontFamily: "var(--font-display)", 
                      color: "var(--primary)",
                      fontVariantNumeric: "tabular-nums lining-nums"
                    }}
                  >
                    {String(value).padStart(2, "0")}
                  </span>
                </div>
                <span
                  className="text-[11px] tracking-widest uppercase font-semibold"
                  style={{ color: "var(--foreground)", opacity: 0.85 }}
                >
                  {label}
                </span>
              </div>
              {index < 3 && (
                <span
                  className="text-2xl sm:text-3xl flex items-center justify-center select-none h-16 sm:h-20 w-3 sm:w-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--accent)",
                  }}
                >
                  :
                </span>
              )}
            </div>
          ))}
        </motion.div>
        </div>
      </section>

      <Divider />

      {/* ── Nuestra Historia ── */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <SectionHeader eyebrow="Nuestro camino" title="Nuestra Historia" />

        {/* <div className="rounded-2xl overflow-hidden bg-muted mb-8" style={{ aspectRatio: "4/5" }}>
          <img
            src=""
            alt="Mariana y Mariano juntos"
            className="w-full h-full object-cover"
          />
        </div> */}

        <p
          className="text-base leading-relaxed text-center mb-6"
          style={{ color: "var(--muted-foreground)" }}
        >
          Desde el primer instante en que nuestros caminos se cruzaron, supimos que algo especial
          había comenzado. Años de risas compartidas, de sueños construidos juntos y de un amor que
          crece cada día nos traen a este momento que hemos esperado con tanta ilusión.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div 
            className="rounded-sm shadow-lg overflow-hidden aspect-square bg-muted"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/bg-lo.jpg"
              alt="Momento especial"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div 
            className="rounded-sm shadow-lg overflow-hidden aspect-square bg-muted"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <img
              src="/gallery5.jpg"
              alt="Momento especial"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <p
          className="text-base leading-relaxed text-center"
          style={{ color: "var(--muted-foreground)" }}
        >
          Queremos celebrar este día rodeados de las personas que más amamos. Gracias por ser parte
          de nuestra historia.
        </p>
      </section>

      <Divider />

      {/* ── Detalles del Evento ── */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <SectionHeader eyebrow="El gran día" title="Detalles" />

        {/* Itinerario */}
        <div className="mb-20">
          <motion.p
            className="text-center text-xs tracking-[0.35em] uppercase mb-12"
            style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Itinerario
          </motion.p>

          {/* Vertical timeline — alternating on desktop, left-aligned on mobile */}
          <div className="relative max-w-md md:max-w-2xl mx-auto">
            {/* Continuous timeline line: left on mobile, center on desktop */}
            <div
              className="absolute left-5 md:left-1/2 md:-translate-x-1/2 top-6 bottom-6 w-px"
              style={{
                background: "linear-gradient(to bottom, var(--accent), rgba(181, 145, 84, 0.15))",
              }}
            />

            {[
              {
                time: "6:00 PM",
                event: "Cóctel de Bienvenida",
                description: "Recepción de invitados y brindis de bienvenida en el jardín.",
                icon: Martini,
              },
              {
                time: "8:00 PM",
                event: "Cena",
                description: "Banquete principal, brindis y momentos especiales.",
                icon: Utensils,
              },
              {
                time: "9:00 PM",
                event: "Fiesta",
                description: "Apertura de pista de baile y celebración con DJ.",
                icon: Music,
              },
            ].map(({ time, event, description, icon: Icon }, index, arr) => {
              const isLeft = index % 2 === 0;
              return (
              <motion.div
                key={time}
                className={`relative flex items-start gap-5 group
                  md:gap-0 md:items-center
                  ${isLeft ? "md:flex-row-reverse" : "md:flex-row"}
                `}
                style={{ paddingBottom: index < arr.length - 1 ? "2.5rem" : "0" }}
                initial={{ opacity: 0, x: isLeft ? 15 : -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {/* Timeline node — icon circle (centered on desktop) */}
                <div className="relative z-10 shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      borderColor: "var(--accent)",
                      backgroundColor: "var(--background)",
                      boxShadow: "0 3px 12px rgba(181, 145, 84, 0.18)",
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  </div>
                </div>

                {/* Event card */}
                <div
                  className={`flex-1 relative rounded-lg p-5 border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg
                    md:w-[calc(50%-2rem)] md:flex-none
                    ${isLeft ? "md:mr-[calc(50%+1.5rem)]" : "md:ml-[calc(50%+1.5rem)]"}
                  `}
                  style={{ boxShadow: "0 2px 12px rgba(181, 145, 84, 0.06)" }}
                >
                  {/* Gold accent — left on mobile, side-aware on desktop */}
                  <div
                    className={`absolute top-3 bottom-3 w-[3px] rounded-full
                      left-0
                      ${isLeft ? "md:left-auto md:right-0" : "md:left-0"}
                    `}
                    style={{
                      background: "linear-gradient(to bottom, var(--accent), var(--primary))",
                    }}
                  />

                  <div className={`pl-3 ${isLeft ? "md:pl-0 md:pr-3 md:text-right" : "md:pl-3"}`}>
                    {/* Time */}
                    <span
                      className="inline-block text-[11px] tracking-[0.25em] uppercase font-bold mb-1 px-2.5 py-0.5 rounded-full"
                      style={{
                        color: "var(--primary)",
                        backgroundColor: "rgba(181, 145, 84, 0.08)",
                      }}
                    >
                      {time}
                    </span>

                    <h3
                      className="text-base mt-1.5 mb-1 text-foreground"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                    >
                      {event}
                    </h3>

                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {description}
                    </p>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>

        {/* Dress Code */}
        <div className="mb-20">
          <motion.div
            className="relative rounded-lg overflow-hidden border border-border bg-card max-w-2xl mx-auto"
            style={{ boxShadow: "0 6px 30px rgba(181, 145, 84, 0.08)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Ornamental top border */}
            <div
              className="h-1.5"
              style={{
                background: "linear-gradient(90deg, var(--accent), var(--primary), var(--accent))",
              }}
            />

            <div className="p-8 text-center">
              <p
                className="text-[10px] tracking-[0.4em] uppercase mb-1"
                style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}
              >
                Dress Code
              </p>
              <p
                className="text-3xl mb-6"
                style={{ fontFamily: "var(--font-display)", color: "var(--primary)", fontWeight: 400 }}
              >
                Formal
              </p>

              {/* Side by side with center divider */}
              <div className="flex items-stretch">
                {/* Ellas */}
                <div className="flex-1 flex flex-col items-center px-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{
                      background: "linear-gradient(135deg, rgba(181, 145, 84, 0.08), rgba(197, 162, 101, 0.15))",
                      border: "1px solid rgba(181, 145, 84, 0.2)",
                    }}
                  >
                    <Dress className="w-6 h-6" style={{ color: "var(--primary)" }} />
                  </div>
                  <p
                    className="text-lg mb-2"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--foreground)" }}
                  >
                    Ellas
                  </p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted-foreground)" }}>
                    Vestido largo en tonos pasteles
                  </p>
                  <a
                    href="https://www.pinterest.com/search/pins/?q=vestido+largo+pastel+boda+formal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] tracking-widest uppercase font-semibold transition-all duration-300 hover:gap-2"
                    style={{ color: "var(--primary)" }}
                  >
                    Inspiración
                    <span className="text-sm">→</span>
                  </a>
                </div>

                {/* Center divider */}
                <div className="flex flex-col items-center justify-center px-2">
                  <div className="w-px flex-1" style={{ backgroundColor: "var(--border)" }} />
                  <div
                    className="w-2 h-2 rounded-full my-3 shrink-0"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                  <div className="w-px flex-1" style={{ backgroundColor: "var(--border)" }} />
                </div>

                {/* Ellos */}
                <div className="flex-1 flex flex-col items-center px-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{
                      background: "linear-gradient(135deg, rgba(181, 145, 84, 0.08), rgba(197, 162, 101, 0.15))",
                      border: "1px solid rgba(181, 145, 84, 0.2)",
                    }}
                  >
                    <Shirt className="w-6 h-6" style={{ color: "var(--primary)" }} />
                  </div>
                  <p
                    className="text-lg mb-2"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "var(--foreground)" }}
                  >
                    Ellos
                  </p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted-foreground)" }}>
                    Traje y corbata
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Padres */}
        <motion.div
          className="relative rounded-lg overflow-hidden max-w-2xl mx-auto"
          style={{
            backgroundColor: "rgba(240, 234, 225, 0.5)",
            border: "1px solid rgba(181, 145, 84, 0.12)",
          }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="p-8 md:p-10 text-center">
            <Heart
              className="w-5 h-5 mx-auto mb-4"
              style={{ color: "var(--accent)", fill: "var(--accent)", opacity: 0.6 }}
            />
            <p
              className="text-[10px] tracking-[0.4em] uppercase mb-10"
              style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}
            >
              Con el amor de sus padres
            </p>

            <div className="flex items-start">
              {/* Padres de Mariana */}
              <div className="flex-1 px-3">
                <p
                  className="text-[10px] tracking-[0.3em] uppercase mb-5 font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  Padres de la novia
                </p>
                <div className="space-y-4">
                  <div>
                    <p
                      className="text-base md:text-lg text-foreground"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
                    >
                      Dioseline Gómez Gómez
                    </p>
                    <div
                      className="w-8 h-px mx-auto mt-2"
                      style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-base md:text-lg text-foreground"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
                    >
                      Horacio Domínguez Guichard
                    </p>
                    <div
                      className="w-8 h-px mx-auto mt-2"
                      style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Center ornament */}
              <div className="flex flex-col items-center justify-center px-2 pt-6">
                <div className="w-px h-8" style={{ backgroundColor: "var(--border)" }} />
                <Heart
                  className="w-3 h-3 my-2 shrink-0"
                  style={{ color: "var(--accent)", fill: "var(--accent)", opacity: 0.4 }}
                />
                <div className="w-px h-8" style={{ backgroundColor: "var(--border)" }} />
              </div>

              {/* Padres de Mariano */}
              <div className="flex-1 px-3">
                <p
                  className="text-[10px] tracking-[0.3em] uppercase mb-5 font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  Padres del novio
                </p>
                <div className="space-y-4">
                  <div>
                    <p
                      className="text-base md:text-lg text-foreground"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
                    >
                      Libertad González Balboa
                    </p>
                    <div
                      className="w-8 h-px mx-auto mt-2"
                      style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-base md:text-lg text-foreground"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
                    >
                      Raúl Bermúdez Requena
                    </p>
                    <div
                      className="w-8 h-px mx-auto mt-2"
                      style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <Divider />

      {/* ── Ubicación ── */}

      <section
        className="py-20 sm:py-28 px-4 sm:px-6 relative bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: "url('/gallery4.jpg')",
        }}
      >
        <div 
          className="absolute inset-0 backdrop-blur-[2px]" 
          style={{ backgroundColor: "rgba(250, 247, 242, 0.25)" }} 
        />        
        {/* Overlay for readability */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(255, 255, 255, 0.14)" }} />
        
        {/* Fades for smooth morphing into page background */}
        <div 
          className="absolute inset-x-0 top-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, var(--background), transparent)"
          }}
        />
        <div 
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--background))"
          }}
        />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <SectionHeader eyebrow="El lugar" title="Ubicación"/>
          <motion.div
            className="rounded-sm overflow-hidden border border-border"
            style={{ backgroundColor: "var(--card)" }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative h-52 bg-muted overflow-hidden">
            <img
              src="/lo1.jpg"
              alt="Casona 333"
              className="w-full h-full object-cover"
              style={{ filter: "saturate(0.7) brightness(0.85)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 40%, rgba(28,45,36,0.5) 100%)",
              }}
            />
            <div className="absolute bottom-4 left-4">
              <p
                className="text-white text-xl"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                Casona 333
              </p>
            </div>
            <div
              className="absolute top-4 right-4 rounded-full p-2.5"
              style={{ backgroundColor: "var(--card)" }}
            >
              <MapPin className="w-5 h-5" style={{ color: "var(--primary)" }} />
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-1 mb-5">
              <p className="text-sm font-medium text-foreground">Casona 333</p>
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Sábado 21 de Noviembre, 2026 · 6:00 PM
              </p>
              <p className="text-xs flex items-center gap-1.5 mt-1" style={{ color: "var(--accent)" }}>
                <Car className="w-4 h-4 shrink-0" />
                <span>Estacionamiento incluido</span>
              </p>
            </div>

            <a
              href="https://maps.app.goo.gl/VYi3itBrbckY2MCd9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-sm py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 hover:opacity-80 active:opacity-90"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              <MapPin className="w-4 h-4" />
              Abrir en Google Maps
            </a>
          </div>
        </motion.div>
        </div>
      </section>

      <Divider />

      {/* Mesa de regalos*/}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <SectionHeader eyebrow="Detalles" title="Mesa de regalos" />
        <div className="w-full h-[400px] bg-background rounded-md border border-border shadow-lg">
          <div className="flex items-center justify-center my-4 max-w-xs mx-auto opacity-70">
            <div className="h-px bg-border flex-grow rounded-full" style={{ backgroundColor: "var(--border)" }} />
            <img src="/regalo.png" alt="Logo" className="w-auto h-14" />
            <div className="h-px bg-border flex-grow rounded-full" style={{ backgroundColor: "var(--border)" }} />
          </div>
          <div className="flex flex-col items-center justify-center max-w-xs mx-auto opacity-70">
            <p className="text-center text-sm text-foreground">Su compañía es el mejor regalo que podríamos recibir. Sin embargo, si deseas contribuir a nuestra mesa de regalos, puedes hacerlo a través de estas opciones:</p>
          </div>
          <div className="flex flex-col items-center justify-center mt-8 max-w-xs mx-auto opacity-70">
            <div className="flex flex-col items-center justify-center mt-8 max-w-xs mx-auto opacity-70">
              <p className="text-center text-md text-foreground" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>CLABE interbancaria:</p>
              <p className="text-center text-md text-foreground" style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}>014690920016940652</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-8 max-w-xs mx-auto opacity-70">
            <button 
            onClick={handleCopyClabe}
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar CLABE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <Divider />

      <RsvpForm />

      <Divider />

      {/* ── Galería ── */}
      <section className="py-16 max-w-4xl mx-auto">
        <div className="px-6">
          <SectionHeader eyebrow="Esperamos verte pronto" title="Galería" />
        </div>

        <div className="px-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {GALLERY.map(({ url, alt, wide }, i) => (
            <motion.div
              key={i}
              className={`overflow-hidden rounded-xl bg-muted ${wide ? "col-span-2" : ""}`}
              style={{ aspectRatio: wide ? "16/9" : "1/1" }}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
            >
              {url.includes(".mp4") ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                >
                  <source src={url} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={url}
                  alt={alt}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-14 px-6 text-center"
        style={{ backgroundColor: "var(--foreground)" }}
      >
        <p
          className="text-4xl mb-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--card)", fontWeight: 400 }}
        >
          Mariana &amp; Mariano
        </p>
        <p
          className="text-xs tracking-[0.3em] uppercase mb-8"
          style={{ color: "rgba(255,252,244,0.45)" }}
        >
          21 · 11 · 2026
        </p>
        <Heart
          className="w-5 h-5 mx-auto"
          style={{ color: "var(--accent)", fill: "var(--accent)" }}
        />
      </footer>
      </div>
    </div>
  );
}
