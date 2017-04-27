import React, { Component, PropTypes } from 'react';
import { FormsyText } from 'formsy-material-ui/lib';

class SearchBar extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let timeout = undefined;
        const { value, changeAction, disabled, id } = this.props;
        return (
            <FormsyText
                name="filterValue"
                value={value}
                id={id}
                className="input-wrapper search"
                disabled={disabled}
                onChange={(e) => {
                    const filter = e.target.value;
                    if(timeout != undefined) {
                        clearTimeout(timeout);
                    }
                    timeout = setTimeout(() => {
                        timeout = undefined;
                        changeAction(filter);
                    }, 500);
                }}
                updateImmediately
            />
        );
    }
}

SearchBar.propTypes = {
    value: PropTypes.string,
    changeAction: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

SearchBar.defaultProps = {
    disabled: false
};

export default SearchBar;