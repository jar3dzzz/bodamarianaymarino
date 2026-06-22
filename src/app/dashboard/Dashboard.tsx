import React, { useState, useMemo, useEffect } from "react";
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  LogOut, 
  UserPlus, 
  Save, 
  X, 
  Key,
  Check,
  Heart,
  Copy
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabaseClient";

interface Invitado {
  id: string;
  nombre_invitacion: string;
  pases_totales: number;
  pases_confirmados: number;
  confirmado: boolean | null;
  nombres_asistentes: string[];
  token: string;
  created_at: string;
}

export default function Dashboard() {
  const [guests, setGuests] = useState<Invitado[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"todos" | "confirmados" | "declinados" | "pendientes">("todos");
  
  // Form/Modal states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  
  // New Guest Form Fields
  const [nombreInvitacion, setNombreInvitacion] = useState("");
  const [pasesTotales, setPasesTotales] = useState(2);
  const [pasesConfirmados, setPasesConfirmados] = useState(0);
  const [confirmado, setConfirmado] = useState<boolean | null>(null);
  const [nombresAsistentesInput, setNombresAsistentesInput] = useState("");
  const [tokenInput, setTokenInput] = useState("");

  // Edit Guest States
  const [editNombre, setEditNombre] = useState("");
  const [editPasesTotales, setEditPasesTotales] = useState(2);
  const [editPasesConfirmados, setEditPasesConfirmados] = useState(0);
  const [editConfirmado, setEditConfirmado] = useState<boolean | null>(null);
  const [editAsistentesInput, setEditAsistentesInput] = useState("");
  const [editToken, setEditToken] = useState("");

  // Fetch guests from Supabase
  const fetchGuests = async () => {
    setIsLoadingGuests(true);
    try {
      const { data, error } = await supabase
        .from("invitados")
        .select("*")
        .order("nombre_invitacion");
      if (error) {
        console.error("Error fetching guests:", error);
      } else {
        setGuests(data || []);
      }
    } catch (err) {
      console.error("Fetch guests exception:", err);
    } finally {
      setIsLoadingGuests(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const [copiedGuestId, setCopiedGuestId] = useState<string | null>(null);

  const handleCopyLink = (token: string, guestId: string) => {
    const link = `${window.location.origin}${window.location.pathname}#/rsvp/${token}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedGuestId(guestId);
      setTimeout(() => setCopiedGuestId(null), 2500);
    }).catch((err) => {
      console.error("Failed to copy link:", err);
      const textArea = document.createElement("textarea");
      textArea.value = link;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiedGuestId(guestId);
        setTimeout(() => setCopiedGuestId(null), 2500);
      } catch (e) {
        console.error("Fallback copy failed", e);
      }
      document.body.removeChild(textArea);
    });
  };

  // Generate a random token helper
  const generateToken = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Stats calculation
  const stats = useMemo(() => {
    let totalPasses = 0;
    let confirmedPasses = 0;
    let pendingPasses = 0;
    let declinedPasses = 0;

    guests.forEach((g) => {
      totalPasses += g.pases_totales;
      if (g.confirmado === true) {
        confirmedPasses += g.pases_confirmados;
        declinedPasses += (g.pases_totales - g.pases_confirmados);
      } else if (g.confirmado === false) {
        declinedPasses += g.pases_totales;
      } else {
        pendingPasses += g.pases_totales;
      }
    });

    const confirmedCount = guests.filter(g => g.confirmado === true).length;
    const declinedCount = guests.filter(g => g.confirmado === false).length;
    const pendingCount = guests.filter(g => g.confirmado === null).length;

    return {
      totalInvitaciones: guests.length,
      totalPases: totalPasses,
      confirmadosInvitaciones: confirmedCount,
      confirmadosPases: confirmedPasses,
      declinadosInvitaciones: declinedCount,
      declinadosPases: declinedPasses,
      pendientesInvitaciones: pendingCount,
      pendientesPases: pendingPasses
    };
  }, [guests]);

  // Handle Logout
  const handleLogout = () => {
    supabase.auth.signOut().then(() => {
      window.location.hash = "#/couple";
    });
  };

  // Add Guest handler
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreInvitacion) return;

    const finalToken = tokenInput.trim() || generateToken();
    const finalAsistentes = nombresAsistentesInput
      ? nombresAsistentesInput.split(",").map(name => name.trim()).filter(Boolean)
      : [];

    const newGuest = {
      nombre_invitacion: nombreInvitacion,
      pases_totales: Number(pasesTotales),
      pases_confirmados: confirmado === true ? Number(pasesConfirmados) : 0,
      confirmado: confirmado,
      nombres_asistentes: confirmado === true ? finalAsistentes : [],
      token: finalToken
    };

    const { error } = await supabase.from("invitados").insert([newGuest]);
    if (error) {
      alert("Error al registrar invitado: " + error.message);
    } else {
      fetchGuests();
      resetAddForm();
    }
  };

  const resetAddForm = () => {
    setNombreInvitacion("");
    setPasesTotales(2);
    setPasesConfirmados(0);
    setConfirmado(null);
    setNombresAsistentesInput("");
    setTokenInput("");
    setShowAddForm(false);
  };

  // Delete Guest handler
  const handleDeleteGuest = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este invitado?")) {
      const { error } = await supabase.from("invitados").delete().eq("id", id);
      if (error) {
        alert("Error al eliminar invitado: " + error.message);
      } else {
        fetchGuests();
      }
    }
  };

  // Start Editing Guest
  const startEdit = (guest: Invitado) => {
    setEditingGuestId(guest.id);
    setEditNombre(guest.nombre_invitacion);
    setEditPasesTotales(guest.pases_totales);
    setEditPasesConfirmados(guest.pases_confirmados);
    setEditConfirmado(guest.confirmado);
    setEditAsistentesInput(guest.nombres_asistentes ? guest.nombres_asistentes.join(", ") : "");
    setEditToken(guest.token);
  };

  // Save Editing Guest
  const saveEdit = async (id: string) => {
    const finalAsistentes = editAsistentesInput
      ? editAsistentesInput.split(",").map(name => name.trim()).filter(Boolean)
      : [];

    const updated = {
      nombre_invitacion: editNombre,
      pases_totales: Number(editPasesTotales),
      pases_confirmados: editConfirmado === true ? Number(editPasesConfirmados) : 0,
      confirmado: editConfirmado,
      nombres_asistentes: editConfirmado === true ? finalAsistentes : [],
      token: editToken.trim()
    };

    const { error } = await supabase.from("invitados").update(updated).eq("id", id);
    if (error) {
      alert("Error al guardar cambios: " + error.message);
    } else {
      setEditingGuestId(null);
      fetchGuests();
    }
  };

  // Toggle Confirmado status quickly
  const toggleQuickStatus = async (id: string) => {
    const guest = guests.find(g => g.id === id);
    if (!guest) return;

    let nextConfirmado: boolean | null = null;
    let nextPases = 0;
    let nextAsistentes: string[] = [];

    if (guest.confirmado === null) {
      nextConfirmado = true;
      nextPases = guest.pases_totales;
      nextAsistentes = [guest.nombre_invitacion];
    } else if (guest.confirmado === true) {
      nextConfirmado = false;
      nextPases = 0;
      nextAsistentes = [];
    } else {
      nextConfirmado = null;
      nextPases = 0;
      nextAsistentes = [];
    }

    const { error } = await supabase
      .from("invitados")
      .update({
        confirmado: nextConfirmado,
        pases_confirmados: nextPases,
        nombres_asistentes: nextAsistentes
      })
      .eq("id", id);

    if (error) {
      alert("Error al actualizar estado: " + error.message);
    } else {
      fetchGuests();
    }
  };

  // Search & Filter filter logic
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      // Filter tab
      if (activeFilter === "confirmados" && g.confirmado !== true) return false;
      if (activeFilter === "declinados" && g.confirmado !== false) return false;
      if (activeFilter === "pendientes" && g.confirmado !== null) return false;

      // Search bar
      if (!search) return true;
      const term = search.toLowerCase();
      const matchName = g.nombre_invitacion.toLowerCase().includes(term);
      const matchToken = g.token.toLowerCase().includes(term);
      const matchAsistentes = g.nombres_asistentes.some(name => name.toLowerCase().includes(term));

      return matchName || matchToken || matchAsistentes;
    });
  }, [guests, search, activeFilter]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* ── Top Admin Header ── */}
      <header className="bg-card border-b border-border py-4 px-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <div>
              <h1 className="text-xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
                Panel de Confirmaciones
              </h1>
              <p className="text-[10px] tracking-widest text-muted-foreground uppercase font-bold">
                Mariana &amp; Mariano
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-block px-3 py-1.5 rounded hover:bg-muted"
            >
              Ver Invitación
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-muted hover:bg-destructive hover:text-white rounded-md transition-colors cursor-pointer text-muted-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Content ── */}
      <main className="flex-grow p-6 max-w-7xl w-full mx-auto space-y-8">
        
        {/* ── Stats Summary Grid ── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total */}
          <div className="bg-card border border-border p-5 rounded-lg shadow-sm flex items-start gap-4">
            <div className="p-3 bg-muted rounded-md text-muted-foreground shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Total Invitados</p>
              <h3 className="text-2xl font-semibold text-foreground">
                {stats.totalPases} <span className="text-sm font-normal text-muted-foreground">pases</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">En {stats.totalInvitaciones} invitaciones</p>
            </div>
          </div>

          {/* Card 2: Confirmed */}
          <div className="bg-card border border-border p-5 rounded-lg shadow-sm flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-md shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 mb-1">Confirmados</p>
              <h3 className="text-2xl font-semibold text-emerald-700">
                {stats.confirmadosPases} <span className="text-sm font-normal text-emerald-600">pases</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{stats.confirmadosInvitaciones} confirmaciones totales</p>
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="bg-card border border-border p-5 rounded-lg shadow-sm flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-md shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-amber-600 mb-1">Pendientes</p>
              <h3 className="text-2xl font-semibold text-amber-700">
                {stats.pendientesPases} <span className="text-sm font-normal text-amber-600">pases</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Faltan {stats.pendientesInvitaciones} respuestas</p>
            </div>
          </div>

          {/* Card 4: Declined */}
          <div className="bg-card border border-border p-5 rounded-lg shadow-sm flex items-start gap-4">
            <div className="p-3 bg-rose-500/10 text-rose-600 rounded-md shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-rose-600 mb-1">No Asistirán</p>
              <h3 className="text-2xl font-semibold text-rose-700">
                {stats.declinadosPases} <span className="text-sm font-normal text-rose-600">pases</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{stats.declinadosInvitaciones} cancelaciones / pases libres</p>
            </div>
          </div>
        </section>

        {/* ── Actions bar (Search, Filter, Add button) ── */}
        <section className="bg-card border border-border p-4 rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1 w-full md:w-auto">
            {[
              { id: "todos", label: "Todos" },
              { id: "confirmados", label: "Confirmados" },
              { id: "pendientes", label: "Pendientes" },
              { id: "declinados", label: "No Asistirán" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-2 rounded-md text-xs font-semibold tracking-wide transition-colors cursor-pointer
                  ${activeFilter === tab.id 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Add */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar invitado, asistente..."
                className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-xs text-foreground bg-input-background placeholder-muted-foreground/60 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Add Guest Button */}
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground hover:opacity-90 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
              style={{ backgroundColor: "var(--secondary)" }}
            >
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Invitado</span>
            </button>
          </div>
        </section>

        {/* ── Add New Guest Form Panel ── */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card border border-border rounded-lg shadow-sm overflow-hidden"
            >
              <form onSubmit={handleAddGuest} className="p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h4 className="font-semibold text-base text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                    Registrar Nuevo Invitado
                  </h4>
                  <button 
                    type="button" 
                    onClick={resetAddForm} 
                    className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider uppercase font-bold text-muted-foreground">
                      Nombre de la Invitación *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Familia Ruiz Gómez"
                      value={nombreInvitacion}
                      onChange={(e) => setNombreInvitacion(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded bg-input-background text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>

                  {/* Pases Totales */}
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider uppercase font-bold text-muted-foreground">
                      Pases Totales
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={pasesTotales}
                      onChange={(e) => setPasesTotales(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-border rounded bg-input-background text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>

                  {/* Token Access */}
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider uppercase font-bold text-muted-foreground flex items-center gap-1">
                      <Key className="w-3 h-3" /> Token Personalizado (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Dejar vacío para auto-generar"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded bg-input-background text-xs text-foreground uppercase outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Confirmado status selector */}
                  <div className="space-y-2">
                    <label className="block text-[10px] tracking-wider uppercase font-bold text-muted-foreground">
                      Estado de Asistencia
                    </label>
                    <div className="flex gap-2">
                      {[
                        { val: null, label: "Pendiente", color: "bg-muted text-muted-foreground border-border" },
                        { val: true, label: "Confirmado", color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
                        { val: false, label: "No Asistirá", color: "bg-rose-500/10 text-rose-700 border-rose-500/20" }
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => {
                            setConfirmado(opt.val);
                            if (opt.val !== true) {
                              setPasesConfirmados(0);
                            } else {
                              setPasesConfirmados(pasesTotales);
                            }
                          }}
                          className={`flex-1 py-2 rounded border text-[11px] font-semibold transition-all cursor-pointer
                            ${confirmado === opt.val 
                              ? "ring-2 ring-primary border-primary " + opt.color.split(" ")[0] 
                              : "bg-transparent text-muted-foreground border-border hover:bg-muted"
                            }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pases Confirmados (conditional) */}
                  <div className="space-y-2">
                    <label className={`block text-[10px] tracking-wider uppercase font-bold text-muted-foreground ${confirmado !== true && "opacity-50"}`}>
                      Pases Confirmados
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={pasesTotales}
                      disabled={confirmado !== true}
                      value={pasesConfirmados}
                      onChange={(e) => setPasesConfirmados(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-border rounded bg-input-background text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-40"
                    />
                  </div>

                  {/* Nombres Asistentes (conditional) */}
                  <div className="space-y-2">
                    <label className={`block text-[10px] tracking-wider uppercase font-bold text-muted-foreground ${confirmado !== true && "opacity-50"}`}>
                      Nombres de Asistentes (Separados por coma)
                    </label>
                    <input
                      type="text"
                      disabled={confirmado !== true}
                      placeholder="e.g. Alejandro Ruiz, Sofía Gómez"
                      value={nombresAsistentesInput}
                      onChange={(e) => setNombresAsistentesInput(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded bg-input-background text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-40"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={resetAddForm}
                    className="px-4 py-2 border border-border text-xs font-semibold rounded hover:bg-muted transition-colors cursor-pointer text-muted-foreground"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded hover:opacity-90 transition-all cursor-pointer"
                  >
                    Guardar Invitado
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Guest List Table Card ── */}
        <section className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground font-semibold text-[10px] tracking-wider uppercase">
                  <th className="py-4 px-6">Invitación / Token</th>
                  <th className="py-4 px-6 text-center">Pases Confirmados</th>
                  <th className="py-4 px-6">Nombres de Asistentes</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {isLoadingGuests ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span>Cargando lista de invitados...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground font-medium">
                      No se encontraron invitados que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest) => {
                    const isEditing = editingGuestId === guest.id;

                    return (
                      <tr key={guest.id} className="hover:bg-muted/20 transition-colors">
                        {/* Column 1: Invitation Name & Token */}
                        <td className="py-4 px-6">
                          {isEditing ? (
                            <div className="space-y-1.5 max-w-xs">
                              <input
                                type="text"
                                value={editNombre}
                                onChange={(e) => setEditNombre(e.target.value)}
                                className="w-full px-2 py-1 border border-border rounded text-xs bg-input-background"
                              />
                              <div className="flex items-center gap-1.5">
                                <Key className="w-3.5 h-3.5 text-muted-foreground" />
                                <input
                                  type="text"
                                  value={editToken}
                                  onChange={(e) => setEditToken(e.target.value)}
                                  className="w-24 px-2 py-0.5 border border-border rounded text-[11px] uppercase bg-input-background"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="font-semibold text-foreground">{guest.nombre_invitacion}</p>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground flex items-center gap-1 select-all">
                                  <span className="bg-muted px-1.5 py-0.5 rounded text-[9px] font-sans border border-border">TOKEN:</span> {guest.token}
                                </p>
                                <button
                                  onClick={() => handleCopyLink(guest.token, guest.id)}
                                  className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer focus:outline-none"
                                  title="Copiar enlace exclusivo para WhatsApp"
                                >
                                  {copiedGuestId === guest.id ? (
                                    <span className="text-emerald-600 flex items-center gap-0.5">
                                      <Check className="w-3 h-3" /> ¡Copiado!
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-0.5 hover:text-accent">
                                      <Copy className="w-3 h-3" /> Copiar Enlace
                                    </span>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Column 2: Passes */}
                        <td className="py-4 px-6 text-center">
                          {isEditing ? (
                            <div className="inline-flex items-center gap-1.5 justify-center">
                              <input
                                type="number"
                                min="0"
                                max={editPasesTotales}
                                value={editConfirmado === true ? editPasesConfirmados : 0}
                                disabled={editConfirmado !== true}
                                onChange={(e) => setEditPasesConfirmados(Number(e.target.value))}
                                className="w-12 text-center py-1 border border-border rounded text-xs bg-input-background disabled:opacity-40"
                              />
                              <span className="text-muted-foreground">/</span>
                              <input
                                type="number"
                                min="1"
                                value={editPasesTotales}
                                onChange={(e) => setEditPasesTotales(Number(e.target.value))}
                                className="w-12 text-center py-1 border border-border rounded text-xs bg-input-background"
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-foreground">
                                {guest.confirmado === true ? guest.pases_confirmados : 0} 
                                <span className="text-muted-foreground font-normal"> de {guest.pases_totales}</span>
                              </span>
                              {guest.confirmado === true && guest.pases_confirmados < guest.pases_totales && (
                                <span className="text-[9px] text-amber-600 font-semibold mt-0.5">
                                  {guest.pases_totales - guest.pases_confirmados} cancelado(s)
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Column 3: Attendees names */}
                        <td className="py-4 px-6 max-w-xs">
                          {isEditing ? (
                            <input
                              type="text"
                              disabled={editConfirmado !== true}
                              placeholder="Asistente 1, Asistente 2"
                              value={editConfirmado === true ? editAsistentesInput : ""}
                              onChange={(e) => setEditAsistentesInput(e.target.value)}
                              className="w-full px-2 py-1 border border-border rounded text-xs bg-input-background disabled:opacity-40"
                            />
                          ) : (
                            <div>
                              {guest.confirmado === true ? (
                                guest.nombres_asistentes.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {guest.nombres_asistentes.map((name, i) => (
                                      <span key={i} className="bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-500/10">
                                        {name}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground italic text-[11px]">No se especificaron asistentes</span>
                                )
                              ) : guest.confirmado === false ? (
                                <span className="text-muted-foreground/60 line-through">Sin asistencia</span>
                              ) : (
                                <span className="text-muted-foreground/50 italic">Esperando confirmación...</span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Column 4: Status Badge */}
                        <td className="py-4 px-6">
                          {isEditing ? (
                            <select
                              value={editConfirmado === null ? "null" : String(editConfirmado)}
                              onChange={(e) => {
                                const val = e.target.value;
                                const parsed = val === "null" ? null : val === "true";
                                setEditConfirmado(parsed);
                                if (parsed !== true) {
                                  setEditPasesConfirmados(0);
                                } else {
                                  setEditPasesConfirmados(editPasesTotales);
                                }
                              }}
                              className="px-2 py-1 border border-border rounded text-xs bg-input-background font-semibold"
                            >
                              <option value="null">Pendiente</option>
                              <option value="true">Confirmado</option>
                              <option value="false">No Asistirá</option>
                            </select>
                          ) : (
                            <button
                              onClick={() => toggleQuickStatus(guest.id)}
                              className="text-left group cursor-pointer focus:outline-none"
                              title="Click para cambiar estado"
                            >
                              {guest.confirmado === true ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-700 text-[10px] font-semibold border border-emerald-500/20 hover:bg-emerald-500/25 transition-colors">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  Confirmado
                                </span>
                              ) : guest.confirmado === false ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 text-rose-700 text-[10px] font-semibold border border-rose-500/20 hover:bg-rose-500/25 transition-colors">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                  No asistirá
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted text-muted-foreground text-[10px] font-semibold border border-border hover:bg-muted-foreground/10 transition-colors">
                                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                                  Pendiente
                                </span>
                              )}
                            </button>
                          )}
                        </td>

                        {/* Column 5: Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveEdit(guest.id)}
                                  className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded transition-colors cursor-pointer"
                                  title="Guardar Cambios"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingGuestId(null)}
                                  className="p-1.5 bg-muted hover:bg-muted-foreground/10 text-muted-foreground rounded transition-colors cursor-pointer border border-border"
                                  title="Cancelar"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(guest)}
                                  className="p-1.5 bg-muted hover:bg-muted-foreground/15 text-muted-foreground hover:text-foreground rounded transition-all cursor-pointer border border-border"
                                  title="Editar Invitado"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteGuest(guest.id)}
                                  className="p-1.5 bg-muted hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/20 text-muted-foreground rounded transition-all cursor-pointer border border-border"
                                  title="Eliminar Invitado"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
