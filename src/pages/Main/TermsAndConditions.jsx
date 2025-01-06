import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <header className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">entradita.com</h1>
            <Link to="/">
              <Button variant="outline">Volver al inicio</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Términos de Servicio</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Aceptación de los Términos</h2>
          <p className="mb-4">
            Al acceder y utilizar los servicios de entradita.com, usted acepta cumplir y estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Descripción del Servicio</h2>
          <p className="mb-4">
            entradita.com proporciona una plataforma en línea para la creación, venta y gestión de tickets para eventos, utilizando tecnología de códigos QR.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Cuentas de Usuario</h2>
          <p className="mb-4">
            Para utilizar ciertos aspectos de nuestros servicios, deberá crear una cuenta. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Uso Aceptable</h2>
          <p className="mb-4">
            Usted se compromete a no utilizar el servicio para ningún propósito ilegal o prohibido por estos términos. No debe intentar obtener acceso no autorizado a nuestros sistemas o redes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Propiedad Intelectual</h2>
          <p className="mb-4">
            El contenido y la tecnología utilizados en entradita.com están protegidos por derechos de autor y otras leyes de propiedad intelectual.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Limitación de Responsabilidad</h2>
          <p className="mb-4">
            entradita.com no será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo, incluyendo pérdida de beneficios, ya sea que se base en garantía, contrato, agravio o cualquier otra teoría legal.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Modificaciones del Servicio y los Términos</h2>
          <p className="mb-4">
            Nos reservamos el derecho de modificar o discontinuar, temporal o permanentemente, el servicio con o sin previo aviso. También podemos modificar estos Términos de Servicio en cualquier momento.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Ley Aplicable</h2>
          <p className="mb-4">
            Estos términos se regirán e interpretarán de acuerdo con las leyes de Argentina, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contacto</h2>
          <p className="mb-4">
            Si tiene alguna pregunta sobre estos Términos de Servicio, por favor contáctenos a través de nuestro formulario de contacto en el sitio web.
          </p>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 entradita.com. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
