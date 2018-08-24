import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class SelectableListItem extends Component {
    render() {
        const { item, selected, onItemSelect } = this.props;
        return (
            <div className="item"
                 id={ "button-select-" + item.type + '-' + item.name }
                 title={ item.name }
                 onClick={ onItemSelect.bind(this, item) }
            >
                <button className={ "btn-checkbox " + (selected ? "checked" : "") }
                        id={ "item-select-" + item.type + '-' + item.name }
                >
                    <i className="fa fa-check" aria-hidden="true"/>
                </button>
                <div className="info">
                    <span className="name">{ item.name }</span>
                </div>
            </div>
        );
    }
}

/**
 * takes item as object and make it selectable, item should contain `name` and `type` ('hardware'|'packages'|'update')
 * toDo: implements optional property 'details'
 * @type {{item: React.Validator<any>, selected: React.Validator<any>, onItemSelect: React.Validator<any>}}
 */

SelectableListItem.propTypes = {
    item: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    onItemSelect: PropTypes.func.isRequired,
};

export default SelectableListItem;