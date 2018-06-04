class Song {
  constructor({id, singer, name, image, desc}) {
    this.id = id;
    this.singer = singer;
    this.name = name;
    this.image = image;
    this.desc = desc;
  }
}

function singerName(names) {
  let name = [];
  name = names.map((item) => {
    return item.name;
  });

  return name.join('/');
}

export function createSong(song) {
  return new Song({
    id: song.id,
    name: `${song.name}`,
    singer: singerName(song.ar),
    image: song.al.picUrl,
    desc: `${song.al.name}`
  });
}