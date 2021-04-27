import { useRef, useEffect, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./styles.module.scss";
import Image from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export function Player() {
  // Anotação 01
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    hasPrevious,
    hasNext,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    clearPlayerState,
  } = usePlayer();

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

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

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
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          {/* Anotação 03 */}
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {/* Anotação 04 */}
        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            loop={isLooping}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}
            // Anotação 05
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ""}
            disabled={!episode || episodeList.length == 1}
          >
            <img src="/shuffle.svg" alt="Modo aleatório" />
          </button>

          <button
            type="button"
            onClick={playPrevious}
            disabled={!episode || !hasPrevious}
          >
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

          <button
            type="button"
            onClick={playNext}
            disabled={!episode || !hasNext}
          >
            <img src="/play-next.svg" alt="Próxima" />
          </button>

          <button
            type="button"
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ""}
            disabled={!episode}
          >
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
 * Anotação 03
 * O operador "?" é útil, nesse caso, quando não sabemos se o objeto é nulo.
 * Caso "episode" seja nulo, não será feita uma tentativa de acessar o campo
 * "duration" pois foi usada a notação episode?.duration. O outro operador (??)
 * foi útil para que, se o objeto é nulo, passamos entao o valor após ele, no
 * caso o número zero.
 *
 * Anotação 04
 * Além do operador ternário comum: "() ? :", é possível usá-lo apenas para
 * quando há uma expressão verdadeira: "() &&" ou para quando há uma expressão
 * falsa: "() ||"
 *
 * Anotação 05
 * onPlay e onPause da tag audio estão relacionados com os botões de atalho
 * multimídia em alguns teclados de computadores ou de notebooks. Essa
 * integração é feita pelo próprio browser.
 */
