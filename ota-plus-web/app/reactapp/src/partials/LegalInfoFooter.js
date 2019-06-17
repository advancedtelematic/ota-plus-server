import React from 'react';

const LegalInfoFooter = () => (
  <div className="legal-info-footer">
    <div className="menu-container">
      <a
        className="menu-text"
        href="https://legal.here.com/en-gb/terms"
        id="footer-service-terms-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {'Service terms'}
      </a>
      <div className="divider" />
      <a
        className="menu-text"
        href="https://legal.here.com/en-gb/privacy"
        id="footer-privacy-policy-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {'Privacy policy'}
      </a>
      <div className="divider" />
      <a
        className="menu-text"
        href="mailto:otaconnect.support@here.com"
        id="footer-contact-us-link"
      >
        {'Contact us'}
      </a>
    </div>
    <div className="company-container">
      <div className="company-text">@ 2019 HERE</div>
    </div>
  </div>
);

export default LegalInfoFooter;
