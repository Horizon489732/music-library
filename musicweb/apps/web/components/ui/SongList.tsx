import { SongType } from '@repo/types';
import SongCard from './SongCard';

interface Props {
  title: string;
  songs: SongType[];
  containerClassName?: string;
}

const SongList = ({ title, songs, containerClassName }: Props) => {
  return (
    <section className={containerClassName}>
      <h2 className="text-secondary font-mono text-4xl">{title}</h2>

      <ul className="max-xs:justify-between xs:gap-10 mt-10 flex flex-wrap gap-5">
        {songs.map((song) => (
          <SongCard key={song.title} song={song} />
        ))}
      </ul>
    </section>
  );
};

export default SongList;
