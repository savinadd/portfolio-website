type SectionHeadingProps = {
  title: string;
};

export function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <h2 className="website-section-heading">{title}</h2>
  );
}
