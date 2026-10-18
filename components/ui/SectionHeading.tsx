export function SectionHeading({
  index,
  eyebrow,
  title,
}: {
  index: string;
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="mb-10 md:mb-14">
      <p className="mb-4 text-[0.72rem] uppercase tracking-[0.18em] text-accent">
        {eyebrow ? `${index} — ${eyebrow}` : index}
      </p>
      <h2 className="font-display text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.92] text-ink">
        {title}
      </h2>
    </div>
  );
}
