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

class AudioVideoViewer extends React.PureComponent<Props> {
  // componentDidMount() {
  //   const { source, contentType, poster } = this.props;
  //   const { downloadPath, fileName } = source;
  //
  //   const indexOfFileName = downloadPath.indexOf(fileName);
  //   const basePath = downloadPath.slice(0, indexOfFileName);
  //   const encodedFileName = encodeURIComponent(fileName);
  //
  //
  //
  // }

  render() {
    const {
      source: { downloadPath },
    } = this.props;
    const encodedPath = encodeURIComponent(downloadPath);
    const videoPath = `http://localhose:1337/video?path=${encodedPath}`;
    return (
      <div className="file-render__viewer" onContextMenu={stopContextMenu}>
        <video src={videoPath} />
      </div>
    );
  }
}

export default AudioVideoViewer;
