const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use('/songs', express.static(path.join(__dirname, 'songs')));

app.get('/api/songs', (req, res) => {

  const songsDir = path.join(__dirname, 'songs');

  fs.readdir(songsDir, (err, folders) => {

    if (err) return res.status(500).send('Error reading songs');

    const songs = [];

    folders.forEach(folder => {

      const folderPath = path.join(songsDir, folder);

      if (fs.statSync(folderPath).isDirectory()) {

        const files = fs.readdirSync(folderPath);

        const audio = files.find(file =>
          ['.mp3', '.wav', '.ogg'].includes(path.extname(file).toLowerCase())
        );

        const infoPath = path.join(folderPath, 'info.json');

        if (audio && fs.existsSync(infoPath)) {

          const info = JSON.parse(fs.readFileSync(infoPath));

          songs.push({
            file: `${folder}/${audio}`,
            title: info.title,
            artist: info.artist
          });

        }

      }

    });

    res.json(songs);

  });

});

app.listen(PORT, () => {
  console.log(`🎵 Music player running on http://localhost:${PORT}`);
});
