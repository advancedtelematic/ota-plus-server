import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { _contains } from "../../utils/Collection";
import SelectableListItem from './SelectableListItem';

const headerHeight = 28;

@observer
class SelectableList extends Component {
    render() {
        const {
            items,
            selectedItems,
            onItemSelect,
        } = this.props;
        return (
            <div className="ios-list" ref="list">
                { items ?
                     _.map(items, item => {
                        const isSelected = _contains(selectedItems, item);
                        return (
                            <SelectableListItem
                                key={item}
                                item={item}
                                onItemSelect={onItemSelect}
                                selected={isSelected}
                            />
                        );
                    })
                :
                    <span className="content-empty">
                        <div className="wrapper-center">
                            { "No matching items found." }
                        </div>
                    </span>
                }
            </div>
        );
    }
}

/**
 * takes array of objects to map them to be selectable items
 * toDo: `selectedItems` actually are objects in an array but somehow component always detect an object has passed to
 * @type {{items: React.Validator<any>, selectedItems: React.Validator<any>, onItemSelect: React.Validator<any>}}
 */

SelectableList.propTypes = {
    items: PropTypes.array.isRequired,
    selectedItems: PropTypes.object.isRequired,
    onItemSelect: PropTypes.func.isRequired,
};

export default SelectableList;