/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { Button, Checkbox } from 'antd';

@observer
class SelectableListItem extends Component {
  render() {
    const { item, selected, onChange, showDetails, sourceType } = this.props;

    return (
      <div className="item select-ecu-item" id={`button-select-${item.type}-${item.name}`} title={item.name}>
        <Checkbox
          checked={selected}
          id={`item-select-${item.type}-${item.name}`}
          onChange={e => onChange(item, e)}
          style={{ display: 'flex', marginLeft: '12px' }}
        >
          <div className="item item__info">
            <span className={`icon ${sourceType === 'external' ? 'icon--external' : 'icon--internal'}`} />
            <span className="name">{item.name}</span>
            <span className="description">{item.description}</span>
          </div>
        </Checkbox>
        {showDetails && (
          <div className="item item__details">
            <Button
              htmlType="button"
              className="details-button"
              id={`show-details-${item.type}${item.name}`}
              onClick={e => showDetails(item, e)}
            >
              <span>{'Details'}</span>
            </Button>
          </div>
        )}
      </div>
    );
  }
}

SelectableListItem.propTypes = {
  item: PropTypes.shape({}).isRequired,
  selected: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  sourceType: PropTypes.string,
  showDetails: PropTypes.func,
};

export default SelectableListItem;
