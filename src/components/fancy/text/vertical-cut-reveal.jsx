"use client";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

const VerticalCutReveal = forwardRef((
  {
    children,
    reverse = false,
    transition = {
      type: "spring",
      stiffness: 190,
      damping: 22,
    },
    splitBy = "words",
    staggerDuration = 0.2,
    staggerFrom = "first",
    containerClassName,
    wordLevelClassName,
    elementLevelClassName,
    onClick,
    onStart,
    onComplete,
    autoStart = true,
    ...props
  },
  ref
) => {
  const containerRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const isInView = useInView(containerRef, { once: true, amount: 0.3 })

  // helper function to split text into characters with support for unicode and emojis
  const splitIntoCharacters = (text) => {
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), ({ segment }) => segment);
    }
    return Array.from(text);
  };

  // Extract text and optional classNames from React children
  const parsedItems = useMemo(() => {
    const items = [];
    React.Children.forEach(children, (child) => {
      if (child === null || child === undefined) return;
      if (typeof child === "string" || typeof child === "number") {
        items.push({ text: String(child), className: "" });
      } else if (React.isValidElement(child)) {
        const innerText = typeof child.props.children === "string"
          ? child.props.children
          : String(child.props.children || "");
        items.push({
          text: innerText,
          className: child.props.className || "",
        });
      }
    });
    return items;
  }, [children]);

  const fullText = useMemo(() => {
    return parsedItems.map((i) => i.text).join("");
  }, [parsedItems]);

  // Split text based on splitBy parameter while preserving character styles
  const elements = useMemo(() => {
    let wordsResult = [];
    parsedItems.forEach((item) => {
      const words = item.text.split(" ");
      words.forEach((word, wordIdx) => {
        const chars = splitIntoCharacters(word).map((c) => ({
          char: c,
          className: item.className,
        }));

        if (wordsResult.length > 0 && wordIdx === 0 && !item.text.startsWith(" ")) {
          wordsResult[wordsResult.length - 1].characters.push(...chars);
          if (words.length > 1) {
            wordsResult[wordsResult.length - 1].needsSpace = true;
          }
        } else {
          wordsResult.push({
            characters: chars,
            needsSpace: wordIdx !== words.length - 1,
          });
        }
      });
    });
    return wordsResult;
  }, [parsedItems]);

  // Calculate stagger delays based on staggerFrom
  const getStaggerDelay = useCallback((index) => {
    const total =
      splitBy === "characters"
        ? elements.reduce((acc, word) =>
          acc + word.characters.length + (word.needsSpace ? 1 : 0), 0)
        : elements.length;
    if (staggerFrom === "first") return index * staggerDuration;
    if (staggerFrom === "last") return (total - 1 - index) * staggerDuration;
    if (staggerFrom === "center") {
      const center = Math.floor(total / 2);
      return Math.abs(center - index) * staggerDuration;
    }
    if (staggerFrom === "random") {
      const randomIndex = Math.floor(Math.random() * total);
      return Math.abs(randomIndex - index) * staggerDuration;
    }
    return Math.abs(staggerFrom - index) * staggerDuration;
  }, [elements, splitBy, staggerFrom, staggerDuration]);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    onStart?.();
  }, [onStart]);

  // Expose the startAnimation function via ref
  useImperativeHandle(ref, () => ({
    startAnimation,
    reset: () => setIsAnimating(false),
  }));

  // Auto start animation when in view
  useEffect(() => {
    if (autoStart && isInView) {
      startAnimation();
    }
  }, [autoStart, isInView, startAnimation]);

  const variants = {
    hidden: { y: reverse ? "-100%" : "100%" },
    visible: (i) => ({
      y: 0,
      transition: {
        ...transition,
        delay: ((transition?.delay) || 0) + getStaggerDelay(i),
      },
    }),
  };

  return (
    <span
      className={cn(
        containerClassName,
        "inline whitespace-pre-wrap",
        splitBy === "lines" && "flex-col"
      )}
      onClick={onClick}
      ref={containerRef}
      {...props}>
      <span className="sr-only">{fullText}</span>

      {elements.map((wordObj, wordIndex, array) => {
        const previousCharsCount = array
          .slice(0, wordIndex)
          .reduce((sum, word) => sum + word.characters.length, 0);

        return (
          <span
            key={wordIndex}
            aria-hidden="true"
            className={cn("inline-flex overflow-hidden", wordLevelClassName)}>
            {wordObj.characters.map((charObj, charIndex) => (
              <span
                className={cn(elementLevelClassName, "whitespace-pre-wrap relative", charObj.className)}
                key={charIndex}>
                <motion.span
                  custom={previousCharsCount + charIndex}
                  initial="hidden"
                  animate={isAnimating ? "visible" : "hidden"}
                  variants={variants}
                  onAnimationComplete={
                    wordIndex === elements.length - 1 &&
                      charIndex === wordObj.characters.length - 1
                      ? onComplete
                      : undefined
                  }
                  className="inline-block">
                  {charObj.char}
                </motion.span>
              </span>
            ))}
            {wordObj.needsSpace && <span> </span>}
          </span>
        );
      })}
    </span>
  );
});

VerticalCutReveal.displayName = "VerticalCutReveal";
export default VerticalCutReveal;

