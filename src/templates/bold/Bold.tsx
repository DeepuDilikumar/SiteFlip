import type { TemplateProps } from "../types";
import { Stars, Watermark, mapsHref, telHref } from "../shared";
import { ArrowIcon } from "../icons";

export function BoldTemplate({ business, copy, kit: { Reveal, Parallax }, watermark }: TemplateProps) {
  const [featured, ...moreQuotes] = copy.testimonials;

  return (
    <div className="sf-site bd">
      <header className="bd-header">
        <div className="bd-wrap bd-header-inner">
          <a href="#top" className="bd-wordmark">
            {business.name}
          </a>
          <nav className="bd-nav" aria-label="Sections">
            <a href="#offer">What we do</a>
            <a href="#about">About</a>
            <a href="#visit" className="bd-nav-cta">
              Visit
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="bd-hero">
          <div className="bd-wrap bd-hero-grid">
            <div className="bd-hero-copy">
              <Reveal>
                <p className="bd-kicker">{copy.tagline}</p>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="bd-h1">{copy.headline}</h1>
              </Reveal>
              <Reveal delay={0.16} className="bd-hero-foot">
                <p className="bd-lede">{copy.subheadline}</p>
                <a href="#visit" className="bd-button">
                  {copy.cta.buttonLabel}
                  <ArrowIcon size={18} />
                </a>
              </Reveal>
            </div>
            <Parallax className="bd-art" distance={64}>
              <div className="bd-art-inner" aria-hidden="true">
                <span className="bd-shape bd-shape-sun" />
                <span className="bd-shape bd-shape-arch" />
                <span className="bd-shape bd-shape-dot" />
                <span className="bd-sticker">{copy.signature.name}</span>
              </div>
            </Parallax>
          </div>
        </section>

        <section className="bd-band" aria-label="What we offer">
          <p className="bd-band-text">
            {copy.services.map((s) => (
              <span key={s.name}>{s.name}</span>
            ))}
          </p>
        </section>

        <section className="bd-signature">
          <div className="bd-wrap bd-signature-grid">
            <Reveal>
              <p className="bd-kicker">The signature</p>
              <h2 className="bd-h2">{copy.signature.name}</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="bd-body-lg">{copy.signature.description}</p>
            </Reveal>
          </div>
        </section>

        <section id="offer" className="bd-section" aria-labelledby="bd-offer-heading">
          <div className="bd-wrap">
            <Reveal>
              <h2 id="bd-offer-heading" className="bd-h2">
                What we do
              </h2>
            </Reveal>
            <ol className="bd-list">
              {copy.services.map((s, i) => (
                <li key={s.name} className="bd-list-item">
                  <Reveal delay={i * 0.05} className="bd-list-row">
                    <span className="bd-index">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="bd-h3">{s.name}</h3>
                    <p className="bd-muted">{s.description}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="about" className="bd-section bd-about">
          <div className="bd-wrap bd-about-grid">
            <Reveal>
              <h2 className="bd-h2">{copy.story.heading}</h2>
            </Reveal>
            <div className="bd-about-body">
              {copy.story.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className="bd-body">{p}</p>
                </Reveal>
              ))}
              <Reveal delay={0.16} className="bd-facts">
                {copy.highlights.map((h) => (
                  <div key={h.title}>
                    <p className="bd-fact-title">{h.title}</p>
                    <p className="bd-muted">{h.detail}</p>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {featured ? (
          <section className="bd-section bd-quotes" aria-label="Reviews">
            <div className="bd-wrap">
              <Reveal>
                <p className="bd-rating">
                  <Stars rating={business.rating} />
                  {business.rating.toFixed(1)} · {business.reviewCount} reviews
                </p>
                <figure className="bd-feature-quote">
                  <blockquote>&ldquo;{featured.quote}&rdquo;</blockquote>
                  <figcaption>{featured.author}</figcaption>
                </figure>
              </Reveal>
              {moreQuotes.length ? (
                <div className="bd-more-quotes">
                  {moreQuotes.map((t, i) => (
                    <Reveal key={i} delay={i * 0.06}>
                      <figure>
                        <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                        <figcaption>{t.author}</figcaption>
                      </figure>
                    </Reveal>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        <section id="visit" className="bd-visit">
          <div className="bd-wrap">
            <Reveal>
              <h2 className="bd-visit-heading">{copy.cta.heading}</h2>
            </Reveal>
            <Reveal delay={0.08} className="bd-visit-grid">
              <p className="bd-visit-body">{copy.cta.body}</p>
              <dl className="bd-visit-details">
                <div>
                  <dt>Address</dt>
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
                  <dt>Phone</dt>
                  <dd>
                    <a href={telHref(business.phone)}>{business.phone}</a>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="bd-footer">
        <div className="bd-wrap bd-footer-inner">
          <span className="bd-footer-name">{business.name}</span>
          <span>
            © {new Date().getFullYear()} · {business.city}
          </span>
        </div>
      </footer>

      {watermark ? <Watermark /> : null}
    </div>
  );
}
