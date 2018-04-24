import React from 'react';
import eventHandler from './hoc/eventHandler';

const Dropdown = ({children, show, hideHandler, itemClass}) => {
    return show ? <ul className="submenu">
            {children}
        </ul> : null
}

export default eventHandler(Dropdown)