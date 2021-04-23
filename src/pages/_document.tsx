/* Sempre que trocamos de rota, o _app é recarregado. Então usamos o arquivo
 * _document para definir o formato do HTML que ficará "por fora" da aplicação.
 * Ele é carregado uma única vez.
 */

import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
   render() {
      return (
         <Html>
            <Head>
               <link rel="preconnect" href="https://fonts.gstatic.com" />
               <link
                  href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap"
                  rel="stylesheet"
               />
            </Head>
            <body>
               <Main />
               <NextScript />
            </body>
         </Html>
      );
   }
}
