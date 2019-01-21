/** @format */

import React from 'react';
import { Step2CreateClassicGroup, Step2CreateSmartGroup } from './step2';

const Step2 = ({ wizardData, onStep2DataSelect }) => {
  return (
    <div className='wizard__step2'>
      {wizardData.groupType === 'classic' ? (
        <Step2CreateClassicGroup wizardData={wizardData} onStep2DataSelect={onStep2DataSelect} />
      ) : (
        <Step2CreateSmartGroup wizardData={wizardData} onStep2DataSelect={onStep2DataSelect} />
      )}
    </div>
  );
};

export default Step2;
