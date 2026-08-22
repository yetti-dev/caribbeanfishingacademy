import * as Lucide from "lucide-react";
import { Circle, type LucideProps } from "lucide-react";

/**
 * Resolve a lucide icon by name so copy in content/*.ts can say `icon: "Anchor"`
 * without importing components. Falls back to Circle rather than crashing a page
 * because a content file has a typo.
 */
export function Icon({ name, ...props }: { name?: string } & LucideProps) {
  const map = Lucide as unknown as Record<string, React.ComponentType<LucideProps>>;
  const Cmp = (name && map[name]) || Circle;
  return <Cmp aria-hidden {...props} />;
}
