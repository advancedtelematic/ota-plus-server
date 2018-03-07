import React from 'react';

export const Form = ({id, formWidth = '100%', flexDirection = 'column', customStyles, children}) => {
    return <form className="c-form" id={id || ''} style={{width: formWidth, flexDirection, ...customStyles}}>
        {children}
    </form>
};