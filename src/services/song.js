class Song {
  constructor({id, singer, name, image, desc}) {
    this.id = id;
    this.singer = singer;
    this.name = name;
    this.image = image;
    this.desc = desc;
  }
}

export function createSong(song) {
  return new Song({
    id: song.id,
    name: `${song.name}`,
    singer: `${song.ar[0].name}`,
    image: song.al.picUrl,
    desc: `${song.al.name}`
  });
}