import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Heart, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "../lib/supabaseClient";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true);

    // Call Supabase Authentication
    supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password
    }).then(({ data, error }) => {
      setIsLoading(false);
      if (error) {
        setError(error.message || "Error al iniciar sesión. Verifica tus credenciales.");
      } else if (data?.session) {
        window.location.hash = "#/dashboard";
      }
    }).catch(err => {
      console.error("Login unexpected error:", err);
      setIsLoading(false);
      setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
    });
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-12 relative overflow-hidden bg-background"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl bg-primary/20" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl bg-accent/20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Decorative Top Heart Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-12 h-12 rounded-full flex items-center justify-center border border-border bg-card shadow-sm"
          >
            <Heart className="w-5 h-5 text-primary" style={{ fill: "var(--primary)" }} />
          </motion.div>
        </div>

        {/* Card Container */}
        <div
          className="bg-card border border-border rounded-lg shadow-xl p-8 md:p-10 relative overflow-hidden"
          style={{ boxShadow: "0 10px 40px rgba(42, 31, 18, 0.08)" }}
        >
          {/* Top Decorative Border */}
          <div
            className="absolute top-0 inset-x-0 h-1"
            style={{
              background: "linear-gradient(90deg, var(--accent), var(--primary), var(--accent))",
            }}
          />

          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl text-foreground font-medium mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Acceso al Evento
            </h1>
            <p
              className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-semibold"
            >
              Mariana &amp; Mariano
            </p>
            <div className="w-12 h-px bg-accent mx-auto mt-4 opacity-60" />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-sm border border-destructive/20 text-xs text-destructive text-center font-medium bg-destructive/5"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-[11px] tracking-widest uppercase font-semibold text-muted-foreground"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-muted-foreground/70" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-border rounded-sm text-sm text-foreground bg-input-background placeholder-muted-foreground/50 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-[11px] tracking-widest uppercase font-semibold text-muted-foreground"
                >
                  Contraseña
                </label>
                <a
                  href="#forgot"
                  className="text-[11px] font-medium tracking-wide text-primary hover:underline transition-all duration-200"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-muted-foreground/70" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-border rounded-sm text-sm text-foreground bg-input-background placeholder-muted-foreground/50 transition-all duration-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground/70 hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30 accent-primary"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-xs text-muted-foreground select-none"
              >
                Recordar dispositivo
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative flex items-center justify-center gap-2 py-3 px-4 rounded-sm text-sm font-semibold tracking-wider text-primary-foreground transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              style={{
                backgroundColor: "var(--primary)",
              }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ingresar</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer / Back to invite */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs tracking-wide text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            <span>← Volver a la invitación</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
