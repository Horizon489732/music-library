import SongList from "@/components/song-related/SongList";
import SongOverview from "@/components/song-related/SongOverview";

import { sampleSongs } from "@/contants";

const Page = () => {
  return (
    <>
      <SongOverview {...(sampleSongs[0] as SongType)} />

      <SongList
        title="Latest Songs"
        songs={sampleSongs}
        containerClassName="mt-28"
      />
    </>
  );
};

export default Page;
