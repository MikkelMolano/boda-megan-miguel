import { motion } from "motion/react";
import { Calendar, Heart } from "lucide-react";
import { WEDDING_CONFIG } from "../utils/weddingConfig";

export default function HeroHeader() {
  return (
    <header id="hero" className="relative min-h-screen pt-20 pb-16 flex flex-col items-center justify-center text-center px-6 sm:px-8 overflow-hidden animate-fade-in-up">
      {/* Elegante marco lineal sutil de diseño editorial */}
      <div className="absolute inset-4 sm:inset-8 border border-stone-200/60 pointer-events-none flex flex-col justify-between p-4">
        <div className="flex justify-between text-[10px] tracking-wide text-stone-400 font-sans">
          <span>Save the date</span>
          <span>M&M • 2026</span>
        </div>
      </div>

      <div className="max-w-2xl px-6 relative z-10 flex flex-col items-center">
        {/* Copy principal */}
        <h2 className="font-serif font-normal not-italic text-5xl md:text-6xl text-wedding-dark leading-tight text-center">
          We're getting married!
        </h2>
        <p className="font-sans font-normal not-italic text-xl text-wedding-olive text-center mt-2 mb-10">
          o sea, vamo' a casarnos
        </p>

        {/* Nombres con tipografía Serif elegante */}
        <h1 className="font-serif font-normal not-italic text-8xl sm:text-7xl text-[#5C5F4B] leading-tight flex flex-col items-center">
          <span>Megan</span>
          <span className="block font-serif font-normal not-italic text-[#5C5F4B] text-5xl my-1">&</span>
          <span>Miguel</span>
        </h1>

        {/* Fecha y Detalle */}
        <div className="flex flex-col items-center mt-8">
          <p className="font-mono text-xs tracking-wide text-stone-500 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            {WEDDING_CONFIG.dateLabel}
          </p>
          <span className="text-sm font-serif italic text-stone-500 mt-1">
            {WEDDING_CONFIG.location}
          </span>
          <hr className="border-wedding-sand w-16 mx-auto mt-6 mb-0" />
        </div>

        {/* Indicador de acción para bajar */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 mt-10 mb-0"
        >
          <Heart className="w-4 h-4 text-stone-400" />
          <span className="text-[10px] tracking-wide text-stone-400">Deslizar</span>
        </motion.div>
      </div>
    </header>
  );
}
