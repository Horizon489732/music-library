import SongList from '@components/ui/SongList';
import SongOverview from '@components/ui/SongOverview';
import { SongType } from '@repo/types';

import { sampleSongs } from 'contants';

export default function Home() {
  return (
    <>
      <SongOverview {...(sampleSongs[0] as SongType)} />
      <SongList title="Latest Songs" songs={sampleSongs} containerClassName="mt-28" />
    </>
  );
}
