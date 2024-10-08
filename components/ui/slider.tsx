"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

interface MyEventTarget extends EventTarget {
    role: string | null;
}

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
    const [disabled, setDisabled] = React.useState<boolean>(true);

    function handlePointerDown(ev: React.PointerEvent<HTMLDivElement>) {
        const element = ev.target as MyEventTarget;
        setDisabled(element.role === "slider" ? false : true);
    }

    return (
        <SliderPrimitive.Root
            onPointerDown={(ev) => handlePointerDown(ev)}
            onPointerUp={() => setDisabled(true)}
            ref={ref}
            disabled={disabled}
            className={cn(
                "relative flex w-full touch-none select-none items-center",
                className
            )}
            {...props}
        >
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
                <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="block cursor-pointer h-5 w-5 rounded-[999px] border-2 border-primary bg-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
        </SliderPrimitive.Root>
    );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
