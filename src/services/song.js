class Song {
  constructor({id, singer, name, image}) {
    this.id = id;
    this.singer = singer;
    this.name = name;
    this.image = image;
  }
}

export function createSong(song) {
  return new Song({
    id: song.id,
    name: `${song.name}`,
    singer: `${song.ar[0].name} - ${song.al.name}`,
    image: song.al.picUrl
  });
}