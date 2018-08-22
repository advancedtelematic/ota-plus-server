import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { VelocityTransitionGroup } from 'velocity-react';
import SelectableListItem from './SelectableListItem';
import { Loader } from '../index';

const headerHeight = 28;

@observer
class SelectableList extends Component {
    render() {
        const {
            items,
            selectedItems,
            onItemSelect
        } = this.props;
        return (
            <div className="ios-list" ref="list">
                { items ?
                     _.map(items, item => {
                        const isSelected = _.includes(selectedItems, item);
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

SelectableList.propTypes = {
    items: PropTypes.object,
    onItemSelect: PropTypes.func,
};

export default SelectableList;