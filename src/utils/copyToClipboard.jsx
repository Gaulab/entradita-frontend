// filepath: /home/ivan/Dev/entradita/entraditaFront/src/utils/clipboardUtils.js
import { useState, useCallback } from 'react';

export const copyToClipboard = () => {
  const [copyMessage, setCopyMessage] = useState("");

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyMessage("Copiado");
        setTimeout(() => setCopyMessage(""), 2000); // El mensaje desaparece después de 2 segundos
      })
      .catch((err) => {
        console.error("Error al copiar: ", err);
        setCopyMessage("Error al copiar");
        setTimeout(() => setCopyMessage(""), 2000);
      });
  }, []);

  return { copyToClipboard, copyMessage };
};