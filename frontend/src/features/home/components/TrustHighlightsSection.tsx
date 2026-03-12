import type { TrustHighlight } from '../types'

type TrustHighlightsSectionProps = {
  items: TrustHighlight[]
}

function TrustHighlightsSection({ items }: TrustHighlightsSectionProps) {
  return (
    <section className="home-trust-strip reveal-up" aria-label="Cam kết dịch vụ Homelyy">
      {items.map((item) => (
        <article key={item.id} className="home-trust-item">
          <p className="home-trust-badge">{item.badge}</p>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </article>
      ))}
    </section>
  )
}

export default TrustHighlightsSection
