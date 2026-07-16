/**
 * src/lib/motion.ts — the site's motion signature.
 *
 * One entrance curve everywhere: a fast attack that settles gently,
 * so elements feel placed rather than dropped. Import this instead
 * of hand-rolling cubic-beziers per component — entrance motion
 * reading identically across Hero, dock, modals, and Reveal is what
 * makes the choreography feel intentional.
 */
export const EASE_OUT: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];
