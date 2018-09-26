import React from 'react';
import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import player from 'render-media';
import toBlobURL from 'stream-to-blob-url';
import FileRender from 'component/fileRender';
import Thumbnail from 'component/common/thumbnail';
import LoadingScreen from 'component/common/loading-screen';

// Handle fullscreen change for the Windows platform
const win32FullScreenChange = () => {
  const win = remote.BrowserWindow.getFocusedWindow();
  if (process.platform === 'win32') {
    win.setMenu(document.webkitIsFullScreen ? null : remote.Menu.getApplicationMenu());
  }
};

class MediaPlayer extends React.PureComponent {
  static MP3_CONTENT_TYPES = ['audio/mpeg3', 'audio/mpeg'];
  static SANDBOX_TYPES = ['application/x-lbry', 'application/x-ext-lbry'];
  static FILE_MEDIA_TYPES = ['text', 'script', 'e-book', 'comic-book', 'document', '3D-file'];
  // static FILE_MEDIA_TYPES = [
  //   'video',
  //   'audio',
  //   'text',
  //   'script',
  //   'e-book',
  //   'comic-book',
  //   'document',
  //   '3D-file',
  // ];
  static SANDBOX_SET_BASE_URL = 'http://localhost:5278/set/';
  static SANDBOX_CONTENT_BASE_URL = 'http://localhost:5278';

  constructor(props) {
    super(props);

    this.state = {
      hasMetadata: false,
      startedPlaying: false,
      unplayable: false,
      fileSource: null,
    };

    // this.togglePlayListener = this.togglePlay.bind(this);
    // this.toggleFullScreenVideo = this.toggleFullScreen.bind(this);
  }

  componentDidMount() {
    if (this.isSupportedFile()) {
      this.renderFile();
    }
  }

  componentDidUpdate() {
    const { fileName, downloadPath, contentType } = this.props;
    const { fileSource } = this.state;

    if (!fileSource && fileName && downloadPath && contentType) {
      this.renderFile();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.togglePlayListener);
    const mediaElement = this.media.children[0];
    if (mediaElement) {
      mediaElement.removeEventListener('click', this.togglePlayListener);
    }
  }

  toggleFullScreen(event) {
    const mediaElement = this.media.children[0];
    if (mediaElement) {
      if (document.webkitIsFullScreen) {
        document.webkitExitFullscreen();
      } else {
        mediaElement.webkitRequestFullScreen();
      }
    }
  }

  togglePlay(event) {
    // ignore all events except click and spacebar keydown, or input events in a form control
    if (
      event.type === 'keydown' &&
      (event.code !== 'Space' || event.target.tagName.toLowerCase() === 'input')
    ) {
      return;
    }
    event.preventDefault();
    const mediaElement = this.media.children[0];
    if (mediaElement) {
      if (!mediaElement.paused) {
        mediaElement.pause();
      } else {
        mediaElement.play();
      }
    }
  }

  file() {
    const { downloadPath, fileName } = this.props;

    return {
      name: fileName,
      createReadStream: opts => fs.createReadStream(downloadPath, opts),
    };
  }

  playableType() {
    const { mediaType } = this.props;

    return ['audio', 'video'].indexOf(mediaType) !== -1;
  }

  supportedType() {
    // Files supported by render-media
    const { contentType, mediaType } = this.props;

    return (
      Object.values(player.mime).indexOf(contentType) !== -1 ||
      MediaPlayer.SANDBOX_TYPES.indexOf(contentType) > -1
    );
  }

  fileType() {
    // This files are supported using a custom viewer
    const { mediaType, contentType } = this.props;

    return (
      MediaPlayer.FILE_MEDIA_TYPES.indexOf(mediaType) > -1 ||
      MediaPlayer.SANDBOX_TYPES.indexOf(contentType) > -1
    );
  }

  renderFile() {
    // This is what render-media does with unplayable files
    const { claim, fileName, downloadPath, contentType, mediaType } = this.props;

    if (MediaPlayer.SANDBOX_TYPES.indexOf(contentType) > -1) {
      const outpoint = `${claim.txid}:${claim.nout}`;

      return fetch(`${MediaPlayer.SANDBOX_SET_BASE_URL}${outpoint}`)
        .then(res => res.text())
        .then(url => {
          const fileSource = { url: `${MediaPlayer.SANDBOX_CONTENT_BASE_URL}${url}` };
          return this.setState({ fileSource });
        });
    }

    // File to render
    const fileSource = {
      fileName,
      contentType,
      downloadPath,
      fileType: path.extname(fileName).substring(1),
      // // Readable stream from file
      // stream: opts => fs.createReadStream(downloadPath, opts),
    };

    this.setState({ fileSource });
  }

  renderAudio(container, autoplay) {
    if (container.firstChild) {
      container.firstChild.remove();
    }

    // clear the container
    const { downloadPath } = this.props;
    const audio = document.createElement('audio');
    audio.autoplay = autoplay;
    audio.controls = true;
    audio.src = downloadPath;
    container.appendChild(audio);
  }

  showLoadingScreen(isFileType, isPlayableType) {
    const { mediaType, contentType } = this.props;
    const { hasMetadata, unplayable, unsupported, fileSource } = this.state;

    const loader = {
      isLoading: false,
      loadingStatus: null,
    };

    // Loading message
    const noFileMessage = __('Waiting for blob.');
    const noMetadataMessage = __('Waiting for metadata.');

    // Error message
    const unplayableMessage = __("Sorry, looks like we can't play this file.");
    const unsupportedMessage = __("Sorry, looks like we can't preview this file.");

    // Files
    const isLoadingFile = !fileSource && isFileType;
    const isLbryPackage = /application\/x(-ext)?-lbry$/.test(contentType);
    const isUnsupported =
      !isLbryPackage && (!this.supportedType() && !isFileType && !isPlayableType);

    // Media (audio, video)
    const isUnplayable = isPlayableType && unplayable;
    const isLoadingMetadata = isPlayableType && (!hasMetadata && !unplayable);

    // Show loading message
    if (isLoadingFile || isLoadingMetadata) {
      loader.loadingStatus = isFileType ? noFileMessage : noMetadataMessage;
      loader.isLoading = true;

      // Show unsupported error message
    } else if (isUnsupported || isUnplayable) {
      loader.loadingStatus = isUnsupported ? unsupportedMessage : unplayableMessage;
    } else if (isLbryPackage && !isLoadingFile) {
      loader.loadingStatus = false;
    }

    return loader;
  }

  render() {
    const { mediaType, poster } = this.props;
    const { fileSource } = this.state;

    const isFileType = this.isSupportedFile();
    const isFileReady = fileSource && isFileType;

    return (
      <React.Fragment>
        {!isFileReady && <LoadingScreen status="loadingStatus" spinner />}
        {isFileReady && <FileRender source={fileSource} mediaType={mediaType} poster={poster} />}
      </React.Fragment>
    );
  }
}

export default MediaPlayer;
