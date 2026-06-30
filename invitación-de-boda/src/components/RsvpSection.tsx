import React, { useState, useRef, useEffect } from "react";
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

const llegadaOptions = [
  { value: 'Ceremonia - 4:30 PM', label: 'Ceremonia - 4:30 PM' },
  { value: 'Brindis - 6 PM',   label: 'Brindis - 6 PM' },
  { value: 'Después de las 6 PM',      label: 'Después de las 6 PM' },
];

const asistenciaOptions = [
  { value: 'confirmed', label: 'Sí, asistiré' },
  { value: 'declined', label: 'No podré asistir' }
];

export default function RsvpSection() {
  const [formData, setFormData] = useState({
    name: "",
    attending: "",
    hora_llegada: "",
    restrictions: "",
    message: ""
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownAsistenciaRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAsistenciaDropdownOpen, setIsAsistenciaDropdownOpen] = useState(false);

  const isDeclined = formData.attending === 'declined';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (dropdownAsistenciaRef.current && !dropdownAsistenciaRef.current.contains(event.target as Node)) {
        setIsAsistenciaDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isFormValid =
    formData.name.trim().length >= 2 &&
    formData.attending !== '' &&
    (isDeclined || formData.hora_llegada !== '');

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
          nombre_completo: normalizarNombre(formData.name),
                    nombre_normalizado: nombreNormalizado,
          primer_nombre: primerNombre,
          apellido: apellido,
                    asistencia: formData.attending,
          hora_llegada: isDeclined ? null : formData.hora_llegada || null,
                    restricciones: isDeclined ? null : formData.restrictions || null,
                    mensaje: isDeclined ? null : formData.message || null,
        });
        fetch('https://script.google.com/macros/s/AKfycbxv_yeHO2n4cDdK14_QZbU-C_bQ5F8Pb5CvFJFxf3jrdqFe1lA/exec',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({nombre_completo:nombreCompleto,nombre_normalizado:nombreNormalizado,primer_nombre:primerNombre,apellido:apellido,asistencia:formData.attending,hora_llegada: isDeclined ? null : formData.hora_llegada || null,restricciones:isDeclined ? 'Ninguna' : formData.restrictions||'Ninguna',mensaje:isDeclined ? '' : formData.message||''})}).catch(()=>{});

      if (error) {
        const { error: updateError } = await supabase
          .from('rsvp')
          .update({
                      asistencia: formData.attending,
            hora_llegada: isDeclined ? null : formData.hora_llegada || null,
                      restricciones: isDeclined ? null : formData.restrictions || null,
                      mensaje: isDeclined ? null : formData.message || null,
            updated_at: new Date().toISOString()
          })
        .eq('nombre_completo', normalizarNombre(formData.name));
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
          <span className="text-[14px] tracking-wide text-stone-500 font-sans block mb-3">
            Confirmar asistencia
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#22211D]">
            ¿Nos acompañas?
          </h2>
          <div className="w-8 h-[1px] bg-stone-300 mx-auto my-6" />
          <p className="font-sans text-stone-500 text-sm max-w-sm mx-auto leading-relaxed">
            Por favor, confirmar tu asistencia antes del <strong className="font-bold" style={{ color: '#5C5F4B' }}>10 de Julio de {WEDDING_CONFIG.date.getFullYear()}</strong> para ayudarnos con la organización.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-transparent p-8 sm:p-10 rounded-3xl border border-wedding-dark/20"
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
                  <span className="block mt-4">
                    <strong className="font-bold">Nota importante:</strong> Si no alcanzas a llegar a las 4:30 en punto, porfa llega a partir de las 6:00 PM para no interrumpir la ceremonia.
                  </span>
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
                  <label htmlFor="name" className="block text-sm font-medium text-wedding-dark mb-2">
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
                    className="w-full bg-white/80 border border-wedding-dark/20 rounded-2xl px-4 py-3 text-sm text-wedding-dark placeholder:text-wedding-dark/40 focus:outline-none focus:border-[#5C5F4B] focus:ring-2 focus:ring-[#5C5F4B]/20 transition-colors"
                  />
                </div>

                {/* Asiste */}
                <div ref={dropdownAsistenciaRef} className="relative z-30">
                  <label className="block text-sm font-medium text-wedding-dark mb-2">
                    ¿Asistirás a la boda?
                  </label>
                  
                  <div 
                    onClick={() => setIsAsistenciaDropdownOpen(!isAsistenciaDropdownOpen)}
                    className={`w-full rounded-2xl border bg-white/80 px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${isAsistenciaDropdownOpen ? 'border-[#5C5F4B] ring-2 ring-[#5C5F4B]/20' : 'border-wedding-dark/20'}`}
                  >
                    <span className={formData.attending ? "text-sm text-wedding-dark" : "text-sm text-wedding-dark/40"}>
                      {formData.attending 
                        ? asistenciaOptions.find(opt => opt.value === formData.attending)?.label 
                        : "Selecciona una opción"
                      }
                    </span>
                    <svg 
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" 
                      className={`text-wedding-dark/50 transition-transform duration-200 ${isAsistenciaDropdownOpen ? 'rotate-180' : ''}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>

                  <AnimatePresence>
                    {isAsistenciaDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute w-full top-full left-0 mt-1 rounded-2xl border border-wedding-dark/20 bg-[#FAF8F3] shadow-sm overflow-hidden z-40"
                      >
                        {asistenciaOptions.map((option) => (
                          <div 
                            key={option.value}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, attending: option.value }));
                              setIsAsistenciaDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-wedding-dark/5 transition-colors"
                          >
                            <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              formData.attending === option.value 
                                ? 'border-[#5C5F4B] bg-[#5C5F4B]' 
                                : 'border-wedding-dark/30'
                            }`}>
                              {formData.attending === option.value && (
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                              )}
                            </div>
                            <span className="text-sm text-wedding-dark">{option.label}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Hora de llegada */}
                <div ref={dropdownRef} className={`relative z-20 ${isDeclined ? 'pointer-events-none opacity-40' : ''}`}>
                  <label className="block text-sm font-medium text-wedding-dark mb-2">
                    ¿A qué parte de la celebración llegarás?
                  </label>
                  
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full rounded-2xl border bg-white/80 px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${isDropdownOpen ? 'border-[#5C5F4B] ring-2 ring-[#5C5F4B]/20' : 'border-wedding-dark/20'}`}
                  >
                    <span className={formData.hora_llegada ? "text-sm text-wedding-dark" : "text-sm text-wedding-dark/40"}>
                      {formData.hora_llegada 
                        ? llegadaOptions.find(opt => opt.value === formData.hora_llegada)?.label 
                        : "Selecciona una opción"
                      }
                    </span>
                    <svg 
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" 
                      className={`text-wedding-dark/50 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute w-full top-full left-0 mt-1 rounded-2xl border border-wedding-dark/20 bg-[#FAF8F3] shadow-sm overflow-hidden z-30"
                      >
                        {llegadaOptions.map((option) => (
                          <div 
                            key={option.value}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, hora_llegada: option.value }));
                              setIsDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-wedding-dark/5 transition-colors"
                          >
                            <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              formData.hora_llegada === option.value 
                                ? 'border-[#5C5F4B] bg-[#5C5F4B]' 
                                : 'border-wedding-dark/30'
                            }`}>
                              {formData.hora_llegada === option.value && (
                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                              )}
                            </div>
                            <span className="text-sm text-wedding-dark">{option.label}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Restricciones Alimenticias */}
                <div className={isDeclined ? 'opacity-40 pointer-events-none' : ''}>
                  <label htmlFor="restrictions" className="block text-sm font-medium text-wedding-dark mb-2">
                    Restricciones alimenticias
                  </label>
                  <input
                    type="text"
                    id="restrictions"
                    name="restrictions"
                    disabled={isDeclined}
                    value={formData.restrictions}
                    onChange={handleChange}
                    placeholder="Alergias, vegetariano, vegano, etc."
                    className="w-full bg-white/80 border border-wedding-dark/20 rounded-2xl px-4 py-3 text-sm text-wedding-dark placeholder:text-wedding-dark/40 focus:outline-none focus:border-[#5C5F4B] focus:ring-2 focus:ring-[#5C5F4B]/20 transition-colors"
                  />
                </div>

                {/* Mensaje */}
                <div className={isDeclined ? 'opacity-40 pointer-events-none' : ''}>
                  <label htmlFor="message" className="block text-sm font-medium text-wedding-dark mb-2">
                    Mensaje para los novios
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    disabled={isDeclined}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Escríbenos una felicitación o sugerencia musical"
                    className="w-full bg-white/80 border border-wedding-dark/20 rounded-2xl px-4 py-3 text-sm text-wedding-dark placeholder:text-wedding-dark/40 focus:outline-none focus:border-[#5C5F4B] focus:ring-2 focus:ring-[#5C5F4B]/20 transition-colors resize-none"
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
                    {isLoading ? 'Enviando...' : isDeclined ? 'Confirmar' : 'Confirmar asistencia'}
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
