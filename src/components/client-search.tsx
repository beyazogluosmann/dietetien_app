"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { fieldClass } from "@/components/ui";

export function ClientSearch({ query }: { query: string }) {
  const router = useRouter();
  const [value, setValue] = useState(query);
  const [, startTransition] = useTransition();

  function search(next: string) {
    setValue(next);
    const href = next.trim() ? `/dietitian?q=${encodeURIComponent(next)}` : "/dietitian";
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <input
        value={value}
        placeholder="Ada göre ara"
        className={`${fieldClass} max-w-xs`}
        onChange={(event) => search(event.target.value)}
      />
      {value ? (
        <button
          type="button"
          onClick={() => search("")}
          className="text-sm text-[#6b6b66] hover:text-[#1c1c1a]"
        >
          Temizle
        </button>
      ) : null}
    </div>
  );
}
