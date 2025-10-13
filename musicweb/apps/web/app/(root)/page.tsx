import SongList from '@components/ui/SongList';
import SongOverview from '@components/ui/SongOverview';

import { sampleSongs } from 'contants';

export default function Home() {
  return (
    <>
      <SongOverview {...sampleSongs[0]} />
      <SongList title="Best Song" book={sampleSongs} containerClassName="mt-28" />
    </>
  );
}
