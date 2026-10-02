import { useEffect, useRef, useState } from "react";

/**
 * Lightweight, zero-dependency typewriter phrase cycler hook.
 * @param {string[]} phrases - Array of phrases to cycle through
 * @param {Object} [options]
 * @param {number} [options.typingSpeed=70] - Delay per character typed (ms)
 * @param {number} [options.deletingSpeed=35] - Delay per character deleted (ms)
 * @param {number} [options.pauseDuration=2000] - Pause at full word before deleting (ms)
 * @param {boolean} [options.reducedMotion=false] - If true, immediately locks to the first phrase
 * @returns {string} The current displayed text
 */
export function useTypewriter(
  phrases,
  {
    typingSpeed = 70,
    deletingSpeed = 35,
    pauseDuration = 2000,
    reducedMotion = false,
  } = {}
) {
  const [displayedText, setDisplayedText] = useState(phrases[0] || "");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const phrasesRef = useRef(phrases);

  useEffect(() => {
    phrasesRef.current = phrases;
  }, [phrases]);

  useEffect(() => {
    if (reducedMotion || !phrasesRef.current.length) {
      setDisplayedText(phrasesRef.current[0] || "");
      return;
    }

    const currentList = phrasesRef.current;
    const currentPhrase = currentList[phraseIndex % currentList.length];

    if (!isDeleting && displayedText === currentPhrase) {
      const pauseTimer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    if (isDeleting && displayedText === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % currentList.length);
      return;
    }

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const typingTimer = setTimeout(() => {
      setDisplayedText((prev) => {
        if (isDeleting) {
          return currentPhrase.substring(0, prev.length - 1);
        }
        return currentPhrase.substring(0, prev.length + 1);
      });
    }, speed);

    return () => clearTimeout(typingTimer);
  }, [
    displayedText,
    isDeleting,
    phraseIndex,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    reducedMotion,
  ]);

  return displayedText;
}
