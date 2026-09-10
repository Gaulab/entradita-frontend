import { Wrench } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40" />

      <div className="relative z-10 text-center max-w-lg mx-auto px-6">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-primary/30 mb-8">
          <Wrench className="h-10 w-10 text-primary animate-pulse" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Estamos en mantenimiento
          </span>
        </h1>

        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          Estamos trabajando para mejorar la plataforma.
          Volvemos pronto.
        </p>

        <div className="inline-flex items-center px-4 py-2 rounded-full bg-card/60 border border-border/50">
          <span className="relative flex h-2.5 w-2.5 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
          <span className="text-sm text-muted-foreground">
            entradita.com
          </span>
        </div>
      </div>
    </div>
  );
}
