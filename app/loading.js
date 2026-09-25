export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full text-gray-900 bg-[#faf7f5]">
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <div className="w-24 h-24 border-4 border-[#9d363d]/20 border-t-[#9d363d] rounded-full animate-spin"></div>

        {/* Inner static N */}
        <div className="absolute text-[#9d363d] font-serif text-2xl font-bold italic tracking-widest animate-pulse">
          N
        </div>
      </div>
      <p className="mt-6 text-[#9d363d] font-serif tracking-widest uppercase text-sm animate-pulse">
        Loading...
      </p>
    </div>
  );
}
