/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { withTranslation, Trans } from 'react-i18next';
import Cookies from 'js-cookie';
import OTAModal from './OTAModal';

@observer
class SizeVerify extends Component {
  @observable sizeVerifyHidden = true;

  constructor(props) {
    super(props);
    this.checkboxRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.checkSize);
    this.checkSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkSize);
  }

  checkSize = () => {
    const { minWidth, minHeight } = this.props;
    this.sizeVerifyHidden = Cookies.get('sizeVerifyHidden') === '1'
      || (window.innerWidth >= minWidth && window.innerHeight >= minHeight);
  };

  handleClick = () => {
    const dontShowAgain = this.checkboxRef.current.checked;
    if (dontShowAgain) Cookies.set('sizeVerifyHidden', 1);
    this.sizeVerifyHidden = true;
  };

  render() {
    const { minWidth, minHeight, t } = this.props;
    const content = (
      <span className="body">
        <div className="desc" style={{ textAlign: 'left' }}>
          <Trans>
            {t('warnings.sizeverify.description_1', { width: minWidth, height: minHeight })}
          </Trans>
          {t('warnings.sizeverify.description_2')}
        </div>
        <div className="body-actions">
          <div className="wrapper-checkbox">
            <input type="checkbox" name="dontShowAgain" id="size-verify-dismiss" value="1" ref={this.checkboxRef} />
            &nbsp;
            <span>{t('warnings.sizeverify.dontshow')}</span>
          </div>
          <button type="button" id="size-verify-confirm" className="btn-primary" onClick={this.handleClick}>
            OK
          </button>
        </div>
      </span>
    );
    return (
      <OTAModal
        title={t('warnings.sizeverify.title')}
        content={content}
        visible={!this.sizeVerifyHidden}
        className="size-verify-modal"
      />
    );
  }
}

SizeVerify.propTypes = {
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  t: PropTypes.func.isRequired
};

SizeVerify.defaultProps = {
  minWidth: 1280,
  minHeight: 768,
};

export default withTranslation()(SizeVerify);
