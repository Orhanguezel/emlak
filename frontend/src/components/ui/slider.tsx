"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "./utils";

/** Dışarıya açık tip: opsiyonel ve | undefined’lı */
export type SliderProps = Omit<
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  "value" | "defaultValue"
> & {
  value?: number[] | undefined;
  defaultValue?: number[] | undefined;
  min?: number;
  max?: number;
};

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(function Slider(
  { className, value, defaultValue, min = 0, max = 100, ...rest },
  ref
) {
  // value/defaultValue yoksa props’u hiç göndermeyelim (exactOptionalPropertyTypes uyumu)
  type RootProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;
  const controlled: Partial<Pick<RootProps, "value">> = {};
  const uncontrolled: Partial<Pick<RootProps, "defaultValue">> = {};
  if (value !== undefined) controlled.value = value;
  if (defaultValue !== undefined) uncontrolled.defaultValue = defaultValue;

  const thumbs = React.useMemo(() => {
    if (Array.isArray(value)) return Math.max(1, value.length);
    if (Array.isArray(defaultValue)) return Math.max(1, defaultValue.length);
    return 1;
  }, [value, defaultValue]);

  return (
    <SliderPrimitive.Root
      ref={ref}
      data-slot="slider"
      min={min}
      max={max}
      className={cn(
        "relative flex w-full select-none touch-none items-center data-disabled:opacity-50",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:w-auto data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44",
        className
      )}
      {...controlled}
      {...uncontrolled}
      {...rest}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full bg-muted",
          "data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute bg-primary",
            "data-[orientation=horizontal]:h-full",
            "data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>

      {Array.from({ length: thumbs }).map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          data-slot="slider-thumb"
          className={cn(
            "block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm",
            "ring-ring/50 transition-shadow hover:ring-4 focus-visible:ring-4",
            "focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
});

Slider.displayName = "Slider";

export { Slider };
