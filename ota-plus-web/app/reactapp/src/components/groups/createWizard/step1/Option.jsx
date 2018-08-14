import React, { Component, PropTypes } from 'react';

const Option = ({ selectOption, isSelected, title, teaser }) => {
    return (
        <div className="wizard__option">
        	<div className="wizard__select">
        		<button className={"btn-radio" + (isSelected ? ' checked' : '')} onClick={() => { selectOption() }}/>
        		<div className="wizard__select-title" id={`wizard__select-${title}`}>
        			{title}
        		</div>
        	</div>
        	<div className="wizard__teaser" id={`wizard__teaser-${title}`}>
        		{teaser}
        	</div>
        </div>
    );
}

export default Option;