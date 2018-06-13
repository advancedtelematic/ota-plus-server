import React, { PropTypes, defaultProps } from 'react';

const Header = (props) => {
    const { title, subtitle, backButtonShown, backButtonAction, children, device } = props;
    return (
        <div className="page-header">
            <div className="page-header__left">
                {backButtonShown ? 
                    <a href="#" id="back-button" className="page-header__back" onClick={backButtonAction}>
                        <i className="fa fa-angle-left"></i>
                    </a>
                : null}
                <div className="page-header__icon">
                    {device ? <div className={"device-status device-status--" + device.deviceStatus} id={"status-" + device.deviceStatus}></div> : ''}
                </div>
                <div className="page-header__text">
                    <div className="page-header__title">{title}</div>
                    {subtitle ?
                        <div className="page-header__subtitle">{subtitle}</div>
                    :
                        null
                    }
                </div>
            </div>
            <div className="page-header__right">
                {children}
            </div>
        </div>
    );
}

Header.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.object,
    ]),
    subtitle: PropTypes.any,
    backButtonShown: PropTypes.bool,
    backButtonAction: PropTypes.func,
    children: PropTypes.object,
}

Header.defaultProps = {
    backButtonShown: false,
}

export default Header;