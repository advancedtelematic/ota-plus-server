import React, { Component, PropTypes } from 'react';

class Switch extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { showPackagesList, showPackagesDetails, shouldShowPackagesDetails } = this.props;
        return (
            <div className={"wrapper-switch" + (!shouldShowPackagesDetails ? " negative-margin-top" : "")}>
                <div className={"show-details" + (shouldShowPackagesDetails ? " active" : "")} id="show-details" onClick={showPackagesDetails}>
                    <img src="/assets/img/icons/info_icon_single.png" alt="" />
                </div>
                <div className={"show-packages" + (!shouldShowPackagesDetails ? " active" : "")} id="show-packages" onClick={showPackagesList}> 
                    <img src="/assets/img/icons/package_icon_dark.png" alt="" />
                </div>
            </div>
        );
    }
}

export default Switch;