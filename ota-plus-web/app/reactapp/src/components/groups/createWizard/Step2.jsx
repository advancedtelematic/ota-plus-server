import React, { Component, PropTypes } from 'react';
import { Step2CreateClassicGroup, Step2CreateSmartGroup } from './step2';

const Step2 = ({groupType, markStepAsFinished, markStepAsNotFinished}) => {
    return (
    	<div className="wizard__step2">
	    	{groupType === 'classic' ?
	    		<Step2CreateClassicGroup
	    			markStepAsFinished={markStepAsFinished}
	    			markStepAsNotFinished={markStepAsNotFinished}
	    		/>
	    	:
	    		<Step2CreateSmartGroup
	    			markStepAsFinished={markStepAsFinished}
	    			markStepAsNotFinished={markStepAsNotFinished}
	    		/>
	        }
        </div>
    );
}

export default Step2;