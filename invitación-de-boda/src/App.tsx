import { useState, useRef, useEffect } from "react";
import SplashEntry from "./components/SplashEntry";
import HeroHeader from "./components/HeroHeader";
import CountdownTimer from "./components/CountdownTimer";
import EventLocations from "./components/EventLocations";
import RsvpSection from "./components/RsvpSection";
import FloatingMenu from "./components/FloatingMenu";
import Footer from "./components/Footer";
import backgroundAudio from "./assets/BLAZE - EYES.mp3";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inicializar elemento de audio en background
  useEffect(() => {
    const audio = new Audio(backgroundAudio);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Update audio behavior when audioEnabled changes
  useEffect(() => {
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.play().catch((err) => {
          console.warn("Autoplay bloqueado por el navegador o fallo de carga: ", err);
          setAudioEnabled(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioEnabled]);

  const handleToggleMute = () => {
    setAudioEnabled(!audioEnabled);
  };

  return (
    <div className="relative min-h-screen bg-wedding-bg select-none antialiased max-w-md mx-auto overflow-x-hidden shadow-xl">
      {/* 1. Modal inicial sutil para aceptar el audio */}
      <SplashEntry 
        showSplash={showSplash} 
        setShowSplash={setShowSplash} 
        setAudioEnabled={setAudioEnabled} 
      />

      {/* Solo mostramos o activamos efectos del contenido principal al entrar */}
      <div className={`transition-opacity duration-1000 ${!showSplash ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {/* 2. Cabecera principal con nombres y fecha */}
        <HeroHeader />

        {/* 3. Temporizador cuenta regresiva dinámico */}
        <CountdownTimer />

        {/* 4. Información de tarjetas de locación y hora */}
        <EventLocations />

        {/* 5. Contenedor del formulario RSVP */}
        <RsvpSection />

        <Footer />

        {/* Espaciador final decorativo sutil para que el menú sticky no cubra elementos importantes */}
        <div className="h-28 bg-wedding-bg" />

        {/* 6. Menú sticky inferior para acciones de navegación rápidas */}
        {!showSplash && (
          <FloatingMenu isMuted={!audioEnabled} onToggleMute={handleToggleMute} />
        )}
      </div>
    </div>
  );
}
