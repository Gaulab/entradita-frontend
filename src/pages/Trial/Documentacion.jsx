'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import {
  ArrowLeft, ArrowRight, ChevronDown, Rocket, Sparkles,
  CalendarPlus, Ticket, ScanLine, UserCog, Handshake, Smartphone, DoorOpen,
  LogIn, LayoutDashboard, SlidersHorizontal, Users,
  MapPin, Repeat, Lock, Image as ImageIcon, Fingerprint, Tag, KeyRound,
  Globe, DollarSign, Activity, RotateCcw, ShieldCheck,
  Copy, Share2, Trash2, Pause, Pencil, ExternalLink, Store,
  Mail, MessageCircle, CheckCircle2, CreditCard,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Callout } from '../../components/ui/callout';

const WA = 'https://wa.me/5493482275737';

/* ── helpers de animación / layout ──────────────────────────────────────── */

function Reveal({ children, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
Reveal.propTypes = { children: PropTypes.node, delay: PropTypes.number, className: PropTypes.string };

function SurfaceCard({ children, className }) {
  return <div className={`rounded-2xl border border-border bg-card/60 p-5 ${className || ''}`}>{children}</div>;
}
SurfaceCard.propTypes = { children: PropTypes.node, className: PropTypes.string };

/* ── secciones ──────────────────────────────────────────────────────────── */

const NAV = [
  { id: 'acceso', label: 'Acceso', icon: LogIn },
  { id: 'panel', label: 'Tu panel', icon: LayoutDashboard },
  { id: 'crear', label: 'Crear evento', icon: CalendarPlus },
  { id: 'gestion', label: 'Gestionar', icon: SlidersHorizontal },
  { id: 'entradas', label: 'Entradas', icon: Ticket },
  { id: 'vendedores', label: 'Vendedores', icon: Users },
  { id: 'puerta', label: 'Control de acceso', icon: ScanLine },
];

function Documentacion() {
  return (
    <div className="min-h-screen scroll-smooth bg-background text-foreground">
      {/* Glow de fondo (radial-gradient, sin filter:blur — barato en mobile) */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(55% 40% at 50% 0%, hsl(var(--brand-from) / 0.14), transparent 70%)',
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/isotipoWhite.png" alt="entradita" className="h-8 w-auto" />
            <span className="font-semibold tracking-tight">entradita</span>
            <span className="ml-1 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">docs</span>
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          </Link>
        </div>
      </header>

      <div className="relative z-10">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="container grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Guía de uso
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Aprendé a usar entradita{' '}
              <span className="bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
                en minutos
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Del primer evento hasta la puerta el día del show. Sin manuales
              eternos: mirá los 3 pasos, entendé el flujo y empezá a vender.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#quickstart">
                <Button size="lg" className="w-full font-semibold sm:w-auto">
                  <Rocket className="mr-2 h-4 w-4" /> Empezar ahora
                </Button>
              </a>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Crear cuenta gratis
                </Button>
              </Link>
            </div>
          </Reveal>

          {/* Ticket mockup con QR en vivo */}
          <Reveal delay={0.15} className="flex justify-center lg:justify-end">
            <div className="w-full max-w-xs overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-primary/10">
              <div className="bg-gradient-to-r from-brand-from to-brand-to px-6 py-4 text-white">
                <p className="text-xs opacity-80">entrada digital</p>
                <p className="mt-1 text-lg font-bold">Fiesta de fin de año</p>
                <p className="text-xs opacity-80">12 de diciembre · General</p>
              </div>
              <div className="flex flex-col items-center gap-3 p-6">
                <div className="rounded-2xl bg-white p-4">
                  <QRCodeCanvas value="https://entradita.com" size={148} level="M" />
                </div>
                <p className="text-xs text-muted-foreground">Escaneá para validar el acceso</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── QUICKSTART 3 PASOS ───────────────────────────────── */}
        <section id="quickstart" className="container scroll-mt-24 py-12">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Empezá en 3 pasos</h2>
            <p className="mt-3 text-muted-foreground">De cero a tu primera entrada vendida.</p>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { n: 1, icon: CalendarPlus, t: 'Creá tu evento', d: 'Nombre, fecha, lugar, imagen y los tipos de entrada (General, VIP…). Listo en un formulario.' },
              { n: 2, icon: Ticket, t: 'Cargá y compartí', d: 'Generá entradas con QR y mandalas por WhatsApp, o activá la venta web con Mercado Pago.' },
              { n: 3, icon: ScanLine, t: 'Controlá el ingreso', d: 'El día del evento, escaneás los QR en la puerta y ves la asistencia en tiempo real.' },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <SurfaceCard className="h-full transition-colors hover:border-primary/40">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/20">
                      {s.n}
                    </span>
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </SurfaceCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CÓMO FUNCIONA (roles) ────────────────────────────── */}
        <section className="container py-16">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">¿Cómo funciona?</h2>
            <p className="mt-3 text-muted-foreground">Cuatro protagonistas, un flujo simple.</p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: UserCog, t: 'Organizador', d: 'Sos vos. Creás el evento, definís precios y sumás a tu equipo.' },
              { icon: Handshake, t: 'Vendedores', d: 'Tus tarjeteros venden desde su propio portal con la contraseña del evento.' },
              { icon: Smartphone, t: 'Asistente', d: 'Recibe su entrada con QR por WhatsApp o la compra online.' },
              { icon: DoorOpen, t: 'Puerta', d: 'El personal escanea el QR y valida el acceso al instante.' },
            ].map((r, i) => (
              <Reveal key={r.t} delay={i * 0.08}>
                <div className="relative flex h-full flex-col rounded-2xl border border-border bg-card/60 p-5">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-from/20 to-brand-to/20 text-primary ring-1 ring-primary/20">
                    <r.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{r.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.d}</p>
                  {i < 3 && (
                    <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-border lg:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CONTENIDO + NAV LATERAL ──────────────────────────── */}
        <div className="container grid gap-10 py-8 lg:grid-cols-[220px_1fr]">
          {/* Nav pegajosa */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                En detalle
              </p>
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 space-y-16">
            {/* ACCESO */}
            <DocSection id="acceso" icon={LogIn} title="Acceso a la plataforma"
              lead="Creás tu cuenta vos mismo. Hay tres formas de entrar.">
              <div className="grid gap-3 sm:grid-cols-3">
                <Feature icon={Globe} title="Con Google" text="Un clic y listo. Queda verificada automáticamente." />
                <Feature icon={Mail} title="Con email" text="Usuario, email y contraseña. Confirmás con el correo de verificación." />
                <Feature icon={KeyRound} title="Usuario clásico" text="Si ya tenías cuenta, seguís entrando con tu usuario." />
              </div>
              <Callout variant="warn" title="La verificación de email es obligatoria">
                Si te registrás con email, tu cuenta se activa recién cuando hacés clic
                en el enlace del correo. Revisá también el spam.
              </Callout>
              <Callout variant="tip" title="¿Olvidaste la contraseña?">
                Usá “¿Olvidaste tu contraseña?” en el login y te llega un enlace para
                resetearla. Si entrás con Google, la manejás desde tu cuenta de Google.
              </Callout>
            </DocSection>

            {/* PANEL */}
            <DocSection id="panel" icon={LayoutDashboard} title="Tu panel"
              lead="Es lo primero que ves al entrar. Desde acá manejás todo.">
              <div className="grid gap-3 sm:grid-cols-2">
                <Feature icon={CreditCard} title="Créditos de entradas"
                  text="Cada entrada que generás consume un crédito. Los que no usás quedan para el próximo evento." />
                <Feature icon={Store} title="Vincular Mercado Pago"
                  text="Conectá tu cuenta de MP para cobrar la venta web de tus entradas." />
                <Feature icon={CalendarPlus} title="Crear evento"
                  text="Arranca el formulario de un evento nuevo." />
                <Feature icon={LayoutDashboard} title="Lista de eventos"
                  text="Todos tus eventos con nombre, fecha, vendidas y estado. Tocá “Ver” para gestionarlos." />
              </div>
            </DocSection>

            {/* CREAR EVENTO */}
            <DocSection id="crear" icon={CalendarPlus} title="Crear un evento"
              lead="Un solo formulario define todo: datos, seguridad y precios.">
              <div className="grid gap-3 sm:grid-cols-2">
                <Feature icon={Tag} title="Nombre" text="Aparece en las entradas y en el panel." />
                <Feature icon={Repeat} title="Fecha o periodicidad" text="Evento único, o periódico (ej. todos los sábados) con fecha de inicio y fin." />
                <Feature icon={MapPin} title="Lugar" text="Dónde se hace, para informar a los asistentes." />
                <Feature icon={Users} title="Capacidad" text="Límite de entradas. En periódicos aplica por cada fecha." />
                <Feature icon={ImageIcon} title="Imagen" text="Subís una foto; se optimiza sola y aparece en la entrada y la página pública." />
                <Feature icon={Lock} title="Contraseña de empleados" text="La usan vendedores y personal de puerta para entrar a la app." />
                <Feature icon={Fingerprint} title="Pedir DNI" text="Opcional: obliga a cargar el documento de cada asistente." />
                <Feature icon={Ticket} title="Tipos de entrada" text="General, VIP… con precio, comisión al vendedor y venta web on/off." />
              </div>
              <Callout variant="tip" title="Tip de venta web">
                Con el interruptor de venta web en cada tipo de entrada elegís qué se
                vende online al público y qué queda exclusivo para venta por WhatsApp.
              </Callout>
            </DocSection>

            {/* GESTIÓN */}
            <DocSection id="gestion" icon={SlidersHorizontal} title="Gestionar el evento"
              lead="Ya creado, controlás cada aspecto desde su página.">
              <div className="grid gap-3 sm:grid-cols-2">
                <Feature icon={Globe} title="Página WEB" text="La página pública que compartís: info + compra online." />
                <Feature icon={DollarSign} title="Economía" text="Ventas por categoría, comisiones, neto y estadísticas por día." />
                <Feature icon={Activity} title="Asistencia en vivo" text="Barra de progreso que sube cada vez que se escanea una entrada." />
                <Feature icon={RotateCcw} title="Reiniciar (periódicos)" text="Resetea las estadísticas para la próxima fecha, manteniendo la config." />
              </div>
              <Callout variant="info" title="Venta web on/off">
                Un interruptor habilita o corta la compra online del evento. Apagado,
                solo se venden entradas de forma manual.
              </Callout>
            </DocSection>

            {/* ENTRADAS */}
            <DocSection id="entradas" icon={Ticket} title="Entradas"
              lead="El corazón de todo: cada una lleva un QR único e irrepetible.">
              <div className="grid gap-3 sm:grid-cols-3">
                <Feature icon={Copy} title="Copiar link" text="Copia solo el enlace de la entrada para mandárselo al comprador." />
                <Feature icon={Share2} title="Copiar mensaje" text="Copia el link + un mensaje listo para WhatsApp. La opción recomendada." />
                <Feature icon={Trash2} title="Borrar" text="Elimina la entrada. Es irreversible y ya no sirve para ingresar." />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Callout variant="info" title="Cada QR es único">
                  No se puede duplicar y permite un solo ingreso. Al escanearse queda
                  marcado como “usado”.
                </Callout>
                <Callout variant="warn" title="Consume un crédito">
                  Generar una entrada descuenta una unidad de tus créditos disponibles.
                </Callout>
              </div>
            </DocSection>

            {/* VENDEDORES */}
            <DocSection id="vendedores" icon={Users} title="Vendedores (tarjeteros)"
              lead="Tu equipo vende desde su propio portal, con lo que vos le habilites.">
              <SurfaceCard>
                <p className="font-semibold">Al crear un vendedor definís:</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Qué categorías de entrada puede vender.</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Un nombre identificatorio.</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Su capacidad (cuántas entradas puede vender).</li>
                </ul>
              </SurfaceCard>
              <div className="grid gap-3 sm:grid-cols-3">
                <Feature icon={Copy} title="Link del portal" text="Se lo compartís para que venda." />
                <Feature icon={ExternalLink} title="Ir al portal" text="Ves exactamente lo que ve él." />
                <Feature icon={Share2} title="Mensaje listo" text="Link + invitación para pegar en WhatsApp." />
                <Feature icon={Pencil} title="Editar" text="Cambiás nombre, categorías o capacidad." />
                <Feature icon={Pause} title="Pausar" text="Frenás sus ventas y las reanudás cuando quieras." />
                <Feature icon={Trash2} title="Borrar" text="Lo elimina junto con sus entradas no usadas." />
              </div>
              <Callout variant="tip" title="La contraseña va aparte">
                El vendedor entra a su portal con la <b>contraseña de empleados</b> que
                pusiste al crear el evento. Se la pasás por separado.
              </Callout>
            </DocSection>

            {/* PUERTA */}
            <DocSection id="puerta" icon={ScanLine} title="Control de acceso"
              lead="El día del evento, la puerta es puro escaneo.">
              <div className="grid gap-3 sm:grid-cols-2">
                <Feature icon={ScanLine} title="Escaneo del QR" text="El personal abre el escáner y valida cada entrada en milisegundos." />
                <Feature icon={ShieldCheck} title="Anti-duplicados" text="Si una entrada ya fue usada, el sistema la rechaza al instante." />
                <Feature icon={Activity} title="Asistencia en vivo" text="Cada escaneo actualiza el porcentaje de ingreso en tu panel." />
                <Feature icon={KeyRound} title="Acceso del personal" text="Entran con la contraseña de empleados del evento." />
              </div>
            </DocSection>
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="container py-16">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Preguntas frecuentes</h2>
          </Reveal>
          <div className="mx-auto mt-10 max-w-2xl space-y-3">
            {[
              { q: '¿Qué pasa si se me acaban los créditos?', a: 'No podés generar más entradas hasta recargar. Escribinos y coordinamos la recarga de tu cuenta.' },
              { q: '¿El asistente necesita instalar una app?', a: 'No. Recibe un link con su entrada y QR que abre desde el navegador del celular.' },
              { q: '¿Puedo vender online y por tarjeteros a la vez?', a: 'Sí. Activás la venta web para algunas categorías y dejás otras exclusivas para tus vendedores.' },
              { q: '¿Sirve para una fiesta que se repite todas las semanas?', a: 'Sí, con los eventos periódicos: se reprograma la fecha y reiniciás las estadísticas por cada función.' },
            ].map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="container pb-20">
          <Reveal className="rounded-3xl border border-border bg-card/60 p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">¿Listo para tu próximo evento?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Creá tu cuenta gratis y vendé tu primera entrada hoy. Si te trabás,
              estamos a un mensaje de distancia.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/login">
                <Button size="lg" className="w-full font-semibold sm:w-auto">
                  Crear cuenta gratis <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href={WA} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <MessageCircle className="mr-2 h-4 w-4" /> Hablar con nosotros
                </Button>
              </a>
            </div>
          </Reveal>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/60 py-8">
          <div className="container flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
            <div className="flex items-center gap-2">
              <img src="/isotipoWhite.png" alt="entradita" className="h-6 w-auto" />
              <span>entradita.com · Transformando la gestión de eventos</span>
            </div>
            <div className="flex gap-6">
              <Link to="/contact" className="hover:text-foreground">Contacto</Link>
              <Link to="/pricing" className="hover:text-foreground">Precios</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ── subcomponentes ─────────────────────────────────────────────────────── */

function DocSection({ id, icon: Icon, title, lead, children }) {
  return (
    <Reveal>
      <section id={id} className="scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        </div>
        {lead && <p className="mt-3 max-w-2xl text-muted-foreground">{lead}</p>}
        <div className="mt-6 space-y-4">{children}</div>
      </section>
    </Reveal>
  );
}
DocSection.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  lead: PropTypes.string,
  children: PropTypes.node,
};

function Feature({ icon: Icon, title, text }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
Feature.propTypes = { icon: PropTypes.elementType.isRequired, title: PropTypes.string.isRequired, text: PropTypes.string.isRequired };

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card/60">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left font-medium"
      >
        {q}
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{a}</p>}
    </div>
  );
}
FAQItem.propTypes = { q: PropTypes.string.isRequired, a: PropTypes.string.isRequired };

export default Documentacion;
