import Link from "next/link";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
    href?: string;
    showTagline?: boolean;
    size?: "sm" | "md";
    variant?: "default" | "sidebar";
    className?: string;
};

export const BrandMark = ({
    href,
    showTagline = false,
    size = "md",
    variant = "default",
    className,
}: BrandMarkProps) => {
    const content = (
        <div
            className={cn(
                "flex min-w-0 items-center gap-2.5",
                href && "transition-opacity hover:opacity-80",
                className
            )}>
            <Logo
                className={cn(
                    size === "sm" ? "size-6" : "size-7 sm:size-8"
                )}
            />
            <div className="min-w-0">
                <p
                    className={cn(
                        "font-semibold tracking-tight transition-none",
                        size === "sm" ? "text-sm" : "text-base",
                        variant === "sidebar"
                            ? "text-sidebar-foreground"
                            : "text-stone-900 dark:text-zinc-50"
                    )}>
                    smart-track
                </p>
                {showTagline ? (
                    <p className="text-xs text-muted-foreground transition-none">
                        Academic productivity
                    </p>
                ) : null}
            </div>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="inline-flex min-w-0">
                {content}
            </Link>
        );
    }

    return content;
};
