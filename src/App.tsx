import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { List, X, Globe, Check, CheckCircle, ArrowRight, ArrowUp, CaretDown, ChartPieSlice, Lightning, CreditCard, PiggyBank, UserPlus, ChartLine } from '@phosphor-icons/react'
import { I18nProvider, useI18n } from './i18n.tsx'
import type { Dict } from './i18n.tsx'
import Demo from './Demo.tsx'

const BENEFIT_ICONS = [ChartPieSlice, Lightning, CreditCard, PiggyBank]
const STEP_ICONS = [UserPlus, CreditCard, ChartLine]

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${visible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

function TaglineReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const words = text.split(' ')
  return (
    <p ref={ref} className="heading-2 mx-auto max-w-3xl text-center" aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`tagline-word ${visible ? 'on' : ''}`}
          style={{ transitionDelay: `${Math.min(i * 70, 1200)}ms` }}
        >
          {w}{' '}
        </span>
      ))}
    </p>
  )
}

function LangSwitcher() {
  const { lang, setLang, t } = useI18n()
  return (
    <div className="flex items-center gap-2 rounded-full border border-line bg-surface p-1" role="group" aria-label={t.nav.language}>
      <Globe size={16} aria-hidden="true" />
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={`button-sm rounded-full px-3 py-1 transition-colors duration-300 ${lang === 'en' ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('ar')}
        aria-pressed={lang === 'ar'}
        className={`button-sm rounded-full px-3 py-1 transition-colors duration-300 ${lang === 'ar' ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'}`}
      >
        عربي
      </button>
    </div>
  )
}

function Nav() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('top')
  const links = [
    { id: 'features', label: t.nav.features },
    { id: 'how', label: t.nav.how },
    { id: 'pricing', label: t.nav.pricing },
    { id: 'faq', label: t.nav.faq },
  ]
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">
        {t.nav.skip}
      </a>
      <header className="fixed inset-x-4 top-4 z-50 sm:inset-x-8">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border border-line bg-surface/90 px-4 py-2 shadow-lg backdrop-blur-md" aria-label="Main">
          <a href="#top" className="title-1 flex items-center gap-2 font-semibold" onClick={() => setActive('top')}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-ink caption-3" aria-hidden="true">
              {t.brand.initial}
            </span>
            {t.brand.name}
          </a>
          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  aria-current={active === l.id ? 'page' : undefined}
                  onClick={() => setActive(l.id)}
                  className={`title-3 transition-colors duration-300 hover:text-accent ${active === l.id ? 'text-accent' : 'text-muted'}`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden items-center gap-4 md:flex">
            <LangSwitcher />
            <a href="#signup" className="button-sm rounded-lg bg-accent px-3 py-2 text-accent-ink transition-opacity duration-300 hover:opacity-90">
              {t.nav.cta}
            </a>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-ink md:hidden"
            aria-expanded={open}
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} aria-hidden="true" /> : <List size={24} aria-hidden="true" />}
          </button>
        </nav>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-bg/95 pt-24 backdrop-blur-xl md:hidden" role="dialog" aria-modal="true" aria-label={t.nav.menu}>
          <ul className="flex flex-col gap-2 px-8">
            {links.map((l, i) => (
              <li
                key={l.id}
                className="reveal visible"
                style={{ transitionDelay: `${Math.min(i * 60, 400)}ms` }}
              >
                <a
                  href={`#${l.id}`}
                  className="heading-5 block rounded-xl px-4 py-4 hover:bg-surface"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-4 px-8">
            <LangSwitcher />
            <a
              href="#signup"
              className="button-md rounded-xl bg-accent px-3 py-2 text-center text-accent-ink"
              onClick={() => setOpen(false)}
            >
              {t.nav.cta}
            </a>
          </div>
        </div>
      )}
    </>
  )
}

