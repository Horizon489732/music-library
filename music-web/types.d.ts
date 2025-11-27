interface Like {
  user: string;
  song: string;
  createdAt: string;
}
interface Playlist {
  id: string;
  name: string;
  user: string;
  public: boolean;
  songs: Song[];
}

interface Comment {
  id: string;
  user: string;
  song: string;
  text: string;
  createdAt: string;
}

interface Song {
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
  likes?: Like[];  
  playlists?: Playlist[];
  comments?: Comment[];
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
