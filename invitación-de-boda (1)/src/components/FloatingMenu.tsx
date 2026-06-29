import { motion } from "motion/react";
import { Music, VolumeX, MailCheck, Map, ArrowUp } from "lucide-react";

interface FloatingMenuProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function FloatingMenu({ isMuted, onToggleMute }: FloatingMenuProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-wedding-light/90 backdrop-blur-sm border border-wedding-sand/50 px-5 py-3 rounded-full shadow-sm flex items-center gap-4 sm:gap-6"
    >
      {/* Botón Ubicaciones */}
      <button
        id="btn-nav-locations"
        onClick={() => scrollToSection("locations")}
        title="Ubicación"
        className="p-2.5 rounded-full text-wedding-dark/60 hover:bg-wedding-sand/50 active:bg-wedding-sand transition-colors duration-200 flex items-center justify-center"
      >
        <Map className="w-4.5 h-4.5" />
      </button>

      {/* Botón RSVP principal */}
      <button
        id="btn-nav-rsvp"
        onClick={() => scrollToSection("rsvp")}
        title="Confirmar Asistencia"
        className="py-2.5 px-4 rounded-full bg-wedding-dark text-wedding-light hover:bg-wedding-dark/90 transition-colors duration-200 flex items-center gap-1.5 text-xs font-bold normal-case tracking-normal"
      >
        <MailCheck className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">RSVP</span>
      </button>

      {/* Botón Silenciar / Reproducir Música */}
      <button
        id="btn-nav-mute"
        onClick={onToggleMute}
        title={isMuted ? "Activar música" : "Silenciar música"}
        className="p-2.5 rounded-full text-wedding-dark/60 hover:bg-wedding-sand/50 active:bg-wedding-sand transition-colors duration-200 flex items-center justify-center"
      >
        {isMuted ? (
          <VolumeX className="w-4.5 h-4.5 text-wedding-dark/60" />
        ) : (
          <span className="relative flex h-4.5 w-4.5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wedding-olive opacity-30"></span>
            <Music className="w-4.5 h-4.5 text-wedding-dark/60 relative" />
          </span>
        )}
      </button>

      {/* Separador */}
      <div className="w-[1px] h-5 bg-wedding-sand" />

      {/* Botón Volver Arriba */}
      <button
        id="btn-nav-top"
        onClick={() => scrollToSection("hero")}
        title="Inicio"
        className="p-2.5 rounded-full text-wedding-dark/60 hover:bg-wedding-sand/50 active:bg-wedding-sand transition-colors duration-200 flex items-center justify-center"
      >
        <ArrowUp className="w-4.5 h-4.5" />
      </button>
    </motion.div>
  );
}
