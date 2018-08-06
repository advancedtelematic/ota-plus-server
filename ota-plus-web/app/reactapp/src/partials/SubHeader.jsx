import React, { PropTypes } from 'react';

const SubHeader = (props) => {
    return (
        <div className={"subheader " + (props.className ? props.className : '')} style={props.shouldSubHeaderBeHidden ? {'display': 'none'} : null}>
            {props.children}
        </div>
    );
}

export default SubHeader;