import React, { Component, PropTypes } from 'react';

class Switch extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { hardwareInfoShown, showHardwareInfo, showPackagesList } = this.props;
        return (
            <div className="wrapper-switch">
                <div className="fixed">
                    <div className={"show-hardware" + (hardwareInfoShown ? " active" : "")} id="show-hardware" onClick={showHardwareInfo.bind(this)}>
                        <img src="/assets/img/icons/chip.png" alt="Icon" />
                    </div>
                    <div className={"show-packages" + (!hardwareInfoShown ? " active" : "")} id="show-packages" onClick={showPackagesList.bind(this)}> 
                        <img src="/assets/img/icons/package_icon_dark.png" alt="Icon" />
                    </div>
                </div>
            </div>
        );
    }
}

export default Switch;