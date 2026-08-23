/**
 * The catalogue entry shape, in its own module.
 *
 * catalog.tsx assembles the list from per-category entry files. Those files
 * need the type, and catalog.tsx imports them, so the type cannot live in
 * catalog.tsx without a cycle.
 */
export type CatalogEntry = {
  /** Stable handle used in the copied prompt. */
  code: string;
  category: string;
  label: string;
  /** Import path a build agent should use. */
  file: string;
  /** Exported component name. */
  component: string;
  /** One line on the props it expects, for the prompt. */
  props: string;
  /** Sticky chrome should not be re-stuck inside a preview column. */
  sticky?: boolean;
  /**
   * Floats over the section beneath it and consumes no layout height, so the
   * next section needs its own top clearance.
   */
  overlay?: boolean;
  /**
   * Opens with a full-bleed photo rather than padded text. An overlay nav can
   * sit straight on top of it, and adding clearance would insert a blank gap
   * for the bar to float over instead.
   */
  leadsWithMedia?: boolean;
  /**
   * Needs a full viewport of preview height. A left rail runs the height of
   * the screen, so a short preview box lets it spill past its own frame.
   */
  tallPreview?: boolean;
  /** Renders a whole page rather than a single section. */
  fullPage?: boolean;
  node: React.ReactNode;
};
