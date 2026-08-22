import { FadeText } from "@/components/blocks/eldora/fade-text"

export default function FadeTextDemo3() {
  return (
    <FadeText
      text="Gracefully descending"
      direction="down"
      staggerDelay={0.3}
    />
  )
}
