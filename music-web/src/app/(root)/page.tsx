import SongList from "@/components/SongList";
import SongOverview from "@/components/SongOverview";

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
