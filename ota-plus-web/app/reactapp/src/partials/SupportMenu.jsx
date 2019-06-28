import React, { useState } from 'react';
import { LINK_BUTTON_ICON } from '../config';

const SupportMenu = () => {
  const [hidden, setHidden] = useState(true);
  return (
    <>
      <div className={`support-menu ${!hidden ? 'support-menu--expanded' : null}`} id="support-menu">
        <div className="support-menu-header" onClick={() => setHidden(!hidden)}>
          <div className="support-menu-header__separator" />
          {hidden && (
            <span className="support-menu-header__arrows--left">{'<<'}</span>
          )}
          {'SUPPORT'}
          {!hidden && (
            <span className="support-menu-header__arrows--right">{'>>'}</span>
          )}
        </div>
        <div className="support-menu-body" id="support-menu-body">
          <ul className="support-menu-links">
            <li className="support-menu-links__link">
              <a href="https://docs.ota.here.com/quickstarts/start-intro.html" rel="noopener noreferrer" target="_blank" id="get-started-link">
                {'Get Started'}
                <img src={LINK_BUTTON_ICON} alt="Icon" />
              </a>
            </li>
            <li className="support-menu-links__link">
              <a href="https://docs.ota.here.com" rel="noopener noreferrer" target="_blank" id="docs-link">
                {'Documentation'}
                <img src={LINK_BUTTON_ICON} alt="Icon" />
              </a>
            </li>
            <li className="support-menu-links__link">
              <a href="mailto:otaconnect.support@here.com" id="support-link">
                {'Contact Support'}
                <img src={LINK_BUTTON_ICON} alt="Icon" />
              </a>
            </li>
          </ul>
          <div className="support-menu-body__separator" />
        </div>
      </div>
      {!hidden && <div className="support-menu-mask" id="support-menu-mask" onClick={() => setHidden(!hidden)} />}
    </>
  );
};

export default SupportMenu;
