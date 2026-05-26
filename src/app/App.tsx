import { useState, useEffect } from "react";
import { MapPin, Heart, Martini, Utensils, Music, Car, Shirt, Check, Copy } from "lucide-react";
import EnvelopeIntro from "./components/ui/EnvelopeIntro";
import { motion } from "motion/react";

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

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div
      className="text-center mb-10"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <p
        className="text-xs tracking-[0.35em] uppercase mb-3"
        style={{ fontFamily: "var(--font-body)", color: "var(--muted-foreground)" }}
      >
        {eyebrow}
      </p>
      <h2
        className="text-4xl text-foreground"
        style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
      >
        {title}
      </h2>
      <div className="w-10 h-px mx-auto mt-4" style={{ backgroundColor: "var(--accent)" }} />
    </motion.div>
  );
}

export default function App() {
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

const handleCopyClabe = () => {
    const clabe = "014690920016940652";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(clabe).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
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
      className="min-h-screen bg-muted/40 flex justify-center items-start"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="w-full max-w-md md:max-w-lg min-h-screen bg-background text-foreground shadow-2xl relative overflow-x-hidden">
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

        <div className="relative z-10 text-center px-6">
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
        <div className='absolute bottom-20 right-[26%]'>
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
      <div className="flex justify-center -mt-12 mb-4 relative z-20">
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

      {/* ── Countdown ── */}
      <section className="py-14 px-6">
        <p
          className="text-center text-xs tracking-[0.35em] uppercase mb-8"
          style={{ color: "var(--muted-foreground)" }}
        >
          Faltan
        </p>
        <motion.div 
          className="flex items-start justify-center gap-1 sm:gap-2 max-w-sm mx-auto"
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
                  style={{ boxShadow: "0 1px 4px rgba(42,31,18,0.06)" }}
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
                  className="text-[10px] tracking-widest uppercase"
                  style={{ color: "var(--muted-foreground)" }}
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
      </section>

      <Divider />

      {/* ── Nuestra Historia ── */}
      <section className="py-16 px-6">
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
              src="/gallery4.jpg"
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
      <section className="py-16 px-6">
        <SectionHeader eyebrow="El gran día" title="Detalles" />

        {/* Itinerario */}
        <div className="mb-10">
          <p
            className="text-center text-xs tracking-[0.35em] uppercase mb-5"
            style={{ color: "var(--muted-foreground)" }}
          >
            Itinerario
          </p>
          <div className="space-y-3">
            {[
              { time: "6:00 PM", event: "Cóctel de Bienvenida", icon: Martini },
              { time: "8:00 PM", event: "Cena", icon: Utensils },
              { time: "9:00 PM", event: "Fiesta", icon: Music },
            ].map(({ time, event, icon: Icon }, index) => (
              <motion.div
                key={time}
                className="flex items-center gap-4 rounded-md p-4 border border-border bg-background transition-transform duration-300 hover:scale-[1.01]"
                style={{ boxShadow: "0 2px 6px rgba(181, 145, 84, 0.04)" }}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-primary shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p
                    className="text-[11px] tracking-widest uppercase mb-0.5"
                    style={{ color: "var(--primary)", fontWeight: 600 }}
                  >
                    {time}
                  </p>
                  <p className="font-medium text-sm text-foreground">{event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dress Code */}
        <div className="mb-10">
          <p
            className="text-center text-xs tracking-[0.35em] uppercase mb-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            Dress Code
          </p>
          <p
            className="text-center text-2xl mb-5"
            style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
          >
            Formal
          </p>
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className="rounded-md p-6 border border-border bg-background text-center transition-transform duration-300 hover:scale-[1.01]" 
              style={{ boxShadow: "0 2px 6px rgba(181, 145, 84, 0.04)" }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-full bg-muted text-primary">
                <Dress className="w-5 h-5" />
              </div>
              <p
                className="text-lg mb-1"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                Ellas
              </p>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--muted-foreground)" }}>
                Vestido largo en tonos pasteles
              </p>
              <a
                href="https://www.pinterest.com/search/pins/?q=vestido+largo+pastel+boda+formal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline underline-offset-2 tracking-wide uppercase font-semibold transition-colors hover:text-accent"
                style={{ color: "var(--primary)" }}
              >
                Ver inspiración →
              </a>
            </motion.div>
            <motion.div 
              className="rounded-xl p-6 border border-border bg-background text-center transition-transform duration-300 hover:scale-[1.01]" 
              style={{ boxShadow: "0 2px 6px rgba(181, 145, 84, 0.04)" }}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-full bg-muted text-primary">
                <Shirt className="w-5 h-5" />
              </div>
              <p
                className="text-lg mb-1"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                Ellos
              </p>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--muted-foreground)" }}>
                Traje y corbata
              </p>
            </motion.div>
          </div>
        </div>

        {/* Padres */}
        <div>
          <p
            className="text-center text-xs tracking-[0.35em] uppercase mb-5"
            style={{ color: "var(--muted-foreground)" }}
          >
            Con el amor de sus padres
          </p>
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className="rounded-sm p-4 border border-border bg-background"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p
                className="text-[10px] tracking-widest uppercase mb-2"
                style={{ color: "var(--accent)" }}
              >
                Padres de Mariana
              </p>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                Dioseline Gómez Gómez
              </p>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                Horacio Domínguez Guichard
              </p>
            </motion.div>
            <motion.div 
              className="rounded-sm p-4 border border-border bg-background"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <p
                className="text-[10px] tracking-widest uppercase mb-2"
                style={{ color: "var(--accent)" }}
              >
                Padres de Mariano
              </p>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                Libertad González Balboa
              </p>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                Raúl Bermúdez Requena
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Ubicación ── */}
      <section className="py-16 px-6">
        <SectionHeader eyebrow="¿Dónde?" title="Ubicación" />

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
      </section>

      <Divider />

      {/* Mesa de regalos*/}
      <section className="py-16 px-6">
        <SectionHeader eyebrow="Detalles" title="Mesa de regalos" />
        <div className="w-full h-[400px] bg-background rounded-md border border-border">
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

      {/* ── Galería ── */}
      <section className="py-16">
        <div className="px-6">
          <SectionHeader eyebrow="Esperamos verte pronto" title="Galería" />
        </div>

        <div className="px-4 grid grid-cols-2 gap-2">
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
