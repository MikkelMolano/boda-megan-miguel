import { motion, AnimatePresence } from "motion/react";
import coupleIllustration from '../assets/Asset 01.png';
import dogIllustration from '../assets/Asset 02.png';

interface SplashEntryProps {
  showSplash: boolean;
  setShowSplash: (val: boolean) => void;
  setAudioEnabled: (val: boolean) => void;
}

export default function SplashEntry({ showSplash, setShowSplash, setAudioEnabled }: SplashEntryProps) {
  const handleEnter = () => {
    setAudioEnabled(true);
    setShowSplash(false);
  };

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          id="splash-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col bg-wedding-bg overflow-hidden"
        >
          {/* BLOQUE SUPERIOR: perrito + titulo + texto + botones */}
          <div className="relative z-10 flex flex-col items-center text-center px-8 pt-10 sm:pt-14 pb-6">

            {/* Asset 02 - perrito angelito, pequeño y centrado */}
            <img
              src={dogIllustration}
              alt=""
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain mb-4 sm:mb-5 select-none pointer-events-none"
            />

            {/* Título */}
            <h1 className="font-serif font-normal not-italic text-4xl sm:text-5xl text-[#5C5F4B] leading-tight mb-3">
              Megan & Miguel
            </h1>

            {/* Texto descriptivo */}
            <p className="text-xs sm:text-sm text-wedding-dark/60 leading-relaxed max-w-[260px] mb-7">
              Guardamos un lugar especial para ti en uno de los dias más importantes de nuestras vidas.
            </p>

            {/* Botones - más compactos */}
            <div className="flex flex-col gap-2.5 w-full max-w-[280px]">
              <button
                id="btn-enter"
                onClick={handleEnter}
                className="w-full h-11 sm:h-12 rounded-full bg-wedding-dark text-wedding-light flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
              >
                Continuar
              </button>
            </div>
          </div>

          {/* Asset 01 - pareja, emergiendo desde el fondo */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none flex justify-center items-end">
            <img
              src={coupleIllustration}
              alt="Megan y Miguel"
              className="w-full h-auto object-contain object-bottom select-none"
              style={{ minHeight: '65vh', width: '100%' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
