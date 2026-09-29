import type { TemplateProps } from "../types";
import { Stars, Watermark, initials, mapsHref, telHref } from "../shared";
import { ArrowIcon, CheckIcon, ClockIcon, PhoneIcon, PinIcon, ShieldIcon } from "../icons";

export function ModernTemplate({ business, copy, kit: { Reveal, Parallax }, watermark }: TemplateProps) {
  const tel = telHref(business.phone);

  return (
    <div className="sf-site ms">
      <header className="ms-header">
        <div className="ms-wrap ms-header-inner">
          <a href="#top" className="ms-brand">
            <span className="ms-mark" aria-hidden="true">
              {initials(business.name)}
            </span>
            <span>{business.name}</span>
          </a>
          <a href={tel} className="ms-button ms-button-sm">
            <PhoneIcon size={16} />
            <span className="ms-hide-sm">{business.phone}</span>
            <span className="ms-show-sm">Call</span>
          </a>
        </div>
      </header>

      <main id="top">
        <section className="ms-hero">
          <div className="ms-wrap ms-hero-grid">
            <div>
              {/* Trust first: proof sits above the headline. */}
              <Reveal className="ms-trustline">
                <span className="ms-trust-rating">
                  <Stars rating={business.rating} className="ms-stars" />
                  <strong>{business.rating.toFixed(1)}</strong>
                  <span>({business.reviewCount} reviews)</span>
                </span>
                {copy.highlights[0] ? <span className="ms-trust-pill">{copy.highlights[0].title}</span> : null}
              </Reveal>
              <Reveal delay={0.06}>
                <h1 className="ms-h1">{copy.headline}</h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="ms-lede">{copy.subheadline}</p>
              </Reveal>
              <Reveal delay={0.18} className="ms-hero-actions">
                <a href={tel} className="ms-button ms-button-lg">
                  <PhoneIcon size={18} />
                  Call {business.phone}
                </a>
                <a href="#contact" className="ms-button ms-button-lg ms-button-quiet">
                  {copy.cta.buttonLabel}
                  <ArrowIcon size={18} />
                </a>
              </Reveal>
            </div>

            <Parallax distance={32}>
              <Reveal delay={0.2} className="ms-card ms-status-card">
                <p className="ms-card-label">{copy.tagline}</p>
                <p className="ms-status-title">{copy.signature.name}</p>
                <p className="ms-muted">{copy.signature.description}</p>
                <ul className="ms-checks">
                  {copy.highlights.map((h) => (
                    <li key={h.title}>
                      <CheckIcon size={18} className="ms-check" />
                      <span>{h.title}</span>
                    </li>
                  ))}
                </ul>
                {business.hours ? (
                  <p className="ms-hours">
                    <ClockIcon size={16} />
                    {business.hours}
                  </p>
                ) : null}
              </Reveal>
            </Parallax>
          </div>
        </section>

        <section className="ms-highlights" aria-label="Why customers choose us">
          <div className="ms-wrap ms-highlight-grid">
            {copy.highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 0.06} className="ms-highlight">
                <ShieldIcon size={22} className="ms-accent" />
                <div>
                  <h2 className="ms-h4">{h.title}</h2>
                  <p className="ms-muted">{h.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="ms-section" aria-labelledby="ms-services">
          <div className="ms-wrap">
            <Reveal className="ms-section-head">
              <h2 id="ms-services" className="ms-h2">
                Services
              </h2>
              <p className="ms-muted">
                {business.category} services across {business.city} and nearby.
              </p>
            </Reveal>
            <ul className="ms-service-grid">
              {copy.services.map((s, i) => (
                <li key={s.name}>
                  <Reveal delay={i * 0.05} className="ms-card ms-service">
                    <h3 className="ms-h4">{s.name}</h3>
                    <p className="ms-muted">{s.description}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ms-section ms-section-tint" aria-labelledby="ms-reviews">
          <div className="ms-wrap">
            <Reveal className="ms-section-head">
              <h2 id="ms-reviews" className="ms-h2">
                Rated {business.rating.toFixed(1)} by {business.reviewCount} customers
              </h2>
            </Reveal>
            <div className="ms-review-grid">
              {copy.testimonials.map((t, i) => (
                <Reveal key={i} delay={i * 0.06} className="ms-card ms-review">
                  <Stars rating={5} className="ms-stars" />
                  <blockquote>{t.quote}</blockquote>
                  <p className="ms-review-author">{t.author}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="ms-section" aria-labelledby="ms-about">
          <div className="ms-wrap ms-about">
            <Reveal>
              <h2 id="ms-about" className="ms-h2">
                {copy.story.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="ms-about-body">
              {copy.story.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </Reveal>
          </div>
        </section>

        <section id="contact" className="ms-cta">
          <div className="ms-wrap ms-cta-grid">
            <Reveal>
              <h2 className="ms-h2 ms-h2-inverse">{copy.cta.heading}</h2>
              <p className="ms-cta-body">{copy.cta.body}</p>
              <a href={tel} className="ms-button ms-button-lg ms-button-inverse">
                <PhoneIcon size={18} />
                {copy.cta.buttonLabel}
              </a>
            </Reveal>
            <Reveal delay={0.08} className="ms-contact">
              <a href={tel} className="ms-contact-row">
                <PhoneIcon size={20} />
                <span>{business.phone}</span>
              </a>
              <a href={mapsHref(business)} target="_blank" rel="noreferrer" className="ms-contact-row">
                <PinIcon size={20} />
                <span>{business.address}</span>
              </a>
              {business.hours ? (
                <p className="ms-contact-row">
                  <ClockIcon size={20} />
                  <span>{business.hours}</span>
                </p>
              ) : null}
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="ms-footer">
        <div className="ms-wrap ms-footer-inner">
          <span>
            © {new Date().getFullYear()} {business.name}
          </span>
          <span>{business.category} · {business.city}</span>
        </div>
      </footer>

      {/* Tap-to-call is always one thumb away on phones. */}
      <div className="ms-callbar">
        <a href={tel} className="ms-button ms-button-lg ms-callbar-button">
          <PhoneIcon size={18} />
          Call now
        </a>
      </div>

      {watermark ? <Watermark /> : null}
    </div>
  );
}
