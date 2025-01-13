import React, { useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'

function MercadoPagoConnector() {
    initMercadoPago('TEST-505ae24b-de20-4f21-b2e6-79a3a4f3e41e');

    const initialization = {
        preferenceId: '<PREFERENCE_ID>',
    }
        
    const customization = {
        texts: {
            valueProp: 'smart_option',
        },
    }

    const onSubmit = async (formData) => {
        // callback llamado al hacer clic en Wallet Brick
        // esto es posible porque Brick es un botón 
        console.log('Form Data:', formData);
    };

    const onError = async (error) => {
        // callback llamado para todos los casos de error de Brick
        console.log('Error:', error);
    };

    const onReady = async () => {
        // Callback llamado cuando Brick esté listo.
        // Aquí puedes ocultar loadings en tu sitio, por ejemplo.  
        console.log('Brick is ready');
    };

    useEffect(() => {
        // Crear el elemento <script>
        const script = document.createElement("script");
        script.src = "https://sdk.miweb.com/js/v2";
        script.async = true;

        // Insertar el script en el <head> o <body>
        document.body.appendChild(script);

        // Limpiar el script si el componente se desmonta
        return () => {
        document.body.removeChild(script);
        };
    }, []); // El array vacío asegura que se ejecute solo una vez al montar

  return (
    <div>
      <Wallet 
        initialization={initialization} 
        customization={customization} 
        onSubmit={onSubmit} 
        onError={onError} 
        onReady={onReady} 
      />
    </div>
  );
}

export default MercadoPagoConnector;
