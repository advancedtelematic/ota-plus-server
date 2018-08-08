import React, { Component, PropTypes } from 'react';
import { Form, FormInput } from '../../../../partials';
import { DevicesAutomaticFilters } from '../../../devices';

const CreateAutomaticGroup = ({markStepAsFinished, markStepAsNotFinished}) => {
    return (
		<Form                
            id="automatic-group-create-form">
            <div className="wizard__row-wrapper">
	            <div className="row">
	                <div className="col-xs-10">
						<FormInput
                            name="groupName"
                            className="input-wrapper"
                            title={"Name"}
                            label={"Name"}
                            placeholder={"Name"}
                            onValid={() => { markStepAsFinished() }}
                            onInvalid={() => { markStepAsNotFinished() }}
                            statusIconShown={true}
                        />
                	</div>
                </div>
            </div>
            <div className="wizard__row-wrapper">
	            <div className="row">
		            <div className="col-xs-10">
			            <DevicesAutomaticFilters 
			            	layout={[1, 1, 3]}
			            />
		            </div>
	            </div>
            </div>
            <div className="wizard__row-wrapper">
	            <div className="row">
	                <div className="col-xs-10">
	                	<div className="wizard__adds">
							<div className="wizard__adds-title">
								Number of devices
		                	</div>
		                	<div className="wizard__adds-value">
		                		16 Devices
		                	</div>
	                	</div>
                	</div>
                </div>	                
            </div>
        </Form>
    );
}

export default CreateAutomaticGroup;