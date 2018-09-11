// @flow
import React from 'react';
import moment from 'moment';
import Icon from 'component/common/icon';
import * as icons from 'constants/icons';
import Button from 'component/button';
import FileTile from 'component/fileTile';
import UriIndicator from 'component/uriIndicator';
import TruncatedText from 'component/common/truncated-text';
import { isURIValid, normalizeURI, parseURI } from 'lbry-redux';

type Props = {};

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

class NotifyTile extends React.PureComponent<Props> {
  render() {
    const { icon, title } = this.props;
    const date = this.props.date && moment(this.props.date).fromNow();

    let message = (
      <div className="notify-message">
        <div className="title">
          <TruncatedText lines={2}>{title}</TruncatedText>
        </div>
        {date && <div className="subtitle">{date}</div>}
      </div>
    );

    if (this.props.type === 'channel_updated') {
      message = <ChannelMessage {...this.props} />;
    }

    return (
      <div className="notify-tile">
        {icon && (
          <div className="notify-icon">
            <Icon icon={icon} size={32} />
          </div>
        )}
        {message}
      </div>
    );
  }
}

export default NotifyTile;
