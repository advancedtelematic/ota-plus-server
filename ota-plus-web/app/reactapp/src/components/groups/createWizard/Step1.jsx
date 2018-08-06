import React, { Component, PropTypes } from 'react';
import { Step1Option } from './step1';
import { map } from 'underscore';

const options = [
    {
        title: "Static group",
        teaser: "drag and drop specific devices in this group",
        alias: 'static'
    },
    {
        title: "Automatic group",
        teaser: "filter devices based on multiple criteria, and get an up-to-date devices selection",
        alias: 'automatic'
    }
];

const Step1 = ({ selectGroupType, groupType }) => {
    return (
        <div className="wizard__step1">
            {map(options, option => {
                return (
                    <Step1Option 
                        key={option.alias}
                        title={option.title}
                        teaser={option.teaser}
                        selectOption={() => { selectGroupType(option.alias) }}
                        isSelected={groupType === option.alias}
                    />
                );
            })}
        </div>
    );
}

export default Step1;