import type { TemplateProps } from "../types";
import { Stars, Watermark, initials, mapsHref, telHref } from "../shared";

export function LegacyTemplate({ business, copy, kit: { Reveal, Parallax }, watermark }: TemplateProps) {
  const est = business.yearEstablished;
  const sealText = `${est ? `Established ${est}` : business.category} · ${business.city} · `;

  return (
    <div className="sf-site lg">
      <header className="lg-header">
        <div className="lg-wrap lg-header-inner">
          <a href="#top" className="lg-wordmark">
            {business.name}
          </a>
          <nav className="lg-nav" aria-label="Sections">
            <a href="#story">Our story</a>
            <a href="#offering">What we do</a>
            <a href="#visit">Visit</a>
          </nav>
          <a href={telHref(business.phone)} className="lg-header-phone">
            {business.phone}
          </a>
        </div>
      </header>

      <main id="top">
        {/* Hook */}
        <section className="lg-hero">
          <div className="lg-wrap lg-hero-grid">
            <div>
              <Reveal>
                <p className="lg-eyebrow">{copy.tagline}</p>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="lg-h1">{copy.headline}</h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="lg-lede">{copy.subheadline}</p>
              </Reveal>
              <Reveal delay={0.24} className="lg-hero-actions">
                <a href="#visit" className="lg-button">
                  {copy.cta.buttonLabel}
                </a>
                <a href={telHref(business.phone)} className="lg-link">
                  or call {business.phone}
                </a>
              </Reveal>
            </div>
            <Parallax className="lg-seal-wrap" distance={48}>
              <svg className="lg-seal" viewBox="0 0 320 320" role="img" aria-label={`${business.name} seal`}>
                <defs>
                  <path id="lg-seal-circle" d="M160,160 m-118,0 a118,118 0 1,1 236,0 a118,118 0 1,1 -236,0" />
                </defs>
                <circle cx="160" cy="160" r="156" className="lg-seal-ring" />
                <circle cx="160" cy="160" r="96" className="lg-seal-core" />
                <text className="lg-seal-text">
                  <textPath href="#lg-seal-circle">{sealText.repeat(2)}</textPath>
                </text>
                <text x="160" y="178" textAnchor="middle" className="lg-seal-monogram">
                  {initials(business.name)}
                </text>
              </svg>
            </Parallax>
          </div>
        </section>

        {/* The hero product */}
        <section className="lg-signature">
          <div className="lg-wrap lg-signature-grid">
            <Reveal className="lg-signature-plate">
              <div className="lg-plate" aria-hidden="true">
                <span />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lg-eyebrow">The one people come back for</p>
              <h2 className="lg-h2">{copy.signature.name}</h2>
              <p className="lg-body">{copy.signature.description}</p>
            </Reveal>
          </div>
        </section>

        {/* Origin story */}
        <section id="story" className="lg-story">
          <div className="lg-wrap lg-story-grid">
            <Reveal>
              <p className="lg-eyebrow">Our story</p>
              <h2 className="lg-h2">{copy.story.heading}</h2>
            </Reveal>
            <div className="lg-story-body">
              {copy.story.paragraphs.map((paragraph, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className={i === 0 ? "lg-body lg-dropcap" : "lg-body"}>{paragraph}</p>
                </Reveal>
              ))}
              {est ? (
                <Reveal delay={0.2}>
                  <p className="lg-since">
                    Serving {business.city} since {est}
                  </p>
                </Reveal>
              ) : null}
            </div>
          </div>
        </section>

        {/* Proof */}
        <section className="lg-proof" aria-labelledby="lg-proof-heading">
          <div className="lg-wrap">
            <Reveal className="lg-proof-head">
              <h2 id="lg-proof-heading" className="lg-h2">
                What our neighbours say
              </h2>
              <p className="lg-rating">
                <Stars rating={business.rating} className="lg-stars" />
                <span>
                  {business.rating.toFixed(1)} from {business.reviewCount} reviews
                </span>
              </p>
            </Reveal>
            <div className="lg-quotes">
              {copy.testimonials.map((t, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <figure className="lg-quote">
                    <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                    <figcaption>{t.author}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Offering */}
        <section id="offering" className="lg-offering">
          <div className="lg-wrap lg-offering-grid">
            <Reveal>
              <p className="lg-eyebrow">What we do</p>
              <h2 className="lg-h2">Everything, done the way it always has been</h2>
              <ul className="lg-highlights">
                {copy.highlights.map((h) => (
                  <li key={h.title}>
                    <strong>{h.title}</strong>
                    <span>{h.detail}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <ul className="lg-menu">
              {copy.services.map((service, i) => (
                <li key={service.name} className="lg-menu-item">
                  <Reveal delay={i * 0.06}>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Low-friction CTA */}
        <section id="visit" className="lg-visit">
          <div className="lg-wrap lg-visit-inner">
            <Reveal>
              <h2 className="lg-h2 lg-h2-light">{copy.cta.heading}</h2>
              <p className="lg-visit-body">{copy.cta.body}</p>
            </Reveal>
            <Reveal delay={0.1} className="lg-visit-details">
              <dl>
                <div>
                  <dt>Find us</dt>
                  <dd>
                    <a href={mapsHref(business)} target="_blank" rel="noreferrer">
                      {business.address}
                    </a>
                  </dd>
                </div>
                {business.hours ? (
                  <div>
                    <dt>Hours</dt>
                    <dd>{business.hours}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Call</dt>
                  <dd>
                    <a href={telHref(business.phone)}>{business.phone}</a>
                  </dd>
                </div>
              </dl>
              <a href={telHref(business.phone)} className="lg-button lg-button-light">
                {copy.cta.buttonLabel}
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="lg-footer">
        <div className="lg-wrap lg-footer-inner">
          <span>
            © {new Date().getFullYear()} {business.name}
          </span>
          <span>{business.address}</span>
        </div>
      </footer>

      {watermark ? <Watermark /> : null}
    </div>
  );
}
