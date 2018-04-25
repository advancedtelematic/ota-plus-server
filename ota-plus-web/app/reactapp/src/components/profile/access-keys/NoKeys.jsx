import React, { Component, PropTypes } from 'react';

class NoKeys extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { showTooltip } = this.props;
        return (
            <div className="profile-container-empty">
                <div className="wrapper-center">
                    <div className="page-intro">
                        <div className="no-access-keys">
                            You haven't created any keys yet.
                        </div>
                        <div>
                            <a href="#" className="add-button access-keys-tooltip" onClick={showTooltip.bind(this)}>What is this?</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NoKeys;