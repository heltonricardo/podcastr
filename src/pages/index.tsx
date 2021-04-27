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

import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import styles from "./home.module.scss";
import ptBR from "date-fns/locale/pt-BR";
import { api } from "../services/api";
import { GetStaticProps } from "next";
import { format, parseISO } from "date-fns";
import { usePlayer } from "../contexts/PlayerContext";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

// Anotação 01
type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
};

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      {/* Anotação 02 */}
      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                {/* Anotação 03 */}
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodesDetails}>
                  {/* Anotação 04*/}
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button
                  type="button"
                  onClick={() => playList(episodeList, index)}
                >
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        playList(episodeList, index + latestEpisodes.length)
                      }
                    >
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // localhost:3333/episodes com os parâmetros listados:
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  // Anotação 05
  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      url: episode.file.url,
    };
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};

/* O recurso SSG só funciona em produção, então para simulação, precisaremos
 * fazer uma build. Para isso, paramos a aplicação e deixamos somente o servidor
 * rodando. Comando: yarn build
 *
 * Anotação 01
 * Usamos o typescript para definir tipos, a fim de facilitar a escrita,
 * manutenção e entendimento dos códigos.
 *
 * Anotação 02
 * O componente Head permite que tudo o que está dentro dele, seja injetado no
 * cabeçalho do HTML.
 *
 * Anotação 03
 * O componente Image do next nos ajuda na questão da otimização. Basta
 * informar na tag as dimensões desejadas. A dimensão é referente a como a
 * imagem será CARREGADA, não a dimensão para mostrar em tela. Uma boa
 * estratégia é carregar a imagem com dimensão 3x maior do que será utilizada
 * para não perder muita nitidez em telas de maior qualidade. Porém, esse
 * componente não funciona para qualquer endereço de imagem. Para resolver isso
 * inserirmos (caso não exista é preciso criar) no arquivo next.config.js os
 * domínios das imagens que serão utilizadas na aplicação.
 *
 * Anotação 04
 * O Link serve para que, quando há uma navegação na tela, não seja preciso
 * recarregar toda a aplicação. Para isso basta envolver a tag âncora (<a></a>)
 * com a tag Link contendo o href que estaria na âncora.
 *
 * Anotação 05
 * Formatando os dados (nesse caso a data do podcast) em getStaticProps, logo
 * após o recebimento desses dados, e antes de passar para o componente Home(),
 * impedimos que esse código seja executado todas as vezes que o componente é
 * renderizado na tela novamente, através da mudança de estado.
 */
