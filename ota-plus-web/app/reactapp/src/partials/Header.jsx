import React, { PropTypes, defaultProps } from 'react';

const Header = (props) => {
    const { title, subtitle, backButtonShown, backButtonAction, children, device } = props;
    return (
        <div className="page-heading">
            <div className="left-box">
                {backButtonShown ? 
                    <a href="#" id="back-button" className="back-button" onClick={backButtonAction}>
                        <i className="fa fa-angle-left"></i>
                    </a>
                : null}
                <div className="icon">
                    {device ? <div className={"device-status device-status--" + device.deviceStatus} id={"status-" + device.deviceStatus}></div> : ''}
                </div>
                <div className="text">
                    <div className="title">{title}</div>
                    {subtitle ?
                        <div className="subtitle">{subtitle}</div>
                    :
                        null
                    }
                </div>
            </div>
            <div className="right-box">
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