import { motion } from "motion/react";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import { WEDDING_CONFIG } from "../utils/weddingConfig";

export default function EventLocations() {
  return (
    <section id="locations" className="pt-16 pb-20 px-6 sm:pt-20 sm:pb-24 sm:px-8 bg-stone-100 flex flex-col items-center">
      <div className="max-w-4xl w-full text-center">
        <span className="text-xs tracking-wide text-stone-500 font-sans block mb-2">
          ¿Dónde y cuándo?
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-10">
          Los Detalles del Evento
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="bg-wedding-light border border-wedding-sand rounded-3xl p-6 shadow-none w-full max-w-sm md:max-w-md mx-auto flex flex-col justify-between text-left"
        >
          <div>
            {/* Cabecera Tarjeta */}
            <span className="text-[10px] tracking-wide text-wedding-olive mb-2 block font-sans">
              La celebración
            </span>
            <h3 className="font-serif text-3xl text-wedding-dark mb-4">
              Ceremonia, cena y fiesta
            </h3>

            <div className="space-y-5">
              <p className="font-sans text-sm text-wedding-dark/70 leading-relaxed">
                Una noche íntima para celebrar nuestro amor entre buena comida, música y los que más queremos.
              </p>

              <div className="flex items-start gap-4">
                <Clock className="w-4 h-4 text-wedding-olive mt-0.5 shrink-0" />
                <div>
                  <p className="text-[9px] tracking-wide font-sans text-wedding-olive">Horario</p>
                  <p className="text-base font-sans font-bold text-wedding-dark">
                    {WEDDING_CONFIG.venue.startTime} — {WEDDING_CONFIG.venue.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-4 h-4 text-wedding-olive mt-0.5 shrink-0" />
                <div>
                  <p className="text-[9px] tracking-wide font-sans text-wedding-olive">Lugar</p>
                  <p className="text-base font-sans font-bold text-wedding-dark">{WEDDING_CONFIG.venue.name}</p>
                  <p className="text-xs font-sans text-wedding-dark/50 mt-0.5">{WEDDING_CONFIG.venue.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de Dirección */}
          <a
            href={WEDDING_CONFIG.venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full mt-6 py-3 px-4 rounded-full border border-wedding-sand bg-transparent hover:bg-wedding-sand/40 transition-colors duration-300 text-sm font-sans tracking-normal normal-case text-wedding-dark"
          >
            <ExternalLink className="w-4 h-4" />
            Ver en Google Maps
          </a>
        </motion.div>
      </div>
    </section>
  );
}
