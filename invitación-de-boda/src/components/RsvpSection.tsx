import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Loader, Users, AlertCircle } from "lucide-react";
import { WEDDING_CONFIG } from "../utils/weddingConfig";
import { supabase } from "../utils/supabase";

const normalizarNombre = (nombre: string) => {
  return nombre
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
};

export default function RsvpSection() {
  const [formData, setFormData] = useState({
    name: "",
    attending: "",
    restrictions: "",
    message: ""
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isFormValid =
    formData.name.trim().length >= 2 &&
    formData.attending !== '' &&
    formData.restrictions.trim().length >= 1 &&
    formData.message.trim().length >= 1;

  const FECHA_LIMITE = new Date('2026-07-10T23:59:59-05:00');
  const plazoVencido = new Date() > FECHA_LIMITE;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading || plazoVencido) return;
    
    if (!formData.name) {
      setStatus("error");
      setErrorMessage("Por favor, introduce tu nombre.");
      return;
    }

    setStatus("loading");
    setIsLoading(true);

    try {
      const nombreCompleto = formData.name.trim();
      const nombreNormalizado = normalizarNombre(nombreCompleto);
      const partes = nombreNormalizado.split(' ');
      const primerNombre = partes[0];
      const apellido = partes.length > 1 ? partes[partes.length - 1] : '';

      const { error } = await supabase
        .from('rsvp')
        .insert({
          nombre_completo: nombreCompleto,
          nombre_normalizado: nombreNormalizado,
          primer_nombre: primerNombre,
          apellido: apellido,
          asistencia: formData.attending,
          restricciones: formData.restrictions || 'Ninguna',
          mensaje: formData.message || ''
        });
        fetch('https://script.google.com/macros/s/AKfycbxv_yeHO2n4cDdK14_QZbU-C_bQ5F8Pb5CvFJFxf3jrdqFe1lA/exec',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({nombre_completo:nombreCompleto,nombre_normalizado:nombreNormalizado,primer_nombre:primerNombre,apellido:apellido,asistencia:formData.attending,restricciones:formData.restrictions||'Ninguna',mensaje:formData.message||''})}).catch(()=>{});

      if (error) {
        const { error: updateError } = await supabase
          .from('rsvp')
          .update({
            asistencia: formData.attending,
            restricciones: formData.restrictions || 'Ninguna',
            mensaje: formData.message || '',
            updated_at: new Date().toISOString()
          })
          .eq('nombre_normalizado', nombreNormalizado);

        if (updateError) {
          throw updateError;
        }
      }
      
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Hubo un problema enviando tu confirmación. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="rsvp" className="pt-16 pb-32 px-6 sm:pt-20 sm:pb-36 sm:px-8 bg-stone-50 flex flex-col items-center">
      <div className="max-w-xl w-full">
        <div className="text-center mb-12">
          <span className="text-xs tracking-wide text-stone-500 font-sans block mb-3">
            Confirmar asistencia
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900">
            ¿Nos acompañas?
          </h2>
          <div className="w-8 h-[1px] bg-stone-300 mx-auto my-6" />
          <p className="font-sans text-stone-500 text-sm max-w-sm mx-auto leading-relaxed">
            Por favor, confirmar tu asistencia antes del 10 de Julio de {WEDDING_CONFIG.date.getFullYear()} para ayudarnos con la organización.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-stone-100/60 p-8 sm:p-10 rounded-3xl border border-stone-200/50 shadow-sm"
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-10 flex flex-col items-center"
              >
                <div className="w-14 h-14 bg-stone-800 text-stone-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl text-stone-900 mb-3">¡Gracias por confirmar!</h3>
                <p className="font-sans text-stone-600 text-sm max-w-xs mx-auto leading-relaxed">
                  <span className="block mb-2">El mejor regalo es tu compañía.</span>
                  <span className="block">Si quieres tener un detalle extra, tendremos lluvia de sobres.</span>
                </p>
                <p className="mt-8 text-[11px] text-stone-400">
                  {plazoVencido 
                    ? "El plazo para modificar tu respuesta venció el 10 de julio de 2026." 
                    : "Puedes modificar tu respuesta hasta el 10 de julio de 2026."}
                </p>
                {!plazoVencido && (
                  <button
                    id="btn-rsvp-reset"
                    onClick={() => setStatus("idle")}
                    className="mt-4 text-xs underline font-bold text-stone-500 hover:text-stone-800 transition-colors"
                  >
                    Modificar mi respuesta
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.form
                id="rsvp-form"
                key="form"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Nombre */}
                <div>
                  <label htmlFor="name" className="block text-[10px] tracking-wide text-wedding-olive font-normal font-sans mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Escribe tu nombre"
                    className="w-full bg-wedding-light border border-wedding-sand rounded-2xl px-5 py-4 text-sm text-wedding-dark placeholder:text-wedding-dark/30 focus:outline-none focus:border-wedding-olive focus:ring-1 focus:ring-wedding-olive/30 transition-colors duration-200"
                  />
                </div>

                {/* Asiste */}
                <div>
                  <label htmlFor="attending" className="block text-[10px] tracking-wide text-wedding-olive font-normal font-sans mb-2">
                    ¿Asistirás a la boda?
                  </label>
                  <div className="relative">
                    <select
                      id="attending"
                      name="attending"
                      value={formData.attending}
                      onChange={handleChange}
                      className="w-full bg-wedding-light border border-wedding-sand rounded-2xl px-5 py-4 text-sm text-wedding-dark placeholder:text-wedding-dark/30 focus:outline-none focus:border-wedding-olive focus:ring-1 focus:ring-wedding-olive/30 transition-colors duration-200 appearance-none pr-12"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="confirmed">Asistiré con gusto</option>
                      <option value="declined">No podré asistir</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-wedding-olive">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Restricciones Alimenticias */}
                <div>
                  <label htmlFor="restrictions" className="flex items-center gap-1.5 text-[10px] tracking-wide text-wedding-olive font-normal font-sans mb-2">
                    Restricciones alimenticias
                  </label>
                  <input
                    type="text"
                    id="restrictions"
                    name="restrictions"
                    value={formData.restrictions}
                    onChange={handleChange}
                    placeholder="Alergias, vegetariano, vegano, etc. (Opcional)"
                    className="w-full bg-wedding-light border border-wedding-sand rounded-2xl px-5 py-4 text-sm text-wedding-dark placeholder:text-wedding-dark/30 focus:outline-none focus:border-wedding-olive focus:ring-1 focus:ring-wedding-olive/30 transition-colors duration-200"
                  />
                </div>

                {/* Mensaje */}
                <div>
                  <label htmlFor="message" className="block text-[10px] tracking-wide text-wedding-olive font-normal font-sans mb-2">
                    Mensaje para los novios
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Escríbenos una felicitación o sugerencia musical"
                    className="w-full bg-wedding-light border border-wedding-sand rounded-2xl px-5 py-4 text-sm text-wedding-dark placeholder:text-wedding-dark/30 focus:outline-none focus:border-wedding-olive focus:ring-1 focus:ring-wedding-olive/30 transition-colors duration-200 resize-none"
                  />
                </div>

                {/* Mensajes de error */}
                {status === "error" && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Botón de Enviar */}
                <button
                  id="btn-rsvp-submit"
                  type="submit"
                  disabled={!isFormValid || isLoading || plazoVencido}
                  className={`w-full h-14 mt-8 rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                    isFormValid && !isLoading && !plazoVencido
                      ? 'bg-wedding-dark text-wedding-light cursor-pointer hover:bg-wedding-olive'
                      : isFormValid && isLoading && !plazoVencido
                      ? 'bg-wedding-dark text-wedding-light cursor-not-allowed'
                      : 'bg-wedding-sand text-wedding-dark/30 cursor-not-allowed opacity-60'
                  }`}
                >
                  <span className={`transition-opacity duration-200 text-sm font-bold tracking-normal normal-case ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    Confirmar asistencia
                  </span>
                  
                  {isLoading && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-wedding-light" 
                           viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" 
                                stroke="currentColor" strokeWidth="2"/>
                        <path className="opacity-90" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    </span>
                  )}
                </button>
                {plazoVencido && (
                  <p className="mt-4 text-center text-xs text-red-500">
                    El plazo para modificar tu respuesta venció el 10 de julio de 2026.
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
