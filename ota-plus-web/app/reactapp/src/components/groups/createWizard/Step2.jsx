import React, { Component, PropTypes } from 'react';
import { Step2CreateClassicGroup, Step2CreateSmartGroup } from './step2';

const Step2 = ({groupType, markStepAsFinished, markStepAsNotFinished, setFilter}) => {
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
	    			setFilter={setFilter}
	    		/>
	        }
        </div>
    );
}

export default Step2;