import PropTypes from "prop-types"
import { Info, Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const VARIANTS = {
  info:    { icon: Info,          box: "border-primary/30 bg-primary/5",       ic: "text-primary" },
  tip:     { icon: Lightbulb,     box: "border-amber-500/30 bg-amber-500/10",  ic: "text-amber-400" },
  warn:    { icon: AlertTriangle, box: "border-amber-500/40 bg-amber-500/10",  ic: "text-amber-400" },
  success: { icon: CheckCircle2,  box: "border-emerald-500/30 bg-emerald-500/10", ic: "text-emerald-400" },
}

/** Bloque de aviso reutilizable (info / tip / warn / success). */
export function Callout({ variant = "info", title, children, className }) {
  const v = VARIANTS[variant] || VARIANTS.info
  const Icon = v.icon
  return (
    <div className={cn("flex gap-3 rounded-xl border p-4", v.box, className)}>
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", v.ic)} />
      <div className="text-sm leading-relaxed text-muted-foreground">
        {title && <p className="mb-0.5 font-semibold text-foreground">{title}</p>}
        {children}
      </div>
    </div>
  )
}

Callout.propTypes = {
  variant: PropTypes.oneOf(["info", "tip", "warn", "success"]),
  title: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
}
