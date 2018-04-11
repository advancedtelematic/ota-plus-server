import React, { Component, PropTypes } from 'react';

const NoItems = ({itemName, create = null}) => {
    return (
        <div className="no-items">
            <span>
                No {itemName}s to show
            </span>
            <a href="#" className="add-button" onClick={create}>
                Create a new {itemName}
            </a>
        </div>
    );
}

export default NoItems;