import { useState } from "react";
import { Header } from "../components/Header";
import { Player } from "../components/Player";
import { PlayerContext } from "../contexts/PlayerContext";

import "../styles/global.scss";
import styles from "../styles/app.module.scss";
import Episode from "./episodes/[slug]";

function MyApp({ Component, pageProps }) {
  // Anotação 01
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  return (
    // Anotação 02
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        isPlaying,
        togglePlay,
        setPlayingState,
      }}
    >
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
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
 *
 * Quando uma informação é colocada no meio de uma tag, nesse caso, como nesse
 * exemplo: <Button>Texto</Button>, essa informaçaõ é chamada de children, e é
 * inserida automaticamente nas props (propriedades).
 *
 * Anotação 01
 * Para que seja possível renderizar as alterações feitas nas váriáveis que
 * já foram impressas na tela, usamos a alteração de estado. O setState possui
 * dois retornos: o primeiro é o valor pra uma variável e o segundo é a função
 * usada para atualizar o valor na tela. Usamos a desestruturação para atribuir
 * os retornos para counter e setCounter. Quando alteramos o valor de counter
 * diretamente, o valor que já foi renderizado na tela não será atualizado.
 * Para que isso aconteça, utilizamos a função setCounter, passando para ela o
 * novo valor de counter. Além da função alterar o valor interno de counter,
 * ela também será responsável por solicitar internamente a atualização desse
 * valor na tela.
 *
 * Anotação 02
 * Trabalhando com contextos: serve para que um elemento tenha acesso aos dados
 * de outros elementos. Nesse caso, queremos que o player do site, "escute" os
 * cliques de mouse, por exemplo, dos outros componentes. Todos os componentes
 * que estão dentro do contexto do player (PlayerContext) têm acesso ao dados
 * contido em "value".
 */
