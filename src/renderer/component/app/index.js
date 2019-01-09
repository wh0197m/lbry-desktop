import { connect } from 'react-redux';
import {
  selectPageTitle,
  selectHistoryIndex,
  selectActiveHistoryEntry,
  doUpdateBlockHeight,
  doError,
} from 'lbry-redux';
import { doRecordScroll } from 'redux/actions/navigation';
import { selectUser, doAuthenticate } from 'lbryinc';
import { selectThemePath } from 'redux/selectors/settings';
import { doDaemonReady } from 'redux/actions/app';
import App from './view';

const select = state =>
  console.log('APP', state) || {
    pageTitle: selectPageTitle(state),
    user: selectUser(state),
    currentStackIndex: selectHistoryIndex(state),
    currentPageAttributes: selectActiveHistoryEntry(state),
    theme: selectThemePath(state),
  };

const perform = dispatch => ({
  alertError: errorList => dispatch(doError(errorList)),
  recordScroll: scrollPosition => dispatch(doRecordScroll(scrollPosition)),
  updateBlockHeight: () => dispatch(doUpdateBlockHeight()),
  daemonReady: () => dispatch(doDaemonReady()),
  authenticate: version => dispatch(doAuthenticate(version)),
});

export default connect(
  select,
  perform
)(App);
