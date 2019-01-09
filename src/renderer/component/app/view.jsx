// @flow
import React from 'react';
import Router from 'component/router/index';
import ModalRouter from 'modal/modalRouter';
import ReactModal from 'react-modal';
import throttle from 'util/throttle';
import SideBar from 'component/sideBar';
import Header from 'component/header';
import { openContextMenu } from '../../util/context-menu';
import pjson from 'package.json';
import SplashScreen from 'component/splash';

const TWO_POINT_FIVE_MINUTES = 1000 * 60 * 2.5;

type Props = {
  alertError: (string | {}) => void,
  recordScroll: number => void,
  currentStackIndex: number,
  currentPageAttributes: { path: string, scrollY: number },
  pageTitle: ?string,
  theme: string,
  updateBlockHeight: () => void,
};

class App extends React.PureComponent<Props> {
  constructor() {
    super();
    this.state = {
      launching: true,
    };
    this.mainContent = undefined;
    (this: any).scrollListener = this.scrollListener.bind(this);
  }

  componentDidMount() {
    const { alertError, theme, updateBlockHeight, daemonReady } = this.props;

    // TODO: create type for this object
    // it lives in jsonrpc.js
    document.addEventListener('unhandledError', (event: any) => {
      alertError(event.detail);
    });

    // $FlowFixMe
    document.documentElement.setAttribute('data-theme', theme);

    const mainContent = document.getElementById('content');
    this.mainContent = mainContent;

    if (this.mainContent) {
      this.mainContent.addEventListener('scroll', throttle(this.scrollListener, 750));
    }

    ReactModal.setAppElement('#window'); // fuck this

    updateBlockHeight();
    setInterval(() => {
      updateBlockHeight();
    }, TWO_POINT_FIVE_MINUTES);
  }

  componentDidUpdate(prevProps: Props) {
    const { currentStackIndex: prevStackIndex, theme: prevTheme } = prevProps;
    const { currentStackIndex, currentPageAttributes, theme, pageTitle } = this.props;

    this.setTitleFromProps(pageTitle);

    if (this.mainContent && currentStackIndex !== prevStackIndex && currentPageAttributes) {
      this.mainContent.scrollTop = currentPageAttributes.scrollY || 0;
    }

    if (prevTheme !== theme) {
      // $FlowFixMe
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  componentWillUnmount() {
    if (this.mainContent) {
      this.mainContent.removeEventListener('scroll', this.scrollListener);
    }
  }

  setTitleFromProps = (title: ?string) => {
    window.document.title = title || 'LBRY';
  };

  scrollListener() {
    const { recordScroll } = this.props;

    if (this.mainContent) {
      recordScroll(this.mainContent.scrollTop);
    }
  }

  mainContent: ?HTMLElement;

  render() {
    console.log('this.sate', this.state.launching);
    return (
      <div id="window" onContextMenu={e => openContextMenu(e)}>
        {this.state.loading ? (
          <SplashScreen
            authenticate={() => this.props.authenticate(pjson.version)}
            onReadyToLaunch={() => {
              console.log('ready to launch!');
              this.props.daemonReady();
              this.setState({ loading: false });
            }}
          />
        ) : (
          <React.Fragment>
            {' '}
            <Header />
            <main className="page">
              <SideBar />
              <div className="content" id="content">
                <Router />
                <ModalRouter />
              </div>
            </main>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default App;
