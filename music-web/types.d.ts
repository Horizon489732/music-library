interface Like {
  userId: string;
  songId: string;
  createdAt: string;
}
interface Playlist {
  id: string;
  title: string;
  userId: string;
  songs: Song[];
  createdAt: string;
  updatedAt: string;
}

interface SongType {
  id: string;
  title: string;
  audioUrl: string;
  imageUrl: string;
  artist: string;
  
  status: string;
  instrumental: boolean;
  description: string;
  color: string;

  prompt?: string;
  lyrics?: string;
  fullDescribedSong?: string;
  describedLyrics?: string;
  guidanceScale?: number;
  inferStep?: number;
  duration?: number;
  seed?: number;

  published: boolean;
  listenCount: number;
  likes: Like[];
  playlists: Playlist[];

  createdAt: string;
  updatedAt: string;
  tags?: string[];
}
