// Utilizamos nesse projeto um simulador de servidor que devolve JSON.

/* SPA (single page application): a aplicação executa sempre na mesma página,
 * alterando apenas os elementos necessários. Para isso usamos useEffect. Essa
 * função dispara alguma coisa quando algo mudar. A arrow function será
 * executada quando alguem valor dentro das chaves mudar. Para que uma função
 * seja executada assim que o componente for exibido em tela (uma única vez),
 * basta deixar as chaves sem valores dentro. Essa estratégia não é interessante
 * quando se quer fazer a indexação de conteúdos da página. Os crawlers (robôs
 * que procuram conteúdo para indexar nas páginas de empresas, exemplo: crawler
 * do google, bing etc) não esperam a resposta do servidor com o conteúdo, assim
 * entendendem como se a página estivesse vazia.
 *
 * import { useEffect } from "react";
 *
 * export default function Home() {
 *    useEffect(() => {
 *       fetch("http://localhost:3333/episodes")
 *          .then((response) => response.json())
 *          .then((data) => console.log(data));
 *    }, []);
 *
 *    return <h1>Index</h1>;
 * }
 */

/* SSR (server side rendering): uma página é renderizada estaticamente com todos
 * os seus js e css. Para isso basta, dentro de qualquer página (pasta pages)
 * exportarmos a função getServerSideProps. Porém esssa função é executada TODA
 * vez que a home da aplicação é acessada. Se for uma página que sobre pouca
 * alteração (exemplo: a cada dua apenas um podcast é liberado), não tem o
 * porquê da home ter seus dados acessados na API toda vez (se o site tiver
 * um milhão de acessos simultâneos, para cada acesso haverá uma requisição à
 * API para o mesmo conteúdo). Isso será resolvido com a próxima abordagem.
 *
 * export default function Home(props) {
 *    console.log(props.episodes);
 *    return <h1>Index</h1>;
 * }
 *
 * export async function getServerSideProps() {
 *    const response = await fetch("http://localhost:3333/episodes");
 *    const data = await response.json();
 *
 *    return {
 *       props: {
 *          episodes: data,
 *       },
 *    };
 * }
 */

/* SSG (static site generation): quando uma página é acessada, é gerada uma
 * versão estática dela (HTML público). Todos os próximos acessos serão servidos
 * com essa mesma página estática até que uma nova página seja gerada
 * (definindo um intervalo de tempo em segundos para tal ação atrvés do
 * revalidate). No exemplo foi utilizado 60 * 60 * 8 = 8 horas.
 */

export default function Home(props) {
   return (
      <div>
         <h1>Index</h1>
         <p>{JSON.stringify(props.episodes)}</p>
      </div>
   );
}
export async function getStaticProps() {
   const response = await fetch("http://localhost:3333/episodes");
   const data = await response.json();
   return {
      props: {
         episodes: data,
      },
      revalidate: 60 * 60 * 8,
   };
}

/* O recurso SSG só funciona em produção, então para simulação, precisaremos
 * fazer uma build. Para isso, paramos a aplicação e deixamos somente o servidor
 * rodando. Comando: yarn build
 */