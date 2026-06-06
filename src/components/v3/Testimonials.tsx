/**
 * Testimonials section.
 *
 * TODO(josh): these are PLACEHOLDER quotes so the section can ship now. Replace
 * the `testimonials` array with real client quotes, then set SAMPLE = false to
 * drop the "sample" badge. Until then the badge keeps this honest for visitors.
 */

const SAMPLE = true

type Testimonial = { quote: string; name: string; role: string }

const testimonials: Testimonial[] = [
  {
    quote:
      "Josh took the pile of spreadsheets we were drowning in and turned it into one dashboard the whole team actually uses. He shipped faster than anyone else we talked to.",
    name: 'Placeholder name',
    role: 'Operations lead · sample',
  },
  {
    quote:
      "Our new site finally looks like the business we are. Bookings are up and I've stopped answering the same questions over email all day.",
    name: 'Placeholder name',
    role: 'Service-business owner · sample',
  },
  {
    quote:
      "He explained everything in plain English, answered every email himself, and the thing just works. Felt like having a developer on the team without the headcount.",
    name: 'Placeholder name',
    role: 'Shop owner · sample',
  },
]

export function Testimonials() {
  return (
    <section className="bg-[var(--bg)] py-20 border-t border-[var(--line)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="font-mono text-[11px] text-[var(--ink-dim)] tracking-[0.06em] mb-2.5 flex items-center gap-2">
          <span className="block w-6 h-px bg-[var(--accent)] opacity-60" aria-hidden />
          <span className="text-[var(--accent)]">// what clients say</span>
        </div>

        <div className="flex items-end justify-between flex-wrap gap-3">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--heading)] tracking-[-0.02em]">
            Don&apos;t just take my word for it.
          </h2>
          {SAMPLE && (
            <span
              className="font-mono text-[11px] px-2.5 py-[3px] rounded-full text-[var(--ink-dim)]"
              style={{ border: '1px dashed var(--line-soft)', background: 'var(--surface)' }}
            >
              sample · real quotes coming soon
            </span>
          )}
        </div>

        <div className="mt-9 grid md:grid-cols-3 gap-[18px]">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="m-0 rounded-xl border border-[var(--line)] bg-[var(--bg-card)] p-6 flex flex-col"
            >
              <span className="font-mono text-[22px] leading-none text-[var(--accent)]" aria-hidden>&ldquo;</span>
              <blockquote className="mt-2 text-[15.5px] leading-[1.6] text-[var(--ink)] flex-1">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 pt-4 border-t border-dashed border-[var(--line)]">
                <div className="font-sans font-semibold text-[14.5px] text-[var(--heading)]">{t.name}</div>
                <div className="font-mono text-[12px] text-[var(--ink-dim)] mt-0.5">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
