// @flow
import React from 'react';
import { stopContextMenu } from 'util/contextMenu';
// import videojs, { MediaSource as videoMediaSource, URL as videoURL } from 'video.js';
import 'video.js/dist/video-js.css';
import toBlobURL from 'stream-to-blob-url';
import fs from 'fs';
import * as stream from 'stream';
import GrowingFile from 'growing-file';

type Props = {
  source: {
    downloadPath: string,
    fileName: string,
  },
  contentType: string,
  poster?: string,
};

/*
let mediaSource = new MediaSource():
let sourceBuffer =  mediaSource.addSourceBuffer('video/mp4; codecs="avc1.4d401f,mp4a.40.2"; profiles="isom,mp42"');
sourceBuffer.appendBuffer(fileData);
URL.createObjectURL(mediaSource)
let fileStream = new stream.Writeable();
growingFile.on('data', (data) => {  sourceBuffer.appendBuffer(data) })
*/

class AudioVideoViewer extends React.PureComponent<Props> {
  componentDidMount() {
    const { source, contentType, poster } = this.props;
    const { downloadPath, fileName } = source;

    const indexOfFileName = downloadPath.indexOf(fileName);
    const basePath = downloadPath.slice(0, indexOfFileName);
    const encodedFileName = encodeURIComponent(fileName);

    /*
    let blob = null;
    let mimeCodec = 'video/mp4; codecs="avc1.4d401f,mp4a.40.2"; profiles="isom,mp42"';
    let mediaSource = new MediaSource();
    let sourceBuffer = null;
    let chunks = [];
    let pump = function(){
        if(chunks[0]){
            let chunk = chunks[0];
            delete chunks[0];
            sourceBuffer.appendBuffer(chunk);
            chunk = null;
            chunks.shift();
        }
    };

    let called = false;
    mediaSource.addEventListener('sourceopen', function(_){
      if(called) {
        return
      }
      called = true;
      console.log("sourceOpen")
        sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
        sourceBuffer.addEventListener('updateend', () => {
          console.log('updateend')
        }, false);

        let file = GrowingFile.open(downloadPath);
        file.on('data', (chunk) => {
          console.log('pump()')
          chunks[chunks.length] = new Uint8Array(chunk);
          pump();
        })
    });
    */

    function concatenate(resultConstructor, ...arrays) {
      let totalLength = 0;
      for (let arr of arrays) {
        totalLength += arr.length;
      }
      let result = new resultConstructor(totalLength);
      let offset = 0;
      for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
      }
      return result;
    }

    let mediaSource = new MediaSource();


    mediaSource.addEventListener('sourceopen', () => {
      console.log('sourceopen');
      // ; profiles="isom,mp42"
      let sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.4d401f,mp4a.40.2"');
console.log('sourceBuffer', sourceBuffer)
console.log('typeof sourceBuffer', typeof sourceBuffer)
      let file = GrowingFile.open(downloadPath);
      let chunks = [];
      file.on('data', (data) => chunks.push(data));

      let flushBuffer = setInterval(() => {
        if(chunks.length === 0) {
          return;
        }
        console.log('appendBuffer');
        sourceBuffer.appendBuffer(concatenate(Uint8Array, ...chunks));
        chunks = [];
      }, 250);
    });

    mediaSource.addEventListener('sourceended', () => console.log('sourceended'));
    mediaSource.addEventListener('sourceclose', () => console.log('sourceclose'));
    mediaSource.addEventListener('error', (error) => console.error(error))

    // Build the url from the mediaSource
    const url = URL.createObjectURL(mediaSource);
    console.log("url", url);
    const element = document.getElementById('video-id');
    element.src = url;
    // element.play();

    /*
    let reader = new FileReader();
    reader.onload = function(event) {
        chunks[chunks.length] = new Uint8Array(event.target.result);
        pump();
    };
    reader.readAsArrayBuffer(blob);
    */

    // let writable = new stream.Writable();
    // writable.on('pipe', (readableSrc) => {
    //   readableSrc.on('readable', () => {
    //     let chunk;
    //     while (null !== (chunk = readableSrc.read())) {
    //       console.log(`Received ${chunk.length} bytes of data.`);
    //     }
    //   });
    // })

    // file.pipe(writable);


    // const sources = [
    //   {
    //     src: url,
    //     type: contentType
    //   }
    // ]
    //
    // const videoJsOptions = {
    //   autoplay: true,
    //   controls: true,
    //   preload: 'none',
    //   poster,
    //   sources,
    //   flash: {
    //     swf: "video-js-with-mse.swf",
    //   }
    // };

    console.log("videojs()")
    // this.player = videojs(this.videoNode, videoJsOptions, () => {});
    // })
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    const { source } = this.props;
    // <div data-vjs-player>
    //   <video ref={node => (this.videoNode = node)} className="video-js" />
    // </div>
    return (
      <div className="file-render__viewer" onContextMenu={stopContextMenu}>
        <video id="video-id" />
      </div>
    );
  }
}

export default AudioVideoViewer;
