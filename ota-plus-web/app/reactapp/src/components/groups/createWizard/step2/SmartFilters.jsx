import React, { Component, PropTypes } from 'react';
import { SearchBar, FormInput, FormSelect } from '../../../../partials';
import { Form } from 'formsy-react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import mobx from 'mobx';
import _ from 'underscore';

const nameFilterOptions = ["device ID"];
const extraFilterOptions = ["contains"];

let singleGroup = {
    id: 1,
    name: "deviceid",
    expression: "contains",
    word: ''
};


@observer
class SmartFilters extends Component {
    @observable lastGivenId = 1;
    @observable groups = [singleGroup];

    addFilter = (event) => {
        if (event) {
            event.preventDefault();
        }
        this.lastGivenId += 1;
        singleGroup.id = this.lastGivenId;
        this.groups.push(singleGroup)
    };

    removeFilter(id) {
        if (this.groups.length > 1) {
            this.groups = _.filter(this.groups, el => el.id !== id);
        }
    }

    render() {
        const { devicesView = false, layout, setFilter } = this.props;

        const Filters = this.groups.map(group => {
            return (
                <div key={ group.id } className={ "filters" }>
                    <div className="filters__block" style={ { flex: layout[0] } }>
                        <FormSelect
                            id="name-filter"
                            placeholder="Data"
                            appendMenuToBodyTag={ true }
                            options={ nameFilterOptions }
                            multiple={ true }
                            visibleFieldsCount={ 5 }
                            name="nameFilter"
                            onChange={ () => {
                            } }
                        />
                    </div>
                    <div className="filters__block" style={ { flex: layout[1] } }>
                        <FormSelect
                            id="expression-filter"
                            placeholder="Filter"
                            appendMenuToBodyTag={ true }
                            options={ extraFilterOptions }
                            multiple={ true }
                            visibleFieldsCount={ 5 }
                            name="expressionFilter"
                            onChange={ () => {
                            } }
                        />
                    </div>
                    <div className="filters__block" style={ { flex: layout[2] } }>
                        { devicesView ?
                            <Form>
                                <SearchBar
                                    value={ '' }
                                    onChange={ (e) => {
                                        setFilter('word', e.target.value)
                                    } }
                                    id="search-devices-input"
                                    name="word"
                                />
                            </Form>
                            :
                            <FormInput
                                id="word"
                                name="word"
                                className="input-wrapper"
                                placeholder={ "Type here" }
                                onChange={ () => {
                                } }
                            />
                        }
                    </div>
                    <button className="filters__block filters__block--fake btn-plain"
                            id="filter-remove"
                            onClick={ this.removeFilter.bind(this, group.id) }>{ "-" }</button>
                    <button className="filters__block filters__block--fake btn-plain"
                            id="filter-add" onClick={ this.addFilter }>{ "+" }</button>
                </div>
            )
        });

        return (
            <div>
                <span>{ Filters }</span>
            </div>


        );
    }

}


export default SmartFilters;