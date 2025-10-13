export type SongType = {
  id: number;
  title: string;
  album: string;
  artist: string;
  genre: string;
  duration: string;
  rating: number;
  total_copies: number;
  available_copies: number;
  description: string;
  color: string;
  imageUrl: string;
  audioUrl: string;
  lyrics?: string;
  tags?: string[];
};
