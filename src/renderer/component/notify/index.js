import { connect } from 'react-redux';
import {
  doNotifyStack,
  doRemoveNotification,
  doClearNotifyStack,
  selectNotifications,
} from 'lbry-redux';
import Notify from './view';

const select = state => ({
  notifications: selectNotifications(state),
});

const perform = dispatch => ({
  doNotifyStack: notifyData => dispatch(doNotifyStack(notifyData)),
  doClearNotifyStack: () => dispatch(doClearNotifyStack()),
  doRemoveNotification: index => dispatch(doRemoveNotification(index)),
});

export default connect(
  select,
  perform
)(Notify);
