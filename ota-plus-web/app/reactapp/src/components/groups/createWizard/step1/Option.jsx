import React, { Component, PropTypes } from 'react';

const Option = ({ selectOption, isSelected, title, teaser }) => {
    return (
        <div className="wizard__option">
        	<div className="wizard__select">
        		<button className={"btn-radio" + (isSelected ? ' checked' : '')} onClick={() => { selectOption() }}></button>
        		<div className="wizard__select-title">
        			{title}
        		</div>
        	</div>
        	<div className="wizard__teaser">
        		{teaser}
        	</div>
        </div>
    );
}

export default Option;