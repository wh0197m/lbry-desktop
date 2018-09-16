// @flow
import React from 'react';
import * as ICONS from 'constants/icons';
import * as NOTIFICATIONS from 'constants/notification_types';
import Button from 'component/button';
import Menu from './internal/menu';

type Props = {
  doClearNotifyStack: () => void,
  doRemoveNotification: number => void,
  doNotifyStack: ({ message: string, id: string }) => void,
  notifications: {
    type: string,
  },
};

class Notify extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.menu = React.createRef();
    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    // Test notify
    const { doNotifyStack } = this.props;
    // Simple test
    doNotifyStack({
      id: NOTIFICATIONS.PUBLISHED,
      message: 'Test',
    });
  }

  // ClearStack
  clearMenu = () => {
    const { doClearNotifyStack } = this.props;
    doClearNotifyStack();
    this.closeMenu();
  };

  toggleMenu = () => {
    this.setState(prevState => ({ open: !prevState.open }));
  };

  closeMenu = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    const { notifications, doRemoveNotification } = this.props;

    // Get notifications
    const notifyStack = notifications.map(n => n.notification);

    // Badge number
    const count = notifyStack.length;

    return (
      <div className="notify">
        <Button
          noPadding
          icon={ICONS.NOTIFICATION}
          button="alt"
          className="btn--notify"
          onClick={this.toggleMenu}
          disabled={count === 0}
        >
          {count > 0 && <span className="btn--notify__badge">{count}</span>}
        </Button>
        {open && (
          <Menu
            items={notifyStack}
            onRemoveItem={doRemoveNotification}
            onClearItems={this.clearMenu}
          />
        )}
      </div>
    );
  }
}

export default Notify;
