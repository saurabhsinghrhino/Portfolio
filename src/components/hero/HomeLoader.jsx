import { useEffect, useState } from "react";

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete?.();
          return 100;
        }
        return prev + 1;
      });
    }, 25); // 25ms × 100 = ~2.5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center overflow-x-hidden bg-[#050505]">
      <h1 className="mb-6 text-6xl font-Anton text-white">{progress}%</h1>

      <p className="text-lg tracking-[0.35em] uppercase text-gray-400">
        Portfolio Is Loading
      </p>

      <div className="mt-10 h-0.5 w-80 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-white transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
