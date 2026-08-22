import AnimatedBadge from "@/components/blocks/eldora/animated-badge"

export function AnimatedBadgeDemo() {
  return (
    <div className="relative" suppressHydrationWarning>
      <AnimatedBadge
        text="Introducing Eldora ui"
        color="#22d3ee"
        href="/docs/components/animated-badge"
      />
    </div>
  )
}
