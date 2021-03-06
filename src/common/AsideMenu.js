import { faList as listIcon, faLink as createIcon, faTags as tagsIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { serverType } from '../servers/prop-types';
import './AsideMenu.scss';

const defaultProps = {
  className: '',
  showOnMobile: false,
};
const propTypes = {
  selectedServer: serverType,
  className: PropTypes.string,
  showOnMobile: PropTypes.bool,
};

const AsideMenu = (DeleteServerButton) => {
  const AsideMenu = ({ selectedServer, className, showOnMobile }) => {
    const serverId = selectedServer ? selectedServer.id : '';
    const asideClass = classnames('aside-menu', className, {
      'aside-menu--hidden': !showOnMobile,
    });
    const shortUrlsIsActive = (match, location) => location.pathname.match('/list-short-urls');

    return (
      <aside className={asideClass}>
        <nav className="nav flex-column aside-menu__nav">
          <NavLink
            className="aside-menu__item"
            activeClassName="aside-menu__item--selected"
            to={`/server/${serverId}/list-short-urls/1`}
            isActive={shortUrlsIsActive}
          >
            <FontAwesomeIcon icon={listIcon} />
            <span className="aside-menu__item-text">List short URLs</span>
          </NavLink>
          <NavLink
            className="aside-menu__item"
            activeClassName="aside-menu__item--selected"
            to={`/server/${serverId}/create-short-url`}
          >
            <FontAwesomeIcon icon={createIcon} flip="horizontal" />
            <span className="aside-menu__item-text">Create short URL</span>
          </NavLink>

          <NavLink
            className="aside-menu__item"
            activeClassName="aside-menu__item--selected"
            to={`/server/${serverId}/manage-tags`}
          >
            <FontAwesomeIcon icon={tagsIcon} />
            <span className="aside-menu__item-text">Manage tags</span>
          </NavLink>

          <DeleteServerButton
            className="aside-menu__item aside-menu__item--danger"
            server={selectedServer}
          />
        </nav>
      </aside>
    );
  };

  AsideMenu.defaultProps = defaultProps;
  AsideMenu.propTypes = propTypes;

  return AsideMenu;
};

export default AsideMenu;
