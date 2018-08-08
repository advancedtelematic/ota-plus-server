import React, { Component, PropTypes } from 'react';
import { SearchBar, FormInput, FormSelect } from '../../partials';
import { Form } from 'formsy-react';

const nameFilterOptions = ["Name", "Id"];
const extraFilterOptions = ["begins with", "ends with", "matches", "contains", "is", "is not"];

const AutomaticFilters = ({ devicesView = false, className, layout }) => {
    return (
        <div className={"filters " + (className ? className : '')}>
			<div className="filters__block" style={{flex: layout[0]}} >
				<FormSelect
                    id="name-filter"
                    appendMenuToBodyTag={true}
                    options={nameFilterOptions}
                    multiple={false}
                    placeholder="Name"
                    visibleFieldsCount={5}
                    onChange={(e) => { console.log(e) }}
                />
        	</div>
        	<div className="filters__block" style={{flex: layout[1]}} >
				<FormSelect
                    id="extra-filter"
                    appendMenuToBodyTag={true}
                    options={extraFilterOptions}
                    multiple={false}
                    placeholder="begins with"
                    visibleFieldsCount={5}
                    onChange={(e) => { console.log(e) }}
                />
    		</div>
    		<div className="filters__block" style={{flex: layout[2]}} >
                {devicesView ?
                    <Form>
                        <SearchBar 
                            value={''}
                            changeAction={() => { console.log('change aciton') }}
                            id="search-devices-input"
                        />
                    </Form>
                :
                    <FormInput
                        name="name-filter"
                        className="input-wrapper"
                        placeholder={"Type here"}
                        onChange={(e) => { console.log(e.target.value) }}
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

export default AutomaticFilters;