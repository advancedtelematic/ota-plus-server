import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

const MinimizedBox = observer(({ name, actions }) => {
    return (
        <div className="minimized__box">
            <div className="minimized__name">
                {name}
            </div>
            <div className="minimized__actions">
                {actions}
            </div>
        </div>
    );
})

export default MinimizedBox;