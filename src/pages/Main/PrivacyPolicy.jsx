import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicy() {
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
        <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Recopilación de Información</h2>
          <p className="mb-4">
            Recopilamos información personal que usted nos proporciona directamente, como nombre, dirección de correo electrónico y detalles de pago cuando crea una cuenta o compra tickets.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Uso de la Información</h2>
          <p className="mb-4">
            Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios, procesar transacciones, enviar comunicaciones relacionadas con el servicio y para fines de marketing si usted ha dado su consentimiento.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Compartir Información</h2>
          <p className="mb-4">
            No vendemos su información personal. Podemos compartir información con proveedores de servicios que nos ayudan a operar nuestro negocio, o cuando sea requerido por la ley.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Seguridad de Datos</h2>
          <p className="mb-4">
            Implementamos medidas de seguridad diseñadas para proteger su información personal, incluyendo el uso de encriptación para los datos sensibles.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Sus Derechos</h2>
          <p className="mb-4">
            Usted tiene derecho a acceder, corregir o eliminar su información personal. También puede oponerse al procesamiento de sus datos o solicitar la portabilidad de los mismos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Cookies y Tecnologías Similares</h2>
          <p className="mb-4">
            Utilizamos cookies y tecnologías similares para mejorar la experiencia del usuario, analizar el tráfico del sitio y personalizar el contenido. Puede controlar el uso de cookies a través de la configuración de su navegador.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Cambios en la Política de Privacidad</h2>
          <p className="mb-4">
            Podemos actualizar esta política de privacidad de vez en cuando. Le notificaremos cualquier cambio significativo publicando la nueva política de privacidad en esta página.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contacto</h2>
          <p className="mb-4">
            Si tiene preguntas sobre esta Política de Privacidad, por favor contáctenos a través de nuestro formulario de contacto en el sitio web.
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

