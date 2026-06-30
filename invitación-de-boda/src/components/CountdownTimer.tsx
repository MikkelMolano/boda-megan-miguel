import { motion } from "motion/react";
import { useCountdown } from "../hooks/useCountdown";
import { WEDDING_CONFIG } from "../utils/weddingConfig";

export default function CountdownTimer() {
  const { days, hours, minutes, seconds, isOver } = useCountdown(WEDDING_CONFIG.date);

  const timeBlocks = [
    { label: "Días", value: days },
    { label: "Horas", value: hours },
    { label: "Minutos", value: minutes },
    { label: "Segundos", value: seconds }
  ];

  return (
    <section id="countdown" className="pt-16 pb-20 px-6 sm:pt-20 sm:pb-24 sm:px-8 bg-stone-50 border-y border-stone-200/50 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-xl text-center"
      >
        <h2 className="font-serif text-3xl sm:text-4xl text-[#22211D] text-center">
          Falta muy poco para<br />el gran día
        </h2>
        <div className="w-8 h-[1px] bg-stone-300 mx-auto my-6" />

        {isOver ? (
          <p className="font-serif text-2xl text-wedding-olive text-center">¡Hoy es el gran día!</p>
        ) : (
          <div className="flex w-full gap-2 sm:gap-3 justify-center">
            {timeBlocks.map((block, idx) => (
              <div key={idx} className="bg-wedding-light border border-wedding-sand rounded-2xl flex-1 max-w-[5rem] aspect-square flex flex-col items-center justify-center p-2 sm:p-3 gap-2.5">
                <span className="text-3xl sm:text-4xl font-serif text-wedding-dark leading-none">
                  {String(block.value).padStart(2, "0")}
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-wide text-wedding-olive">
                  {block.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
