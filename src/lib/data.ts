export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  albumArt: string;
  genre: string;
  theme: string;
  fileUrl: string;
};

export type Playlist = {
  id: string;
  name: string;
  songCount: number;
  coverArt: string;
};

export const songs: Song[] = [
  { id: '1', title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We\'re Dreaming', duration: '4:04', albumArt: 'https://placehold.co/400x400.png', genre: 'Synth-pop', theme: 'Nostalgic', fileUrl: '' },
  { id: '2', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: '5:55', albumArt: 'https://placehold.co/400x400.png', genre: 'Rock', theme: 'Epic', fileUrl: '' },
  { id: '3', title: 'Weightless', artist: 'Marconi Union', album: 'Weightless (Ambient Transmissions Vol. 2)', duration: '8:08', albumArt: 'https://placehold.co/400x400.png', genre: 'Ambient', theme: 'Relaxing', fileUrl: '' },
  { id: '4', title: 'Clair de Lune', artist: 'Claude Debussy', album: 'Suite bergamasque', duration: '5:05', albumArt: 'https://placehold.co/400x400.png', genre: 'Classical', theme: 'Calm', fileUrl: '' },
  { id: '5', title: 'Around the World', artist: 'Daft Punk', album: 'Homework', duration: '7:09', albumArt: 'https://placehold.co/400x400.png', genre: 'Electronic', theme: 'Upbeat', fileUrl: '' },
  { id: '6', title: 'Soothing Breeze', artist: 'Lo-Fi producer', album: 'Chill Beats', duration: '2:30', albumArt: 'https://placehold.co/400x400.png', genre: 'lofi chill', theme: 'Relaxing', fileUrl: '' },
  { id: '7', title: 'Coffee Shop Jazz', artist: 'Jazz Trio', album: 'Morning Brew', duration: '3:15', albumArt: 'https://placehold.co/400x400.png', genre: 'Jazz', theme: 'Calm', fileUrl: '' },
  { id: '8', title: 'Electric Dreams', artist: 'Synthwave Rider', album: 'Neon Nights', duration: '4:20', albumArt: 'https://placehold.co/400x400.png', genre: 'Synthwave', theme: 'Energetic', fileUrl: '' },
];

export const playlists: Playlist[] = [
  { id: 'p1', name: 'Chill Vibes', songCount: 23, coverArt: 'https://placehold.co/400x400.png' },
  { id: 'p2', name: 'Workout Hits', songCount: 50, coverArt: 'https://placehold.co/400x400.png' },
  { id: 'p3', name: 'Focus Flow', songCount: 15, coverArt: 'https://placehold.co/400x400.png' },
  { id: 'p4', name: 'Late Night Drive', songCount: 32, coverArt: 'https://placehold.co/400x400.png' },
];
