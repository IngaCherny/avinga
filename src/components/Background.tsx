/**
 * Soft blush "blob" circles that drift behind the content — the cozy backdrop
 * from the PDF. Purely decorative, hidden from assistive tech.
 */
export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* top-right large peach circle */}
      <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-peach-light/70 blur-[2px] animate-float-slow" />
      {/* bottom-left peach circle */}
      <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-peach/50 animate-float-slow [animation-delay:-3s]" />
      {/* small accent dots */}
      <div className="absolute right-10 top-1/3 h-24 w-24 rounded-full bg-rose-soft/40 animate-float-slow [animation-delay:-5s]" />
      <div className="absolute left-1/4 bottom-16 h-16 w-16 rounded-full bg-peach-light/50 animate-float-slow [animation-delay:-1.5s]" />
    </div>
  )
}
