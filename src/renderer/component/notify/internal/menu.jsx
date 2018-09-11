// @flow
import React from 'react';
import * as icons from 'constants/icons';
import classnames from 'classnames';
import NotifyTile from './notifyTile';
import Button from 'component/button';

type Props = {};

class Menu extends React.PureComponent<Props> {
  static defaultProps = {
    items: [],
    onOpen: () => {},
    onClose: () => {},
  };

  constructor(props) {
    super(props);
  }

  onItemClick(fevent) {
    if (fevent) {
      fevent();
      this.props.onClose();
    }
  }

  render() {
    const { items, show, onClose, onClear } = this.props;
    return (
      <div className="menu">
        <div className="menu__menu-header">
          <div className="menu_menu-tile">{__('Notifications')}</div>
          <div className="menu_menu-actions">
            <Button
              noPadding
              button="link"
              className=""
              label={__('Mark All as Read')}
              onClick={onClear}
            />
          </div>
        </div>
        <div className="menu__menu-items-container">
          {items.map((item, key) => (
            <div className="menu__menu-item" key={`menu-item${key}`}>
              <NotifyTile {...item} />
              <Button
                noPadding
                icon={icons.CLOSE}
                title={__('Remove notification')}
                button="link"
                className="btn--item-action"
                onClick={() => {}}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Menu;
