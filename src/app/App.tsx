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

function BotanicalBranch({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg 
      viewBox="0 0 100 200" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.2" 
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {/* Main Stem */}
      <path d="M50,195 C50,150 45,90 30,15" />
      {/* Leaves - Left Side */}
      <path d="M48,160 C32,152 26,138 28,130 C35,132 44,142 47,152" fill="currentColor" fillOpacity="0.05" />
      <path d="M44,120 C26,114 18,100 20,90 C28,92 38,102 42,112" fill="currentColor" fillOpacity="0.05" />
      <path d="M38,80 C22,76 16,62 18,54 C25,56 32,66 36,74" fill="currentColor" fillOpacity="0.05" />
      <path d="M32,40 C18,36 14,24 16,18 C22,20 27,28 30,34" fill="currentColor" fillOpacity="0.05" />
      
      {/* Leaves - Right Side */}
      <path d="M49,145 C65,138 72,124 71,116 C64,118 55,128 51,138" fill="currentColor" fillOpacity="0.05" />
      <path d="M45,102 C61,96 68,82 67,74 C60,76 51,86 47,96" fill="currentColor" fillOpacity="0.05" />
      <path d="M39,64 C55,58 62,44 61,36 C54,38 45,48 41,58" fill="currentColor" fillOpacity="0.05" />
      
      {/* Topmost Leaf */}
      <path d="M30,15 C28,2 35,-4 38,2 C38,10 34,13 30,15" fill="currentColor" fillOpacity="0.05" />
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

function CherryPetal({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path d="M10,3 C10.5,1.5 12,1 13.5,2 C15,3 16,5.5 14,9 C12,12.5 10,16 10,16 C10,16 8,12.5 6,9 C4,5.5 5,3 6.5,2 C8,1 9.5,1.5 10,3 Z" />
    </svg>
  );
}

const CHERRY_PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 12 + 16, // 16px to 28px
  duration: Math.random() * 12 + 10, // 10s to 22s
  delay: Math.random() * -22, // Pre-distributed across screen height
  sway: Math.random() * 40 + 20, // 20px to 60px sway
  rotate: Math.random() * 360,
}));

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
    if (guest.confirmado !== null) {
      setHasSubmitted(true);
    }
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
        setSelectedGuest({
          ...selectedGuest,
          confirmado: confirmado,
          pases_confirmados: confirmado ? pasesConfirmados : 0,
          nombres_asistentes: finalAsistentes
        });
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
              setSearchMessage("Ocurrió un error al cargar tu invitación.");
            } else if (data) {
              handleSelectGuest(data);
            } else {
              setSearchMessage("El enlace de invitación no es válido.");
            }
          } catch (err) {
            console.error("Token search exception:", err);
            setSearchMessage("Error de conexión al cargar la invitación.");
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

  const hasTokenInUrl = window.location.hash.startsWith("#/rsvp/");

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

        {isSearching ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-semibold">Cargando invitación...</p>
          </div>
        ) : hasSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-4"
          >
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl text-foreground font-medium" style={{ fontFamily: "var(--font-display)" }}>
              {selectedGuest?.confirmado !== null 
                ? "Respuesta Registrada" 
                : (confirmado ? "¡Gracias por confirmar!" : "Confirmación recibida")}
            </h3>
            <div className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto space-y-4">
              <p>
                {selectedGuest?.confirmado !== null ? (
                  <span>Tu respuesta ya ha sido registrada en nuestro sistema de invitados.</span>
                ) : (
                  confirmado 
                    ? "Estamos muy emocionados de compartir este día tan especial contigo. ¡Te esperamos!" 
                    : "Lamentamos mucho que no puedas asistir. Agradecemos tu respuesta de corazón y te extrañaremos ese día."
                )}
              </p>
              
              <div className="border border-border p-5 bg-muted/30 my-4 text-left rounded-sm space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Detalles de la confirmación</p>
                <p className="text-sm font-semibold text-foreground">{selectedGuest?.nombre_invitacion}</p>
                <p className="text-xs text-foreground">
                  Estado: <span className="font-semibold">{selectedGuest?.confirmado ? "Asistiré" : "No podré asistir"}</span>
                </p>
                {selectedGuest?.confirmado && (
                  <>
                    <p className="text-xs text-foreground">
                      Pases confirmados: <span className="font-semibold">{selectedGuest?.pases_confirmados}</span>
                    </p>
                    {selectedGuest?.nombres_asistentes && selectedGuest.nombres_asistentes.length > 0 && (
                      <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                        <span className="font-medium text-foreground">Asistentes:</span> {selectedGuest.nombres_asistentes.join(", ")}
                      </p>
                    )}
                  </>
                )}
              </div>

              <p className="text-xs text-muted-foreground italic pt-2">
                Si deseas realizar algún cambio en tu respuesta, por favor comunícate directamente con los organizadores.
              </p>
            </div>
          </motion.div>
        ) : !selectedGuest ? (
          <div className="text-center py-8 space-y-4">
            {hasTokenInUrl ? (
              <>
                <div className="text-amber-800 font-medium bg-amber-500/5 p-4 rounded border border-amber-500/10 max-w-md mx-auto">
                  <p className="text-sm">{searchMessage || "El enlace de invitación no es válido."}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Por favor, verifica el enlace que recibiste o ponte en contacto con los novios.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                  Para confirmar tu asistencia, por favor accede a través del enlace personalizado que te compartieron los novios.
                </p>
                <p className="text-xs text-muted-foreground italic">
                  Cada invitación cuenta con un enlace único e intransferible.
                </p>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-border pb-4">
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-bold">Invitación seleccionada</p>
              <h4 className="text-lg font-semibold text-foreground mt-0.5">{selectedGuest.nombre_invitacion}</h4>
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
      className="min-h-screen bg-background relative overflow-hidden"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Global Animated Floral/Wedding Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F4EFE6]/30 to-transparent" />
        <motion.div 
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] text-accent/5 blur-[1px]"
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        >
          <BotanicalBranch className="w-full h-full" />
        </motion.div>
        <motion.div 
          className="absolute top-[40%] -right-[15%] w-[60vw] h-[60vw] text-secondary/5 blur-[1px] rotate-[120deg]"
          animate={{ rotate: -360, scale: [1, 1.05, 1] }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        >
          <BotanicalBranch className="w-full h-full" />
        </motion.div>

        {/* Falling Cherry Blossom Petals */}
        {CHERRY_PETALS.map((petal) => (
          <motion.div
            key={petal.id}
            className="absolute pointer-events-none"
            style={{
              left: petal.left,
              width: petal.size,
              height: petal.size,
              top: "-5%",
              color: "rgba(251, 196, 196, 0.32)", // Slightly more noticeable soft rose-pink
            }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, petal.sway, -petal.sway, 0],
              rotate: [petal.rotate, petal.rotate + 360],
            }}
            transition={{
              duration: petal.duration,
              repeat: Infinity,
              ease: "linear",
              delay: petal.delay,
            }}
          >
            <CherryPetal className="w-full h-full" />
          </motion.div>
        ))}
      </div>

      <div className="w-full min-h-screen text-foreground relative z-10 overflow-x-hidden bg-transparent">
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
              background: "linear-gradient(to bottom, rgba(28,45,36,0.2) 0%, rgba(28,45,36,0.5) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 text-center px-8 py-16 max-w-md mx-auto backdrop-blur-sm border" style={{ backgroundColor: "rgba(28, 45, 36, 0.4)", borderColor: "rgba(181, 145, 84, 0.3)" }}>
          <motion.p
            className="text-[10px] tracking-[0.5em] uppercase mb-6"
            style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Nos casamos
          </motion.p>
          <motion.h1
            className="text-6xl md:text-7xl text-white leading-none mb-2"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Mariana
          </motion.h1>
          <motion.p
            className="text-4xl my-4 italic"
            style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            &amp;
          </motion.p>
          <motion.h1
            className="text-6xl md:text-7xl text-white leading-none mb-10"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Mariano
          </motion.h1>
          <motion.p
            className="text-white/90 text-xs tracking-[0.3em] uppercase"
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
        className="pt-24 pb-16 px-6 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-timer.jpg')" }}
      >
        <div 
          className="absolute inset-0 backdrop-blur-sm" 
          style={{ backgroundColor: "rgba(250, 247, 242, 0.85)" }} 
        />
        <div 
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--background))"
          }}
        />
        <div 
          className="absolute inset-x-0 top-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to top, transparent, var(--background))"
          }}
        />
        
        {/* Sello divisor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div 
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 flex items-center justify-center"
            initial={{ opacity: 0, rotate: -10 }}
            whileInView={{ opacity: 1, rotate: 0 }}
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

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <SectionHeader eyebrow="Nuestro día" eyebrowColor="var(--secondary)" />
          <h1 
            className="text-center text-3xl my-6 mb-12 text-secondary"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400, color: "var(--secondary)" }}
          >
            21 · Noviembre · 2026
          </h1>
          <motion.div 
            className="flex items-start justify-center gap-4 sm:gap-8 max-w-lg mx-auto"
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
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-16 sm:w-20 h-20 sm:h-24 flex items-center justify-center border-t border-b bg-transparent"
                    style={{ borderColor: "var(--secondary)" }}
                  >
                    <span
                      className="text-4xl tabular-nums"
                      style={{ 
                        fontFamily: "var(--font-display)", 
                        color: "var(--secondary)",
                        fontWeight: 400,
                        fontVariantNumeric: "tabular-nums lining-nums"
                      }}
                    >
                      {String(value).padStart(2, "0")}
                    </span>
                  </div>
                  <span
                    className="text-[9px] tracking-[0.2em] uppercase font-semibold"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ── Nuestra Historia ── */}
      <section className="py-24 px-6 max-w-5xl mx-auto relative">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <motion.div 
            className="flex-1 relative w-full"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
             {/* Offset border frame */}
             <div className="absolute -top-4 -left-4 w-full h-full border" style={{ borderColor: "var(--accent)" }} />
             
             <div className="relative z-10 grid grid-cols-2 gap-3">
                <img src="/bg-lo.jpg" alt="Momento especial" className="w-full h-[250px] md:h-[350px] object-cover" />
                <img src="/gallery5.jpg" alt="Momento especial" className="w-full h-[250px] md:h-[350px] object-cover mt-8 md:mt-12" />
             </div>
          </motion.div>

          <motion.div 
            className="flex-1 relative z-10 w-full md:-ml-12 mt-8 md:mt-0"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div style={{ backgroundColor: "var(--secondary)", color: "var(--primary-foreground)" }} className="p-8 md:p-12 shadow-2xl">
               <p className="text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>
                 Nuestro Camino
               </p>
               <h2 className="text-4xl md:text-5xl mb-8" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
                 Nuestra Historia
               </h2>
               <div className="w-12 h-px mb-8" style={{ backgroundColor: "var(--accent)" }} />
               <p className="text-sm leading-relaxed mb-6" style={{ opacity: 0.9 }}>
                 Desde el primer instante en que nuestros caminos se cruzaron, supimos que algo especial había comenzado.
                 Años de risas compartidas, de sueños construidos juntos y de un amor que crece cada día nos traen a este momento que hemos esperado con tanta ilusión.
               </p>
               <p className="text-sm leading-relaxed" style={{ opacity: 0.9 }}>
                 Queremos celebrar este día rodeados de las personas que más amamos. Gracias por ser parte de nuestra historia.
               </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ── Detalles del Evento ── */}
      <section 
        className="py-24 px-6 w-full relative overflow-hidden" 
        style={{ 
          background: "linear-gradient(to bottom, var(--background) 0%, var(--muted) 20%, var(--muted) 80%, var(--background) 100%)", 
          color: "var(--foreground)" 
        }}
      >
        
        {/* Animated Botanical Decorations */}
        <motion.div 
          className="absolute -top-10 -left-10 w-32 md:w-44 h-64 md:h-88 pointer-events-none origin-top-left"
          style={{ color: "var(--accent)", opacity: 0.06 }}
          animate={{ 
            rotate: [0, 3, -1, 0],
            scale: [1, 1.02, 0.99, 1]
          }}
          transition={{ 
            duration: 16, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <BotanicalBranch className="w-full h-full" />
        </motion.div>

        <motion.div 
          className="absolute -bottom-16 -right-10 w-32 md:w-44 h-64 md:h-88 pointer-events-none origin-bottom-right rotate-180"
          style={{ color: "var(--accent)", opacity: 0.06 }}
          animate={{ 
            rotate: [0, -2, 2, 0],
            scale: [1, 0.99, 1.01, 1]
          }}
          transition={{ 
            duration: 19, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <BotanicalBranch className="w-full h-full" />
        </motion.div>

        <div className="max-w-4xl mx-auto relative z-10">
          <SectionHeader eyebrow="El gran día" title="Detalles" eyebrowColor="var(--accent)" titleColor="var(--foreground)" />

          <div className="grid md:grid-cols-2 gap-16 mt-16">
            {/* Itinerario */}
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase mb-8" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>Itinerario</p>
              <div className="relative border-l ml-5 border-border/60">
                {[
                  { 
                    time: "6:00 PM", 
                    event: "Cóctel de Bienvenida", 
                    description: "Recepción de invitados y brindis de bienvenida en el jardín.",
                    icon: <Martini className="w-5 h-5" style={{ color: "var(--primary)" }} /> 
                  },
                  { 
                    time: "8:00 PM", 
                    event: "Cena", 
                    description: "Banquete principal, brindis y momentos especiales.",
                    icon: <Utensils className="w-5 h-5" style={{ color: "var(--primary)" }} /> 
                  },
                  { 
                    time: "9:00 PM", 
                    event: "Fiesta", 
                    description: "Apertura de pista de baile y celebración con DJ.",
                    icon: <Music className="w-5 h-5" style={{ color: "var(--primary)" }} /> 
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={item.time} 
                    className="mb-12 pl-12 relative"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                  >
                    <div 
                      className="absolute w-10 h-10 rounded-full border flex items-center justify-center -left-5 top-0 shadow-sm transition-transform hover:scale-110 duration-300"
                      style={{ borderColor: "var(--accent)", backgroundColor: "var(--card)" }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: "var(--primary)" }}>{item.time}</span>
                    <h3 className="text-xl mt-1 mb-2 text-foreground" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>{item.event}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dress Code & Padres */}
            <div className="space-y-12">
              {/* Dress Code */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <p className="text-[10px] tracking-[0.4em] uppercase mb-8" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>Dress Code</p>
                <div 
                  className="border p-2 bg-card shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="border p-6 md:p-8 text-center relative" style={{ borderColor: "rgba(181, 145, 84, 0.25)" }}>
                    <div className="absolute top-0 inset-x-4 h-0.5" style={{ backgroundColor: "var(--accent)", opacity: 0.7 }} />
                    <div className="flex justify-center mb-4 text-accent">
                      <Shirt className="w-8 h-8 opacity-90 mr-2" style={{ color: "var(--accent)" }} />
                      <Dress className="w-8 h-8 opacity-90 ml-2" style={{ color: "var(--accent)" }} />
                    </div>
                    <p className="text-[10px] tracking-[0.3em] uppercase mb-2 font-semibold" style={{ color: "var(--primary)" }}>Código de Vestimenta</p>
                    <p className="text-3xl mb-6 text-foreground" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>Formal</p>
                    
                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border/60">
                      <div className="border-r border-border/40 pr-4">
                        <p className="text-base mb-1 text-foreground" style={{ fontFamily: "var(--font-display)" }}>Ellas</p>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">Vestido largo en tonos pasteles</p>
                        <a 
                          href="https://www.pinterest.com/search/pins/?q=vestido+largo+pastel+boda+formal" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-block text-[9px] uppercase tracking-widest text-accent hover:opacity-80 transition-opacity font-bold"
                          style={{ color: "var(--accent)" }}
                        >
                          Inspiración →
                        </a>
                      </div>
                      <div className="pl-4">
                        <p className="text-base mb-1 text-foreground" style={{ fontFamily: "var(--font-display)" }}>Ellos</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">Traje y corbata</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Padres */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="text-[10px] tracking-[0.4em] uppercase mb-8" style={{ color: "var(--accent)", fontFamily: "var(--font-body)" }}>Con el amor de sus padres</p>
                <div 
                  className="border p-2 bg-card shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1" 
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="border p-6 md:p-8 relative" style={{ borderColor: "rgba(181, 145, 84, 0.25)" }}>
                    <div className="absolute top-0 inset-x-4 h-0.5" style={{ backgroundColor: "var(--accent)", opacity: 0.7 }} />
                    <p className="text-[10px] tracking-[0.4em] uppercase mb-6 text-center font-semibold" style={{ color: "var(--primary)" }}>
                      Con la bendición de sus padres:
                    </p>
                    <div className="grid grid-cols-2 gap-6 text-center relative">
                      <div className="border-r pr-4" style={{ borderColor: "rgba(181, 145, 84, 0.2)" }}>
                        <p className="text-[9px] tracking-[0.3em] uppercase mb-4 text-muted-foreground font-bold">Padres de la Novia</p>
                        <div className="space-y-1">
                          <p className="text-base md:text-lg text-foreground font-semibold leading-snug" style={{ fontFamily: "var(--font-display)" }}>Dioseline Gómez Gómez</p>
                          <div className="flex items-center justify-center py-1 text-accent/60 text-[9px] select-none">
                            <span className="w-3 h-[1px] bg-accent/30" />
                            <span className="mx-2 font-serif italic text-accent font-medium text-[11px]">&amp;</span>
                            <span className="w-3 h-[1px] bg-accent/30" />
                          </div>
                          <p className="text-base md:text-lg text-foreground font-semibold leading-snug" style={{ fontFamily: "var(--font-display)" }}>Horacio Domínguez Guichard</p>
                        </div>
                      </div>
                      <div className="pl-4">
                        <p className="text-[9px] tracking-[0.3em] uppercase mb-4 text-muted-foreground font-bold">Padres del Novio</p>
                        <div className="space-y-1">
                          <p className="text-base md:text-lg text-foreground font-semibold leading-snug" style={{ fontFamily: "var(--font-display)" }}>Libertad González Balboa</p>
                          <div className="flex items-center justify-center py-1 text-accent/60 text-[9px] select-none">
                            <span className="w-3 h-[1px] bg-accent/30" />
                            <span className="mx-2 font-serif italic text-accent font-medium text-[11px]">&amp;</span>
                            <span className="w-3 h-[1px] bg-accent/30" />
                          </div>
                          <p className="text-base md:text-lg text-foreground font-semibold leading-snug" style={{ fontFamily: "var(--font-display)" }}>Raúl Bermúdez Requena</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Ubicación ── */}

      <section
        className="py-24 sm:py-32 px-6 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/gallery4.jpg')" }}
      >
        {/* Extended gradient to make the title perfectly readable without darkening the whole image */}
        <div className="absolute inset-x-0 top-0 h-64 pointer-events-none" style={{ background: "linear-gradient(to bottom, var(--background) 15%, rgba(250,247,242,0.8) 40%, transparent)" }} />
        <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none" style={{ background: "linear-gradient(to top, var(--background) 15%, transparent)" }} />
        
        <div className="relative z-10 max-w-2xl mx-auto pt-8">
          <SectionHeader eyebrow="El lugar" title="Ubicación" eyebrowColor="var(--accent)" titleColor="var(--foreground)" />
          <motion.div
            className="p-3 bg-white mx-auto shadow-2xl"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="border flex flex-col md:flex-row items-stretch" style={{ borderColor: "var(--foreground)" }}>
              {/* Image Column */}
              <div className="w-full md:w-1/2 h-[220px] md:h-auto min-h-[280px] relative overflow-hidden">
                <img 
                  src="/lo1.jpg" 
                  alt="Casona 333" 
                  className="w-full h-full object-cover absolute inset-0"
                />
              </div>

              {/* Info Column */}
              <div className="w-full md:w-1/2 p-8 md:p-10 text-center flex flex-col items-center justify-center bg-card">
                <p className="text-4xl mb-6" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>Casona 333</p>
                <div className="w-12 h-px mb-6" style={{ backgroundColor: "var(--accent)" }} />
                <p className="text-sm mb-2 text-foreground font-semibold" style={{ fontFamily: "var(--font-body)" }}>Sábado 21 de Noviembre, 2026</p>
                <p className="text-sm mb-6 text-foreground/80" style={{ fontFamily: "var(--font-body)" }}>6:00 PM</p>
                
                <p className="text-xs flex items-center justify-center gap-2 mb-8" style={{ color: "var(--secondary)" }}>
                  <Car className="w-4 h-4 shrink-0" />
                  <span>Estacionamiento incluido</span>
                </p>

                <a
                  href="https://maps.app.goo.gl/VYi3itBrbckY2MCd9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full py-3.5 text-[10px] tracking-[0.2em] uppercase font-semibold transition-all duration-300 hover:opacity-85 border cursor-pointer"
                  style={{
                    backgroundColor: "var(--foreground)",
                    color: "var(--primary-foreground)",
                    borderColor: "var(--foreground)"
                  }}
                >
                  <MapPin className="w-4 h-4" />
                  Abrir en Maps
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* Mesa de regalos*/}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <SectionHeader eyebrow="Detalles" title="Mesa de Regalos" />
        <div className="border border-border p-10 md:p-16 relative text-center bg-card shadow-sm">
          <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: "var(--accent)" }} />
          <img src="/regalo.png" alt="Logo Regalo" className="w-auto h-20 mx-auto mb-4 opacity-80" />
          <p className="text-sm text-foreground leading-relaxed max-w-md mx-auto mb-10 opacity-90">
            Su compañía es el mejor regalo que podríamos recibir. Sin embargo, si deseas contribuir a nuestra mesa de regalos, puedes hacerlo a través de estas opciones:
          </p>
          <div className="inline-block border border-border px-10 py-8" style={{ backgroundColor: "var(--muted)" }}>
             <p className="text-[10px] tracking-[0.3em] uppercase mb-3 font-semibold" style={{ color: "var(--secondary)" }}>CLABE interbancaria</p>
             <p className="text-xl md:text-2xl mb-8 tabular-nums" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>014690920016940652</p>
             <button 
               onClick={handleCopyClabe}
               className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-3 text-[10px] tracking-[0.2em] uppercase font-bold transition-all border cursor-pointer"
               style={{
                 backgroundColor: copied ? "var(--secondary)" : "transparent",
                 color: copied ? "white" : "var(--foreground)",
                 borderColor: "var(--secondary)"
               }}
             >
               {copied ? (
                 <>
                   <Check className="w-4 h-4" /> ¡Copiado!
                 </>
               ) : (
                 <>
                   <Copy className="w-4 h-4" /> Copiar CLABE
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
