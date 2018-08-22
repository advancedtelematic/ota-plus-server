import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class SelectableListItem extends Component {
    render() {
        const { item, selected, onItemSelect } = this.props;
        return (
            <div className="item"
                 id={ "button-" + item }
                 title={item}
                 onClick={onItemSelect.bind(this, item)}
            >
                <button className={ "btn-checkbox " + (selected ? " checked" : "") }
                        id={"item-select-" + item }
                >
                    <i className="fa fa-check" aria-hidden="true"/>
                </button>
                <div className="info">
                    <span className="name">{ item }</span>
                </div>
            </div>
        );
    }
}

SelectableListItem.propTypes = {
    item: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onItemSelect: PropTypes.func.isRequired,
};

export default SelectableListItem;