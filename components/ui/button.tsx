import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-[7.4px] font-sans font-medium tracking-[-0.02em] whitespace-nowrap transition-all duration-150 select-none outline-none focus-visible:ring-1 focus-visible:ring-[#F9F8F6]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0D0C] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                // 1. Casca Dark Elevated Surface (Default workspace action)
                default:
                    "border border-[#F9F8F6]/[0.08] bg-[#20201F] text-[#F9F8F6] hover:bg-[#2A2A29] active:bg-[#1A1A19]",

                // 2. Casca High-Contrast Bone White (Primary conversion action)
                primary:
                    "border-0 bg-[#F9F8F6] text-[#0E0D0C] hover:bg-[#E5E5E5] active:bg-[#D4D3D0]",

                white:
                    "border-0 bg-[#F9F8F6] text-[#0E0D0C] hover:bg-[#E5E5E5] active:bg-[#D4D3D0]",

                // 3. Casca Neutral / Secondary Action
                secondary:
                    "border border-[#F9F8F6]/[0.08] bg-[#161616] text-[#F9F8F6] hover:bg-[#20201F] active:bg-[#1A1A19]",

                // 4. Hairline Outline
                outline:
                    "border border-[#F9F8F6]/15 bg-transparent text-[#F9F8F6] hover:bg-[#161616] hover:border-[#F9F8F6]/25 active:bg-[#20201F]",

                // 5. Ghost Action
                ghost:
                    "border-0 bg-transparent text-[#F9F8F6]/60 hover:bg-[#161616] hover:text-[#F9F8F6] active:bg-[#20201F]",

                // 6. System Destructive
                destructive:
                    "border border-[#B42318]/30 bg-[#B42318]/15 text-[#F9F8F6] hover:bg-[#B42318]/25 active:bg-[#B42318]/35",

                // 7. Inline Link
                link: "text-[#F9F8F6] underline-offset-4 hover:underline p-0 h-auto",
            },
            size: {
                // Standard Body Button (~38px height)
                default: "h-[38px] px-3.5 py-2 text-[14px] leading-none",

                // Compact Action (~32px height)
                sm: "h-[32px] px-2.5 py-1.5 text-[12.5px] leading-none",

                // Prominent / Hero Action (~44px height)
                lg: "h-[44px] px-5 py-3 text-[15px] leading-none font-medium",

                // Icon Buttons
                icon: "size-9 p-0",
                "icon-sm": "size-8 p-0",
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                ref={ref}
                data-slot="button"
                className={cn(buttonVariants({ variant, size, className }))}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
