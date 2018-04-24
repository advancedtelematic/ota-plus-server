import React from 'react';

export const Form = ({id, formWidth = '100%', flexDirection = 'column', customStyles, children, onSubmit}) => {
    return <form className="c-form" method="POST" id={id || ''} style={{width: formWidth, flexDirection, ...customStyles}} onSubmit={onSubmit}>
        {children}
    </form>
};