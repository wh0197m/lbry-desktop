// @flow
import * as React from 'react';
import CardMedia from 'component/cardMedia';
import TruncatedText from 'component/common/truncated-text';
import classnames from 'classnames';
import SubscribeButton from 'component/subscribeButton';
import type { Claim } from 'types/claim';

type Props = {
  uri: string,
  isResolvingUri: boolean,
  isSearchResult: boolean,
  totalItems: number,
  size: string,
  claim: ?Claim,
  resolveUri: string => void,
  navigate: (string, ?{}) => void,
  buttonStyle: string,
};

class ChannelTile extends React.PureComponent<Props> {
  static defaultProps = {
    size: 'regular',
  };

  componentDidMount() {
    const { uri, resolveUri } = this.props;

    resolveUri(uri);
  }

  componentWillReceiveProps(nextProps: Props) {
    const { uri, resolveUri } = this.props;

    if (nextProps.uri !== uri) {
      resolveUri(uri);
    }
  }

  render() {
    const {
      claim,
      navigate,
      isResolvingUri,
      isSearchResult,
      totalItems,
      uri,
      size,
      buttonStyle,
    } = this.props;

    let channelName;
    let subscriptionUri;
    if (claim) {
      channelName = claim.name;
      subscriptionUri = `lbry://${claim.permanent_url}`;
    }

    const onClick = () => navigate('/show', { uri });

    return (
      <section
        onClick={onClick}
        role="button"
        className={classnames('media-tile card--link', {
          'media--search-result': isSearchResult,
          'media--small': size === 'small',
          'media--large': size === 'large',
        })}
      >
        <CardMedia title={channelName} thumbnail={null} />
        <div className="media__info">
          {isResolvingUri && <div className="media__title">{__('Loading...')}</div>}
          {!isResolvingUri && (
            <React.Fragment>
              <div className="media__title">
                <TruncatedText text={channelName || uri} lines={1} />
              </div>
              <div className="media__subtitle">
                {totalItems > 0 && (
                  <span>
                    {totalItems} {totalItems === 1 ? 'file' : 'files'}
                  </span>
                )}
                {!isResolvingUri && !totalItems && <span>This is an empty channel.</span>}
              </div>
            </React.Fragment>
          )}
          {subscriptionUri && (
            <div className="media__actions">
              <SubscribeButton buttonStyle="inverse" uri={subscriptionUri} />
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default ChannelTile;
