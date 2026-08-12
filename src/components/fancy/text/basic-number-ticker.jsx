"use client";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import { animate } from "motion/react";
import { cn } from "@/lib/utils";

const NumberTicker = forwardRef((
  {
    from = 0,
    target = 100,
    transition = {
      duration: 3,
      type: "tween",
      ease: "easeInOut",
    },
    className,
    onStart,
    onComplete,
    autoStart = true,
    ...props
  },
  ref
) => {
  const numericFrom = Number(from) || 0;
  const numericTarget = Number(target) || 0;
  const [displayValue, setDisplayValue] = useState(numericFrom);
  const controlsRef = useRef(null);

  const startAnimation = useCallback(() => {
    if (controlsRef.current) controlsRef.current.stop();
    onStart?.();

    setDisplayValue(numericFrom);

    controlsRef.current = animate(numericFrom, numericTarget, {
      ...transition,
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
      onComplete: () => {
        onComplete?.();
      },
    });
  }, [numericFrom, numericTarget, transition, onStart, onComplete]);

  useImperativeHandle(ref, () => ({
    startAnimation,
  }));

  useEffect(() => {
    if (autoStart) {
      startAnimation();
    }
    return () => {
      if (controlsRef.current) controlsRef.current.stop();
    };
  }, [autoStart, startAnimation]);

  return (
    <span className={cn(className)} {...props}>
      {displayValue}
    </span>
  );
});

NumberTicker.displayName = "NumberTicker";

export default NumberTicker;