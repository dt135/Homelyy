type SectionHeadingProps = {
  eyebrow: string
  title: string
  description: string
}

function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <header className="home-section-heading reveal-up">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  )
}

export default SectionHeading
