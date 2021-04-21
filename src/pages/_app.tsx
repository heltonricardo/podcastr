import "../styles/global.scss";

import { Header } from "../components/Header";
import { Player } from "../components/Player";

import styles from "../styles/app.module.scss";

function MyApp({ Component, pageProps }) {
   return (
      <div className={styles.wrapper}>
         <main>
            <Header />
            <Component {...pageProps} />
         </main>
         <Player />
      </div>
   );
}

export default MyApp;

/* Toda página da aplicação é exibida dentro do App. Todo componente dentro do
 * App estará presente em todas as páginas da aplicação
 *
 * No React, um componente é formado por uma tag e sua respectiva função que
 * retorna código HTML.
 * 
 * Como o return permite apenas o retorno de um componente, é necessário
 * envolver tudo com uma tag. Porém, essa tag "pai" ficará sozinha dentro de
 * "root" no HTML, sendo praticamente inútil. Por isso o React possui a tag em
 * branco (<></>). Dessa maneira, o browser monta todo o conteúdo retornado
 * pela função diretamente na tag root do HTML. Não utilizamos nesse trecho pois
 * foi necessário incluir uma classe para essa tag externa.
 */