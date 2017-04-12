import React, { Component, PropTypes } from 'react';

@observer
class Switch extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="wrapper-switch">
                <div className="show-details active">
                    <img src="/assets/img/icons/info_icon_single.png" alt="" />
                </div>
                <div className="show-packages"> 
                    <img src="/assets/img/icons/package_icon_dark.png" alt="" />
                </div>
            </div>
        );
    }
}

export default Switch