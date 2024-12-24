/** @jsxImportSource @emotion/react */
import { css, Global } from '@emotion/react';

// Lista de fuentes de Google a utilizar
export const googleFonts = [
  { name: 'Chela One', value: "Chela One, cursive" },
  { name: 'Lilita One', value: "Lilita One, cursive" },
  { name: 'Modak', value: "Modak, cursive" },
  { name: 'Oi', value: "Oi, cursive" },
  { name: 'Oswald', value: "Oswald, sans-serif" },
  { name: 'Roboto', value: "Roboto, sans-serif" },
  { name: 'Zen Dots', value: "Zen Dots, cursive" }
];

// Componente para inyectar los estilos de las fuentes
export const FontStyles = () => (
  <Global
    styles={css`
      @import url('https://fonts.googleapis.com/css2?family=Chela+One&family=Lilita+One&family=Modak&family=Oi&family=Oswald:wght@200..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Zen+Dots&display=swap');
    `}
  />
);