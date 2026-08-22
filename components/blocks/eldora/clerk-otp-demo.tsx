import ClerkOTP from "@/components/blocks/eldora/clerk-otp"

export function ClerkOTPDemo() {
  return (
    <ClerkOTP
      delay={3500}
      cardTitle="Hover to Animate"
      cardDescription="Animation only triggers when hovering over the card. Random digits generated each time."
      whileHover={true} // Animation only on hover
    />
  )
}
