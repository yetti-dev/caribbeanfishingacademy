import { FontWeightText } from "@/components/blocks/eldora/font-weight-text"

export function FontWeightTextDemo() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <FontWeightText
        text="Get Started"
        fontSize={60}
        className="text-cyan-200"
      />
    </div>
  )
}
