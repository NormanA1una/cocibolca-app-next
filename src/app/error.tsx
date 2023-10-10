"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="text-center h-[calc(100vh-64px)] flex items-center justify-center">
      <section className="flex flex-col gap-8 dark:text-[#FFFF]">
        <div className="text-7xl">😵‍💫</div>
        <p className="text-3xl font-bold">¡Algo salió mal!</p>
        <div>
          <button
            className=" bg-[#AF503B] p-2 rounded-md text-[#fefefe] hover:bg-[#493326] dark:bg-[#5C77EC] dark:hover:bg-[#0D1321]"
            onClick={() => reset()}
          >
            ¡Intenta nuevamente!
          </button>
        </div>
      </section>
    </main>
  );
}
