import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "success" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-300",
    secondary: "border border-line bg-surface text-ink hover:bg-brand-50 disabled:text-ink-muted",
    ghost: "text-brand-700 hover:bg-brand-50 disabled:text-ink-muted",
    success: "bg-success-600 text-white hover:bg-success-700 disabled:bg-success-100",
    danger: "bg-danger-600 text-white hover:bg-danger-700 disabled:bg-danger-100"
};

const sizes: Record<Size, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base"
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", fullWidth = false) {
    return cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors",
        "disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        fullWidth && "w-full"
    );
}

type CommonProps = { variant?: Variant; size?: Size; fullWidth?: boolean };

export function Button({
    variant,
    size,
    fullWidth,
    className,
    type = "button",
    ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
    return <button type={type} className={cn(buttonClasses(variant, size, fullWidth), className)} {...props} />;
}

/** Un <Link> con aspecto de botón. */
export function LinkButton({
    variant,
    size,
    fullWidth,
    className,
    ...props
}: CommonProps & ComponentProps<typeof Link>) {
    return <Link className={cn(buttonClasses(variant, size, fullWidth), className)} {...props} />;
}
