import React, { Component, PropTypes } from 'react';

const Header = ({ showCreateGroupModal }) => {
    return (
        <div className="groups-panel__header">
            <div className="groups-panel__title">
                Groups
            </div>
            <a href="#" className="add-button light" id="add-new-group" onClick={showCreateGroupModal}>
                <span>
                    +
                </span>
                <span>
                    Add group
                </span>
            </a>
        </div>
    );
}

Header.propTypes = {
    showCreateGroupModal: PropTypes.func.isRequired,
}

export default Header;