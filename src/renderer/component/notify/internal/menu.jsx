// @flow
import React from 'react';
import Button from 'component/button';
import NotifyTile from './notifyTile';

type Props = {
  onClose: () => void,
  onClearItems: () => void,
  onRemoveItem: number => void,
  items: Array<React.node>,
};

class Menu extends React.PureComponent<Props> {
  static KEYS = {
    ESC: 'Escape',
    TAB: 'Tab',
  };

  static defaultProps = {
    items: [],
  };
  constructor(props) {
    super(props);
    this.menuRef = React.createRef();
  }

  componentDidMount() {
    const menu = this.menuRef.current;
    menu.focus();

    document.addEventListener('click', this.handleClick);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  isMenuActive = () => {
    const menu = this.menuRef.current;
    return document.activeElement === menu;
  };

  handleClick = () => {
    const { onClose } = this.props;
    !this.isMenuActive() && onClose();
  };

  handleKeyDown = e => {
    const { ESC, TAB } = Menu.KEYS;
    const { onClose } = this.props;
    if (e.key === TAB || e.key === ESC) {
      onClose();
    }
  };

  render() {
    const { items, onClearItems, onRemoveItem } = this.props;
    return (
      <div className="menu" role="menu" tabIndex="-1" ref={this.menuRef} onClick={this.handleClick}>
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
            <div className="menu__menu-item" role="menuitem" key={item.date}>
              <NotifyTile {...item} index={index} onDestroy={onRemoveItem} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Menu;
