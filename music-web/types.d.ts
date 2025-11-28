interface LikeType {
  user: string;
  song: string;
  createdAt: string;
}
interface PlaylistType {
  id: string;
  name: string;
  user: string;
  public: boolean;
  songs: SongType[];
}

interface CommentType {
  id: string;
  user: string;
  song: string;
  text: string;
  createdAt: string;
}

interface SongType {
  id: string;
  title: string;
  audioUrl?: string;
  imageUrl?: string;
  creator: string;
  description?: string;
  color: string;
  lyrics?: string;

  status: string;
  isAISong: boolean;
  instrumental: boolean;
  duration: number;
  published: boolean;
  listenCount: number;
  likes?: LikeType[];
  playlists?: PlaylistType[];
  comments?: CommentType[];
  tags?: string[]; //categories in the database

  // Optional AI songs properties
  prompt?: string;
  fullDescribedSong?: string;
  describedLyrics?: string;
  inferStep?: number;
  guidanceScale?: number;
  guidanceScaleText?: number;
  guidanceScaleLyric?: number;
  schedulerType?: number;
  useErgTag?: boolean;
  useErgLyric?: boolean;
  useErgDiffusion?: boolean;
  guidanceInterval?: number;
  guidanceIntervalDecay?: number;
  seed?: number;
  cfgType?: string;

  createdAt: string;
  updatedAt: string;
}
