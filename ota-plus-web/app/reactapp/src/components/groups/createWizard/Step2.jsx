import React, { Component, PropTypes } from 'react';
import { Step2CreateStaticGroup, Step2CreateAutomaticGroup } from './step2';

const Step2 = ({groupType, markStepAsFinished, markStepAsNotFinished}) => {
    return (
    	<div className="wizard__step2">
	    	{groupType === 'static' ?
	    		<Step2CreateStaticGroup
	    			markStepAsFinished={markStepAsFinished}
	    			markStepAsNotFinished={markStepAsNotFinished}
	    		/>
	    	:
	    		<Step2CreateAutomaticGroup
	    			markStepAsFinished={markStepAsFinished}
	    			markStepAsNotFinished={markStepAsNotFinished}
	    		/>
	        }
        </div>
    );
}

export default Step2;