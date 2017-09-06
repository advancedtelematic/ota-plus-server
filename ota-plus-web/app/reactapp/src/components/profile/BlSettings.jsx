import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class BlSettings extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <main id="billing">
                <div className="title">
                    <img src="/assets/img/icons/black/billing.png" alt=""/>
                    Bl Settings
                </div>

                <hr />

                <span>Bl Settings</span>
            </main>
        );
    }
}

BlSettings.propTypes = {
};

export default BlSettings;