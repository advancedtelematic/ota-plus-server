import React, { Component, PropTypes } from 'react';
import { SearchBar, FormInput, FormSelect } from '../../partials';
import { Form } from 'formsy-react';

const nameFilterOptions = [{value: "deviceid", text: "VIN"}];
const extraFilterOptions = ["contains"];

const SmartFilters = ({ devicesView = false, className, layout, setFilter }) => {
    return (
        <div className={"filters " + (className ? className : '')}>
			<div className="filters__block" style={{flex: layout[0]}} >
				<FormSelect
                    id="name-filter"
                    appendMenuToBodyTag={true}
                    options={nameFilterOptions}
                    multiple={false}
                    visibleFieldsCount={5}
                    name="nameFilter"
                    onChange={(value) => { setFilter('name', value.value) }}
                />
        	</div>
        	<div className="filters__block" style={{flex: layout[1]}} >
				<FormSelect
                    id="expression-filter"
                    appendMenuToBodyTag={true}
                    options={extraFilterOptions}
                    multiple={false}
                    visibleFieldsCount={5}
                    name="expressionFilter"
                    onChange={(value) => { setFilter('expression', value) }}
                />
    		</div>
    		<div className="filters__block" style={{flex: layout[2]}} >
                {devicesView ?
                    <Form>
                        <SearchBar 
                            value={''}
                            changeAction={() => {}}
                            id="search-devices-input"
                            name="word"
                        />
                    </Form>
                :
                    <FormInput
                        id="word"
                        name="word"
                        className="input-wrapper"
                        placeholder={"Type here"}
                        onChange={(e) => { setFilter('word', e.target.value) }}
                    />
                }
    		</div>
    		<div className="filters__block filters__block--fake" id="filter-minus">
        		-
    		</div>
    		<div className="filters__block filters__block--fake" id="filter-plus">
        		+
    		</div>
        </div>
    );
}

export default SmartFilters;