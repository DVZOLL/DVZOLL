import { useEffect, useState, useCallback } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export const useKonamiCode = () => {
  const [activated, setActivated] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);

  const reset = useCallback(() => {
    setActivated(false);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setSequence((prev) => {
        const next = [...prev, e.key].slice(-KONAMI.length);
        if (next.length === KONAMI.length && next.every((k, i) => k === KONAMI[i])) {
          setActivated(true);
          return [];
        }
        return next;
      });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return { activated, reset };
};
