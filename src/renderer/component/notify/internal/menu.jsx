// @flow
import React from 'react';
import Button from 'component/button';
import NotifyTile from './notifyTile';

type Props = {
  onClearItems: () => void,
  onRemoveItem: number => void,
  items: Array<React.node>,
};

class Menu extends React.PureComponent<Props> {
  static defaultProps = {
    items: [],
  };

  render() {
    const { items, onClearItems, onRemoveItem } = this.props;
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
              onClick={() => {
                onClearItems();
              }}
            />
          </div>
        </div>
        <div className="menu__menu-items-container">
          {items.map((item, index) => (
            <div className="menu__menu-item" key={item.date}>
              <NotifyTile {...item} index={index} onDestroy={onRemoveItem} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Menu;
