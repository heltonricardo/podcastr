import { useContext, useRef, useEffect } from "react";
import { PlayerContext } from "../../contexts/PlayerContext";
import styles from "./styles.module.scss";
import Image from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export function Player() {
  // Anotação 01
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
  } = useContext(PlayerContext);

  // Anotação 02
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>
        </div>

        {/* Anotação 03 */}
        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            autoPlay
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="Modo aleatório" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-previous.svg" alt="Anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Tocar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button type="button" disabled={!episode}>
            <img src="/play-next.svg" alt="Próxima" />
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}

/* Anotação 01
 * Usamos (Ref)erências no React para controlar elementos nativos do HTML. O
 * valor começa como nulo pois quando é iniciado, o elemento ainda não foi
 * criado
 *
 * Anotação 02
 * Essa função dispara alguma coisa quando algo mudar. Nesse caso ela executa a
 * arrow function quando há alteração em algum dos valores das variáveis dentro
 * dos colchetes, no exemplo em "isPlaying".
 *
 *Anotação 03
 * Além do operador ternário comum: "() ? :", é possível usá-lo apenas para
 * quando há uma expressão verdadeira: "() &&" ou para quando há uma expressão
 * falsa: "() ||"
 */
