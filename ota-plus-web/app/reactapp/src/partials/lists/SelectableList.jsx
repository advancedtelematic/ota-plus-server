/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import { contains } from '../../utils/Helpers';
import SelectableListItem from './SelectableListItem';

@observer
class SelectableList extends Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  render() {
    const { items, selectedItems, onItemSelect } = this.props;
    return (
      <div className="ios-list" ref={this.listRef}>
        {items ? (
          _.map(items, (item) => {
            const isSelected = contains(selectedItems, item);
            return <SelectableListItem key={item} item={item} onItemSelect={onItemSelect} selected={isSelected} />;
          })
        ) : (
          <span className="content-empty">
            <div className="wrapper-center">{'No matching items found.'}</div>
          </span>
        )}
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
  items: PropTypes.shape({}).isRequired,
  selectedItems: PropTypes.shape({}).isRequired,
  onItemSelect: PropTypes.func.isRequired,
};

export default SelectableList;
