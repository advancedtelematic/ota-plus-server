import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class SelectableListItem extends Component {
    render() {
        const { item, selected, onItemSelect, showDetails } = this.props;
        return (
            <div className="item"
                 id={ "button-select-" + item.type + '-' + item.name }
                 title={ item.name }
            >
                <button className={ "btn-checkbox " + (selected ? "checked" : "") }
                        id={ "item-select-" + item.type + '-' + item.name }
                        onClick={ onItemSelect.bind(this, item) }
                >
                    <i className="fa fa-check" aria-hidden="true"/>
                </button>
                <div className="item item__info"
                     onClick={ onItemSelect.bind(this, item) }
                >
                    <span className="name">{ item.name }</span>
                    <span className="description">{ item.description }</span>
                </div>
                {
                    showDetails &&
                        <div className="item item__details">
                            <a href="#" className="details-button" id={ "show-details-" + item.type + item.name }
                               onClick={ showDetails.bind(this, item) }>
                                <span>{ "Details" }</span>
                            </a>
                        </div>
                }
            </div>
        );
    }
}

SelectableListItem.propTypes = {
    item: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    onItemSelect: PropTypes.func.isRequired,
    showDetails: PropTypes.func,
};

export default SelectableListItem;