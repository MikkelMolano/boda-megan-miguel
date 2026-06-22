export default function Footer() {
  return (
    <footer className="w-full py-5 px-6 text-center bg-transparent relative z-10">
      <div 
        className="h-[1px] w-full mx-auto rounded-full mb-3 mt-0" 
        style={{ backgroundColor: '#5C5F4B' }}
      ></div>
      <p 
        className="text-xs text-center font-normal"
        style={{ color: '#5E6436' }}
      >
        Desarrollado con amor 💜 | © 2026 MAM
      </p>
    </footer>
  );
}
