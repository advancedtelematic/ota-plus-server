import React, { Component, PropTypes } from 'react';
import { SearchBar, FormInput, FormSelect } from '../../partials';
import { Form } from 'formsy-react';

const nameFilterOptions = ["deviceid"];
const extraFilterOptions = ["contains"];

const SmartFilters = ({ devicesView = false, className, layout }) => {
    return (
        <div className={"filters " + (className ? className : '')}>
			<div className="filters__block" style={{flex: layout[0]}} >
				<FormSelect
                    id="name-filter"
                    appendMenuToBodyTag={true}
                    options={nameFilterOptions}
                    multiple={false}
                    visibleFieldsCount={5}
                    defaultValue="deviceid"
                    name="nameFilter"
                    onChange={() => {}}
                />
        	</div>
        	<div className="filters__block" style={{flex: layout[1]}} >
				<FormSelect
                    id="expression-filter"
                    appendMenuToBodyTag={true}
                    options={extraFilterOptions}
                    multiple={false}
                    defaultValue="contains"
                    visibleFieldsCount={5}
                    name="expressionFilter"
                    onChange={() => {}}
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
                    />
                }
    		</div>
    		<div className="filters__block filters__block--fake">
        		-
    		</div>
    		<div className="filters__block filters__block--fake">
        		+
    		</div>
        </div>
    );
}

export default SmartFilters;