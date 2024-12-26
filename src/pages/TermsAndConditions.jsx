import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ChevronLeft } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 sm:p-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Términos y Condiciones</h1>
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Volver
              </Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mb-6">Última actualización: {new Date().toLocaleDateString()}</p>
          <div className="overflow-y-auto h-[60vh] pr-4 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Introducción</h2>
              <p className="text-white">
                Bienvenido a entradita.com. Estos Términos y Condiciones rigen el uso de nuestro sitio web y servicios de gestión de eventos y tickets. Al utilizar entradita.com, usted acepta estos términos en su totalidad. Si no está de acuerdo con estos términos, por favor no utilice nuestro sitio web o servicios.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Definiciones</h2>
              <ul className="list-disc pl-5 text-white space-y-2">
                <li>"entradita.com", "nosotros", "nos" o "nuestro" se refiere a la plataforma de gestión de eventos y tickets entradita.com.</li>
                <li>"Usuario", "usted" o "su" se refiere a cualquier persona que acceda o utilice entradita.com.</li>
                <li>"Servicios" se refiere a todas las funcionalidades ofrecidas por entradita.com, incluyendo pero no limitado a la generación de tickets QR, verificación de tickets, y gestión de vendedores.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Uso del Servicio</h2>
              <ol className="list-decimal pl-5 text-white space-y-2">
                <li>Usted se compromete a utilizar entradita.com solo para fines legales y de acuerdo con estos Términos y Condiciones.</li>
                <li>Al utilizar nuestros servicios, usted garantiza que tiene al menos 18 años de edad o que cuenta con el consentimiento de un tutor legal.</li>
                <li>Usted es responsable de mantener la confidencialidad de su cuenta y contraseña.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Generación y Uso de Tickets QR</h2>
              <ol className="list-decimal pl-5 text-white space-y-2">
                <li>Los tickets QR generados por entradita.com son únicos y personales. No deben ser compartidos o transferidos a terceros.</li>
                <li>entradita.com no se hace responsable por el uso indebido de los tickets QR por parte de los usuarios.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Verificación de Tickets</h2>
              <p className="text-white">
                La verificación de tickets se realiza a través de nuestra aplicación móvil. Es responsabilidad del organizador del evento asegurar que el proceso de verificación se realice correctamente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Gestión de Vendedores</h2>
              <ol className="list-decimal pl-5 text-white space-y-2">
                <li>Los organizadores de eventos son responsables de la gestión y control de los vendedores asignados a sus eventos.</li>
                <li>entradita.com no se hace responsable de las acciones realizadas por los vendedores asignados por los organizadores.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Privacidad y Protección de Datos</h2>
              <p className="text-white">
                Nuestra política de privacidad explica cómo recopilamos, usamos y protegemos su información personal. Al utilizar nuestros servicios, usted acepta nuestras prácticas de privacidad.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Propiedad Intelectual</h2>
              <p className="text-white">
                Todo el contenido presente en entradita.com, incluyendo pero no limitado a textos, gráficos, logotipos, iconos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de entradita.com y está protegido por las leyes de propiedad intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Limitación de Responsabilidad</h2>
              <ol className="list-decimal pl-5 text-white space-y-2">
                <li>entradita.com proporciona sus servicios "tal cual" y "según disponibilidad". No garantizamos que nuestros servicios serán ininterrumpidos, oportunos, seguros o libres de errores.</li>
                <li>En ningún caso entradita.com será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Modificaciones de los Términos y Condiciones</h2>
              <p className="text-white">
                Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en entradita.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">11. Ley Aplicable</h2>
              <p className="text-white">
                Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de [País/Estado], sin tener en cuenta sus disposiciones sobre conflictos de leyes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">12. Contacto</h2>
              <p className="text-white">
                Si tiene alguna pregunta sobre estos Términos y Condiciones, por favor contáctenos a través de:
              </p>
              <ul className="list-disc pl-5 text-white space-y-2 mt-2">
                <li>WhatsApp: +543482586525</li>
                <li>Correo electrónico: [Dirección de correo electrónico de contacto]</li>
              </ul>
            </section>

            <p className="text-white font-semibold mt-8">
              Al utilizar entradita.com, usted reconoce que ha leído, entendido y aceptado estos Términos y Condiciones.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

