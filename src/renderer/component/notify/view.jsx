// @flow
import React from 'react';
import Button from 'component/button';
import Menu from './internal/menu';
import * as NOTIFICATION_TYPES from 'constants/notification_types';
import * as icons from 'constants/icons';
import classnames from 'classnames';

type Props = {
  currentTheme: string,
};

class Notify extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.menu = React.createRef();
    this.state = {
      open: false,
    };

    const d = new Date();
    const fakeDate = d.toISOString();
    const fakeDate2 = '2018-09-08T15:34:45Z';

    // Test
    this.list = [
      {
        icon: icons.ALERT,
        title: 'Important news!',
        date: fakeDate,
        type: 'info',
      },
      {
        icon: icons.DOWNLOAD,
        title: 'New update: 0.26.1',
        date: fakeDate2,
        type: 'info',
      },
      {
        uri: 'lbry://ApexNetwork#60fc935d7e1b58e9ab19b4549381670df8f5916d',
        action: 'published',
        date: fakeDate,
        type: 'channel_updated',
      },
    ];
  }

  // ClearStack
  clear() {
    this.list = [];
    this.closeMenu();
  }

  toggleMenu = event => {
    this.setState(prevState => ({ open: !prevState.open }));
  };

  closeMenu() {
    this.setState({ open: false });
  }

  render() {
    const { open } = this.state;
    const count = this.list.length || 0;

    return (
      <div className="notify">
        <Button
          noPadding
          icon={icons.NOTIFICATION}
          button="alt"
          className="btn--notify"
          onClick={this.toggleMenu}
        >
          {count > 0 && <span className="btn--notify__badge">{count}</span>}
        </Button>
        <div
          ref={this.menu}
          className={classnames('menu-wrapper', { 'menu-wrapper-active': open })}
        >
          <Menu
            items={this.list}
            onClose={this.closeMenu.bind(this)}
            onClear={this.clear.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default Notify;
