import { Reveal } from "@/components/ui/Reveal";

/**
 * SectionHeading — the consistent eyebrow + title + lede block
 * that opens every homepage section.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <Reveal className="mb-12">
      <p className="mb-2 font-mono text-sm text-brand">
        <span aria-hidden="true">~/</span>
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {lede ? <p className="mt-3 max-w-2xl text-mute">{lede}</p> : null}
    </Reveal>
  );
}
