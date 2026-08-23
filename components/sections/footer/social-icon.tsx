import { FacebookIcon, GitHubIcon, InstagramIcon, WhatsAppIcon, XIcon } from "@/components/icons";
import { Icon } from "@/components/sections/icon";
import { cn } from "@/lib/utils";

/**
 * Social glyph resolver for the footer blocks. Lucide dropped the brand marks,
 * so Instagram, Facebook, X, GitHub, WhatsApp and YouTube come from inline SVGs
 * and everything else falls through to the lucide name in the data.
 */
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn("size-4", className)}>
      <path d="M23.5 6.9a3.02 3.02 0 0 0-2.12-2.14C19.5 4.25 12 4.25 12 4.25s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.9C0 8.79 0 12 0 12s0 3.21.5 5.1a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14c.5-1.89.5-5.1.5-5.1s0-3.21-.5-5.1M9.55 15.57V8.43L15.82 12z" />
    </svg>
  );
}

const GLYPHS: Record<string, (p: { className?: string }) => React.ReactElement> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  x: XIcon,
  twitter: XIcon,
  github: GitHubIcon,
  whatsapp: WhatsAppIcon,
};

export function SocialIcon({ name, label, className }: { name?: string; label?: string; className?: string }) {
  const Glyph = GLYPHS[(name ?? label ?? "").toLowerCase()];
  if (Glyph) return <Glyph className={className} />;
  return <Icon name={name} className={className} />;
}
