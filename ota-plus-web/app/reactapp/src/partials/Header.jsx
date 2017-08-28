import React, { PropTypes, defaultProps } from 'react';

const Header = (props) => {
    const { title, subtitle, backButtonShown, backButtonAction, children } = props;
    return (
        <div className="page-heading">
            <div className="container">
                {backButtonShown ? 
                    <a href="#" id="back-button" className="back-button" onClick={backButtonAction}>
                        <img src="/assets/img/icons/back.png" className="icon-back" alt="" />
                    </a>
                : null}
                <div className="icon"></div>
                <div className="text">
                    <div className="title">{title}</div>
                    {subtitle ?
                        <div className="subtitle">{subtitle}</div>
                    :
                        null
                    }
                </div>
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