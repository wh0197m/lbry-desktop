// @flow
import React from 'react';
import moment from 'moment';
import { isURIValid, normalizeURI } from 'lbry-redux';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';
import Button from 'component/button';
import FileTile from 'component/fileTile';
import UriIndicator from 'component/uriIndicator';
import TruncatedText from 'component/common/truncated-text';

const ChannelMessage = props => {
  const { action } = props;
  const isValid = props.uri && isURIValid(props.uri);
  const uri = isValid ? normalizeURI(props.uri) : false;

  return (
    <div className="notify-message">
      <div className="title">
        {uri && (
          <span className="file-tile__channel">
            <UriIndicator uri={uri} link />
          </span>
        )}
        {action}
      </div>
      {uri && (
        <FileTile
          uri={uri}
          size="small"
          displayDescription={false}
          displayChannel={false}
          displayDate
        />
      )}
    </div>
  );
};

type Props = {
  uri?: string,
  icon?: string,
  title?: string,
};

class NotifyTile extends React.PureComponent<Props> {
  render() {
    const { icon, title, message, onDestroy, index } = this.props;
    const date = this.props.date && moment(this.props.date).fromNow();

    // Default notification message
    let notifyMessage = (
      <div className="notify-message">
        <div className="title">
          <TruncatedText lines={2}>{message}</TruncatedText>
        </div>
        {date && <div className="subtitle">{date}</div>}
      </div>
    );

    if (this.props.type === 'channel_updated') {
      notifyMessage = <ChannelMessage {...this.props} />;
    }

    return (
      <div className="notify-tile">
        {icon && (
          <div className="notify-icon">
            <Icon icon={icon} size={32} />
          </div>
        )}
        {notifyMessage}
        <Button
          noPadding
          icon={ICONS.CLOSE}
          title={__('Remove notification')}
          button="link"
          className="btn--item-action"
          onClick={() => onDestroy(index)}
        />
      </div>
    );
  }
}

export default NotifyTile;
