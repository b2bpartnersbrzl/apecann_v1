"use client";

import { useEffect, useState } from "react";

const scenes = [
  "/images/pesquisa.webp",
  "/images/acolhimento.webp",
  "/images/bem-estar.webp",
];

export default function Home() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % scenes.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="teaser">
      <div className="backdrop" aria-hidden="true">
        {scenes.map((src, index) => (
          <div
            key={src}
            className={`scene ${active === index ? "scene-active" : ""}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      <div className="veil" aria-hidden="true" />
      <h1 className="brand"><img src="/apecann-logo.svg" alt="APECANN" /></h1>
      <p className="status">Página em desenvolvimento.</p>
    </main>
  );
}
