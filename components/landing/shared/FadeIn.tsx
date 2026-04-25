type Props = {
  className?: string
  delay?: number
  children: React.ReactNode
}

/**
 * Lightweight FadeIn wrapper — no animation library needed.
 * On this branch we just render children directly; animation can be added later.
 * The `delay` prop is accepted but ignored (was used by framer-motion on main).
 */
export function FadeIn({ className, children }: Props) {
  return <div className={className}>{children}</div>
}
