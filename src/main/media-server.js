const express = require('express');
const app = express();
const port = 1337;
const fs = require('fs');
const GrowingFile = require('growing-file');

app.get('/video', function(req, res) {
  const path = req.query.path;
  const file = GrowingFile.open(path);
  // const head = {}

  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const head = {
    'Content-Length': fileSize,
  };
  res.writeHead(200, head);
  GrowingFile.open(path).pipe(res);

  // const range = req.headers.range
  // if (range) {
  //   const parts = range.replace(/bytes=/, "").split("-")
  //   const start = parseInt(parts[0], 10)
  //   const end = parts[1]
  //     ? parseInt(parts[1], 10)
  //     : fileSize-1
  //   const chunksize = (end-start)+1
  //   const file = fs.createReadStream(path, {start, end})
  //   const head = {
  //     'Content-Range': `bytes ${start}-${end}/${fileSize}`,
  //     'Accept-Ranges': 'bytes',
  //     'Content-Length': chunksize,
  //     'Content-Type': 'video/mp4',
  //   }
  //   res.writeHead(206, head);
  //   file.pipe(res);
  // } else {
  //   const head = {
  //     'Content-Length': fileSize,
  //     'Content-Type': 'video/mp4',
  //   }
  //   res.writeHead(200, head)
  //   fs.createReadStream(path).pipe(res)
  // }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
