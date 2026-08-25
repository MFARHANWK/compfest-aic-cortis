"use client";

import { useEffect, useState } from "react";
import { checkHealth } from "@/lib/api";

export default function Header() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const ok = await checkHealth();
      if (!cancelled) setOnline(ok);
    }

    poll();
    const id = setInterval(poll, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <div>
          <p className="font-data text-[11px] tracking-[0.2em] text-cream-dim uppercase">
            COMPFEST 18 · AI Innovation Challenge
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
            JARPIS
          </h1>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-hairline bg-panel px-3 py-1.5">
          <span
            className={`h-2 w-2 rounded-full transition-colors ${
              online === null
                ? "bg-cream-dim"
                : online
                  ? "bg-ok"
                  : "bg-flaw"
            }`}
          />
          <span className="font-data text-[11px] text-cream-dim">
            {online === null ? "checking" : online ? "backend online" : "backend offline"}
          </span>
        </div>
      </div>
    </header>
  );
}
