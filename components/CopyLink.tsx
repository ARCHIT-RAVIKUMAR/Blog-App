"use client";

import { useState } from "react";

export default function CopyLink() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable, ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-subtle"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
        <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
      </svg>
      <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
    </button>
  );
}
