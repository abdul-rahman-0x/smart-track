import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex shrink-0 items-center justify-center gap-2 font-sans font-normal tracking-[-0.02em] whitespace-nowrap transition-colors duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                // 1. Casca Dark Primary Action (e.g. Header "Request a call", Workspace Actions)
                default:
                    "rounded-[7.4px] border border-white/[0.08] bg-[#20201f] text-[#f9f8f6] hover:bg-[#2a2a29] active:bg-[#1a1a19]",

                // 2. Casca Neutral Secondary (e.g. Hero "Get started")
                secondary:
                    "rounded-[7.4px] border-0 bg-[#e5e5e5] text-[#0e0d0c] hover:bg-[#d8d8d8] active:bg-[#cecece]",

                // 3. Casca Bone White High-Contrast (e.g. "Request a demo")
                white:
                    "rounded-[7.4px] border-0 bg-[#f9f8f6] text-[#0e0d0c] hover:bg-white active:bg-[#e8e7e5]",

                // 4. Casca Hairline Outline
                outline:
                    "rounded-[7.4px] border border-white/10 bg-transparent text-[#f9f8f6] hover:bg-[#161616] hover:border-white/20 active:bg-[#1f1f1e]",

                // 5. Casca Ghost Action
                ghost:
                    "rounded-[7.4px] border-0 bg-transparent text-[#f9f8f6]/60 hover:bg-[#161616] hover:text-[#f9f8f6] active:bg-[#20201f]",

                // 6. System Destructive
                destructive:
                    "rounded-[7.4px] border border-[#b42318]/30 bg-[#b42318]/15 text-[#f9f8f6] hover:bg-[#b42318]/25 active:bg-[#b42318]/35",

                link: "text-[#f9f8f6] underline-offset-4 hover:underline",
            },
            size: {
                // Casca Standard Body Button (14.8px font, 11.1px x 14.8px padding)
                default: "h-auto px-[14.8px] py-[11.1px] text-[14.8px] leading-[1.2]",

                // Casca Nav / Compact Button (13px font, 7.4px x 11.1px padding, 32px height)
                sm: "h-[32px] px-[11.1px] py-[7.4px] text-[16px] leading-[1.2]",

                // Elevated Hero Button
                lg: "h-auto px-5 py-3 text-[15.5px] leading-[1.2]",

                // Square Icons with Casca radius
                icon: "h-9 w-9 p-0 rounded-[7.4px]",
                "icon-sm": "h-8 w-8 p-0 rounded-[7.4px]",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

interface ButtonProps
    extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot.Root : "button";

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
