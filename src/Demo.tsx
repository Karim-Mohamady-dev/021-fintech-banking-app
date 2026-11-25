import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Eye, EyeSlash } from '@phosphor-icons/react'
import en from '../locales/en/common.json'

type DemoStrings = (typeof en)['demo']
type Tx = { label: string; amount: number; kind: 'in' | 'out'; date: string }

const BAR_COLORS = ['#0D9488', '#2563EB', '#D97706', '#DB2777', '#65A30D']

export default function Demo({ d }: { d: DemoStrings }) {
  const [month, setMonth] = useState(0)
  const [hideBalance, setHideBalance] = useState(false)
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [extra, setExtra] = useState<Tx[]>([])

  const current = d.months[month]
  const maxSpend = Math.max(...current.spending.map((s) => s.amount))
  const txs: Tx[] = [
    ...extra,
    ...current.transactions.map((t) => ({ label: t.label, amount: t.amount, kind: t.kind as 'in' | 'out', date: t.date })),
  ]
  const shown = txs.filter((t) => filter === 'all' || t.kind === filter)

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(amount)
    if (!recipient.trim()) {
      setError(d.errorRecipient)
      return
    }
    if (!amount || Number.isNaN(n) || n <= 0) {
      setError(d.errorAmount)
      return
    }
    if (n > current.balance) {
      setError(d.errorFunds)
      return
    }
    setError('')
    setExtra((prev) => [{ label: recipient.trim(), amount: -n, kind: 'out', date: d.today }, ...prev])
    setSent(true)
    setRecipient('')
    setAmount('')
  }
  return (
    <div className="rounded-2xl border border-line bg-surface p-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="title-1 font-semibold">{d.title}</h2>
          <p className="caption-2 text-muted">{d.subtitle}</p>
        </div>
        <span className="caption-3 rounded-full bg-accent-soft px-4 py-2 text-accent">{d.sampleLabel}</span>
      </div>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label={d.monthLabel}>
        {d.months.map((m, i) => (
          <button
            key={m.label}
            type="button"
            aria-pressed={month === i}
            onClick={() => setMonth(i)}
            className={`button-sm rounded-full border px-3 py-1 transition-colors duration-300 ${month === i ? 'border-accent bg-accent text-accent-ink' : 'border-line text-muted hover:text-ink'}`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-line bg-bg p-8">
        <div className="flex items-center justify-between gap-4">
          <p className="caption-1 text-muted">{d.balanceLabel}</p>
          <button
            type="button"
            onClick={() => setHideBalance((v) => !v)}
            aria-label={hideBalance ? d.showLabel : d.hideLabel}
            aria-pressed={hideBalance}
            className="rounded-lg p-2 hover:bg-surface"
          >
            {hideBalance ? <EyeSlash size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </div>
        <p className="heading-2 mt-2" dir="ltr">
          {hideBalance ? '••••••' : `${d.currency}${current.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        </p>
        <p className="caption-2 mt-2 text-muted">{d.accountLabel}</p>
      </div>
      <div className="mt-8">
        <h3 className="title-1 font-semibold">{d.spendingLabel}</h3>
        <ul className="mt-4 space-y-4">
          {current.spending.map((s, i) => (
            <li key={s.label}>
              <div className="flex items-center justify-between">
                <span className="body-3">{s.label}</span>
                <span className="caption-1" dir="ltr">{d.currency}{s.amount.toLocaleString('en-US')}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface2">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(s.amount / maxSpend) * 100}%`, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={send} noValidate className="mt-8 rounded-xl border border-line bg-bg p-8">
        <h3 className="title-1 font-semibold">{d.transferLabel}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tx-recipient" className="body-4 mb-2 block">{d.recipientLabel}</label>
            <input id="tx-recipient" type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder={d.recipientPlaceholder} className="w-full rounded-lg border border-line bg-surface px-4 py-2 body-3 placeholder:text-muted" />
          </div>
          <div>
            <label htmlFor="tx-amount" className="body-4 mb-2 block">{d.amountLabel}</label>
            <input id="tx-amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={d.amountPlaceholder} className="w-full rounded-lg border border-line bg-surface px-4 py-2 body-3 placeholder:text-muted" />
          </div>
        </div>
        {error && <p className="caption-1 mt-4 text-red-500" role="alert">{error}</p>}
        {sent && !error && <p className="caption-1 mt-4 text-accent" role="status">{d.sentLabel}</p>}
        <button type="submit" className="button-sm mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-accent-ink transition-opacity duration-300 hover:opacity-90">
          <ArrowUpRight size={16} aria-hidden="true" />
          {d.sendLabel}
        </button>
      </form>
      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="title-1 font-semibold">{d.transactionsLabel}</h3>
          <div className="flex gap-2" role="group" aria-label={d.filterLabel}>
            {(['all', 'in', 'out'] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={filter === k}
                onClick={() => setFilter(k)}
                className={`button-sm rounded-full border px-3 py-1 transition-colors duration-300 ${filter === k ? 'border-accent bg-accent text-accent-ink' : 'border-line text-muted hover:text-ink'}`}
              >
                {d.filters[k]}
              </button>
            ))}
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {shown.map((t, i) => (
            <li key={`${t.label}-${t.date}-${i}`} className="flex items-center gap-4 rounded-xl border border-line bg-bg px-4 py-2">
              <span className={`rounded-lg p-2 ${t.kind === 'in' ? 'bg-accent-soft text-accent' : 'bg-surface2 text-muted'}`} aria-hidden="true">
                {t.kind === 'in' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="body-2 block truncate">{t.label}</span>
                <span className="caption-4 text-muted">{t.date}</span>
              </span>
              <span className={`body-2 shrink-0 ${t.kind === 'in' ? 'text-accent' : ''}`} dir="ltr">
                {t.kind === 'in' ? '+' : '-'}{d.currency}{Math.abs(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
