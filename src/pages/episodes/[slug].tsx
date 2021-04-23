import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "../../services/api";
import { format, parseISO } from "date-fns";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import ptBR from "date-fns/locale/pt-BR";
import Image from "next/image";
import Link from "next/link";

import styles from "./episode.module.scss";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
  description: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  return (
    <div className={styles.episodeContainer}>
      <div className={styles.episode}>
        <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar" />
            </button>
          </Link>
          <Image
            width={700}
            height={160}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <button type="button">
            <img src="/play.svg" alt="Tocar episódio" />
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: episode.description }}
        />
      </div>
    </div>
  );
}

// Anotação 01
export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 2,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const paths = data.map((episode) => {
    return {
      params: {
        slug: episode.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24h
  };
};

/* Anotação 01
 * O método getStaticPaths é de uso obrigatório em toda rota que utiliza geração
 * estática (getStaticProps) e que tem parâmetro dinâmico (que possui colchetes
 * no nome do arquivo). Isso é necessário para que o next saiba quais são as
 * páginas que precisam de uma página estática no momento da build. Informamos
 * dentro dos parâmetros os nomes dos episódios que terão páginas estáticas.
 */
