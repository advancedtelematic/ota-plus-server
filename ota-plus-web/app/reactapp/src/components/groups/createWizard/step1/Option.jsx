import React from 'react';

const Option = ({ selectOption, isSelected, title, teaser }) => {
    return (
        <div className="wizard__option" onClick={ () => { selectOption() } }>
            <div className="wizard__select">
                <button id={ `wizard__${title}-checkbox` } className={ "btn-radio" + (isSelected ? ' checked' : '') }
                        />
                <div className="wizard__select-title">
                    { title }
                </div>
            </div>
            <div className="wizard__teaser" id={ `wizard__teaser-${title}` }>
                { teaser }
            </div>
        </div>
    );
};

export default Option;