function SignupForm({ t }: { t: Dict }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [done, setDone] = useState(false)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: { name?: string; email?: string } = {}
    if (!name.trim()) next.name = t.form.errorRequired
    if (!email.trim()) next.email = t.form.errorRequired
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t.form.errorEmail
    setErrors(next)
    if (Object.keys(next).length === 0) {
      try {
        localStorage.setItem('signup', JSON.stringify({ name: name.trim(), email: email.trim(), at: new Date().toISOString() }))
      } catch {
        /* storage unavailable */
      }
      setDone(true)
    }
  }
  if (done) {
    return (
      <div className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-8" role="status">
        <CheckCircle size={32} className="shrink-0 text-accent" aria-hidden="true" />
        <div>
          <p className="title-1 font-semibold">{t.form.successTitle}</p>
          <p className="body-3 text-muted">{t.form.success}</p>
        </div>
      </div>
    )
  }
  return (
    <form onSubmit={submit} noValidate className="rounded-2xl border border-line bg-surface p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="signup-name" className="body-4 mb-2 block">{t.form.name}</label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.form.namePlaceholder}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className="w-full rounded-lg border border-line bg-bg px-4 py-2 body-3 placeholder:text-muted"
          />
          {errors.name && <p id="name-error" className="caption-1 mt-2 text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="signup-email" className="body-4 mb-2 block">{t.form.email}</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.form.emailPlaceholder}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="w-full rounded-lg border border-line bg-bg px-4 py-2 body-3 placeholder:text-muted"
          />
          {errors.email && <p id="email-error" className="caption-1 mt-2 text-red-500">{errors.email}</p>}
        </div>
      </div>
      <button type="submit" className="button-md mt-8 w-full rounded-lg bg-accent px-3 py-2 text-accent-ink transition-opacity duration-300 hover:opacity-90 sm:w-auto">
        {t.form.submit}
      </button>
      <p className="caption-2 mt-4 text-muted">{t.form.privacy}</p>
    </form>
  )
}

function Faq({ t }: { t: Dict }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="mx-auto max-w-3xl">
      {t.faq.items.map((item, i) => (
        <div key={i} className="mb-4 overflow-hidden rounded-2xl border border-line bg-surface">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 px-8 py-4 text-start"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="title-2">{item.q}</span>
            <CaretDown size={20} aria-hidden="true" className={`shrink-0 transition-transform duration-500 ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && <p className="body-3 px-8 pb-8 text-muted">{item.a}</p>}
        </div>
      ))}
    </div>
  )
}

function LegalModal({ kind, onClose, t }: { kind: 'privacy' | 'terms' | null; onClose: () => void; t: Dict }) {
  if (!kind) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 sm:items-center" role="dialog" aria-modal="true" aria-label={kind === 'privacy' ? t.footer.privacy : t.footer.terms}>
      <div className="w-full max-w-xl rounded-2xl border border-line bg-surface p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="heading-5">{kind === 'privacy' ? t.footer.privacy : t.footer.terms}</h2>
          <button type="button" onClick={onClose} aria-label={t.nav.close} className="rounded-lg p-2 hover:bg-surface2">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <p className="body-3 text-muted">{kind === 'privacy' ? t.footer.privacyText : t.footer.termsText}</p>
        <button type="button" onClick={onClose} className="button-sm mt-8 rounded-lg bg-accent px-3 py-2 text-accent-ink">
          {t.misc.close}
        </button>
      </div>
    </div>
  )
}

function CookieBanner({ t }: { t: Dict }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    try {
      if (!localStorage.getItem('cookie-consent')) setShow(true)
    } catch {
      setShow(true)
    }
  }, [])
  if (!show) return null
  const choose = (v: string) => {
    try {
      localStorage.setItem('cookie-consent', v)
    } catch {
      /* storage unavailable */
    }
    setShow(false)
  }
  return (
    <div className="fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-line bg-surface p-8 shadow-xl sm:flex-row sm:items-center sm:justify-between" role="region" aria-label={t.cookie.label}>
      <p className="body-3 text-muted">{t.cookie.text}</p>
      <div className="flex shrink-0 gap-4">
        <button type="button" onClick={() => choose('declined')} className="button-sm rounded-lg border border-line px-3 py-2">
          {t.cookie.decline}
        </button>
        <button type="button" onClick={() => choose('accepted')} className="button-sm rounded-lg bg-accent px-3 py-2 text-accent-ink">
          {t.cookie.accept}
        </button>
      </div>
    </div>
  )
}

function Shell() {
  const { t } = useI18n()
  const [legal, setLegal] = useState<'privacy' | 'terms' | null>(null)
  return (
    <div id="top" className="min-h-screen bg-bg text-ink">
      <Nav />
      <main id="main">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-32 sm:px-8 sm:pt-40">
  <Reveal>
    <div className="mx-auto max-w-[680px] text-center">
      <p className="caption-3 inline-flex rounded-full border border-line bg-surface px-4 py-2 text-muted">{t.hero.badge}</p>
      <h1 className="heading-1 hero-grad mt-8">{t.hero.title}</h1>
      <p className="body-3 mx-auto mt-8 max-w-[680px] text-muted">{t.hero.subtitle}</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a href="#signup" className="button-md inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-accent-ink transition-opacity duration-300 hover:opacity-90">
          {t.hero.cta}
          <ArrowRight size={18} aria-hidden="true" />
        </a>
        <a href="#demo" className="button-md rounded-lg border border-line px-3 py-2 transition-colors duration-300 hover:bg-surface">
          {t.hero.secondary}
        </a>
      </div>
      <p className="caption-2 mt-8 text-muted">{t.hero.proof}</p>
    </div>
  </Reveal>
  <Reveal className="mt-16">
    <div id="demo" className="scroll-mt-32">
      <Demo d={t.demo} />
    </div>
  </Reveal>
</section>
        <section aria-label={t.logos.label} className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <Reveal>
            <p className="caption-3 text-center text-muted">{t.logos.label}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {t.logos.items.map((name) => (
                <span key={name} className="title-2 rounded-full border border-line bg-surface px-4 py-2 text-muted">{name}</span>
              ))}
            </div>
            <p className="caption-4 mt-4 text-center text-muted">{t.logos.note}</p>
          </Reveal>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <Reveal>
            <p className="caption-3 text-accent">{t.problem.eyebrow}</p>
            <h2 className="heading-3 mt-4 max-w-3xl">{t.problem.title}</h2>
            <p className="body-3 mt-4 max-w-3xl text-muted">{t.problem.text}</p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {t.problem.points.map((point) => (
                <li key={point} className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-8">
                  <CheckCircle size={24} className="shrink-0 text-accent" aria-hidden="true" />
                  <span className="body-2">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
        <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-8">
          <Reveal>
            <p className="caption-3 text-accent">{t.benefits.eyebrow}</p>
            <h2 className="heading-3 mt-4 max-w-3xl">{t.benefits.title}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {t.benefits.items.map((b, i) => {
                const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length]
                return (
                  <article key={b.title} className="rounded-2xl border border-line bg-surface p-8 transition-transform duration-500 hover:-translate-y-1">
                    <span className="mb-4 inline-flex rounded-xl bg-accent-soft p-4 text-accent" aria-hidden="true">
                      <Icon size={28} />
                    </span>
                    <h3 className="heading-6">{b.title}</h3>
                    <p className="body-3 mt-2 text-muted">{b.text}</p>
                  </article>
                )
              })}
            </div>
          </Reveal>
        </section>
        <section aria-label={t.misc.taglineLabel} className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
          <TaglineReveal text={t.tagline} />
        </section>
        <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-8">
          <Reveal>
            <p className="caption-3 text-accent">{t.how.eyebrow}</p>
            <h2 className="heading-3 mt-4 max-w-3xl">{t.how.title}</h2>
            <ol className="mt-8 grid gap-4 md:grid-cols-3">
              {t.how.steps.map((s, i) => {
                const Icon = STEP_ICONS[i % STEP_ICONS.length]
                return (
                  <li key={s.title} className="rounded-2xl border border-line bg-surface p-8">
                    <span className="caption-3 mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-ink" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="mb-4 ms-4 inline-flex rounded-xl bg-accent-soft p-4 text-accent align-middle" aria-hidden="true">
                      <Icon size={24} />
                    </span>
                    <h3 className="heading-6">{s.title}</h3>
                    <p className="body-3 mt-2 text-muted">{s.text}</p>
                  </li>
                )
              })}
            </ol>
          </Reveal>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <Reveal>
            <p className="caption-3 text-accent">{t.proof.eyebrow}</p>
            <h2 className="heading-3 mt-4 max-w-3xl">{t.proof.title}</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {t.proof.items.map((p) => (
                <figure key={p.name} className="flex flex-col rounded-2xl border border-line bg-surface p-8">
                  <span className="caption-3 mb-4 inline-flex w-fit rounded-full bg-accent-soft px-4 py-2 text-accent">{t.proof.label}</span>
                  <blockquote className="body-3 flex-1 text-muted">&ldquo;{p.quote}&rdquo;</blockquote>
                  <figcaption className="mt-8">
                    <p className="body-1">{p.name}</p>
                    <p className="caption-2 text-muted">{p.role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
        </section>
        <section id="pricing" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-8">
          <Reveal>
            <p className="caption-3 text-accent">{t.pricing.eyebrow}</p>
            <h2 className="heading-3 mt-4 max-w-3xl">{t.pricing.title}</h2>
            <p className="body-3 mt-4 max-w-3xl text-muted">{t.pricing.note}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {t.pricing.plans.map((plan) => (
                <article key={plan.name} className={`flex flex-col rounded-2xl border bg-surface p-8 ${plan.popular ? 'border-accent' : 'border-line'}`}>
                  {plan.popular && <span className="caption-3 mb-4 inline-flex w-fit rounded-full bg-accent px-4 py-2 text-accent-ink">{t.pricing.popular}</span>}
                  <h3 className="heading-5">{plan.name}</h3>
                  <p className="mt-4">
                    <span className="heading-3">{plan.price}</span>
                    <span className="caption-2 ms-2 text-muted">{plan.period}</span>
                  </p>
                  <ul className="mt-8 flex-1 space-y-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-4">
                        <Check size={18} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                        <span className="body-3">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#signup" className={`button-md mt-8 rounded-lg px-3 py-2 text-center transition-opacity duration-300 hover:opacity-90 ${plan.popular ? 'bg-accent text-accent-ink' : 'border border-line'}`}>
                    {plan.cta}
                  </a>
                </article>
              ))}
            </div>
          </Reveal>
        </section>
        <section id="faq" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-8">
          <Reveal>
            <p className="caption-3 text-center text-accent">{t.faq.eyebrow}</p>
            <h2 className="heading-3 mt-4 text-center">{t.faq.title}</h2>
            <div className="mt-8">
              <Faq t={t} />
            </div>
          </Reveal>
        </section>
        <section id="signup" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-8">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="heading-3">{t.final.title}</h2>
              <p className="body-3 mt-4 text-muted">{t.final.text}</p>
            </div>
            <div className="mx-auto mt-8 max-w-3xl">
              <SignupForm t={t} />
            </div>
          </Reveal>
        </section>
      </main>
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="title-1 flex items-center gap-2 font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-ink caption-3" aria-hidden="true">
                {t.brand.initial}
              </span>
              {t.brand.name}
            </p>
            <p className="body-3 mt-4 max-w-xs text-muted">{t.footer.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="space-y-4">
              <li>
                <button type="button" onClick={() => setLegal('privacy')} className="body-3 text-muted transition-colors duration-300 hover:text-ink">
                  {t.footer.privacy}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setLegal('terms')} className="body-3 text-muted transition-colors duration-300 hover:text-ink">
                  {t.footer.terms}
                </button>
              </li>
              <li>
                <a href="#top" className="body-3 inline-flex items-center gap-2 text-muted transition-colors duration-300 hover:text-ink">
                  {t.misc.backToTop}
                  <ArrowUp size={16} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <p className="caption-4 border-t border-line py-4 text-center text-muted">{t.footer.rights}</p>
      </footer>
      <LegalModal kind={legal} onClose={() => setLegal(null)} t={t} />
      <CookieBanner t={t} />
    </div>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <Shell />
    </I18nProvider>
  )
}
