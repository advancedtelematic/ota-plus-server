import React, {Component} from 'react';
import {FormTextarea, FormInput, TimePicker} from '../../../partials';
import {observable} from "mobx"
import {observer} from 'mobx-react';
import moment from 'moment';
import _ from 'underscore';

const metadataTypes = {
    DESCRIPTION: 'description',
    INSTALL_DUR: 'estimatedInstallationDuration',
    PRE_DUR: 'estimatedPreparationDuration'
};

const driverActionTypes = {
    NOTIFY: 'notified',
    APPROVE: 'approved'
};

@observer
class WizardStep5 extends Component {
    @observable driverAction = '';
    @observable wizardMetadata = {};
    constructor() {
        super();
        this._parseTime = this._parseTime.bind(this);
        this._getTimeFromSeconds = this._getTimeFromSeconds.bind(this);
        this.getPreparationTime = this.getPreparationTime.bind(this);
        this.getInstallationTime = this.getInstallationTime.bind(this);
    }

    addToWizardData(type, value) {
        const {setWizardData, markStepAsFinished, wizardData, currentStepId} = this.props;
        if (_.isUndefined(wizardData[currentStepId].isActivated)) {
            this.wizardMetadata = {
                ...wizardData[currentStepId],
                [type]: value
            };
        }
        setWizardData(this.wizardMetadata);
        markStepAsFinished();
    }

    chooseDriverAction(action) {
        this.driverAction = action;
        this.addToWizardData('driverAction', action)
    }

    _parseTime(timeObject) {
        let timeString = '';
        _.each(timeObject, (value, key) => {
            timeString = timeString + `${value}${key !== 'seconds' ? ':' : null}`
        });
        return moment(timeString, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds') + '';
    }

    _getTimeFromSeconds(seconds) {
        return moment.utc(seconds*1000).format('HH:mm:ss')
    }

    getPreparationTime(time) {
        const timeString = this._parseTime(time);
        this.addToWizardData(metadataTypes.PRE_DUR, timeString)
    }

    getInstallationTime(time) {
        const timeString = this._parseTime(time);
        this.addToWizardData(metadataTypes.INSTALL_DUR, timeString)
    }

    render() {
        const {wizardData, currentStepId} = this.props;
        const {description, estimatedPreparationDuration, estimatedInstallationDuration, driverAction} = wizardData[currentStepId];
        const checkActionType = (type) => {
            return this.driverAction === type || driverAction === type
        };
        return (
            <div className="distribution-info">
                <div className="checkboxes">
                    <div className="flex-row">
                        <button className={`btn-checkbox ${checkActionType(driverActionTypes.NOTIFY) ? 'checked' : ''}`}
                                onClick={this.chooseDriverAction.bind(this, driverActionTypes.NOTIFY)}>
                            <i className="fa fa-check" aria-hidden="true"/>
                        </button>
                        <span>Notify driver</span>
                    </div>
                    <div className="flex-row">
                        <button className={`btn-checkbox ${checkActionType(driverActionTypes.APPROVE) ? 'checked' : ''}`}
                                onClick={this.chooseDriverAction.bind(this, driverActionTypes.APPROVE)}>
                            <i className="fa fa-check" aria-hidden="true"/>
                        </button>
                        <span>Request driver's approval</span>
                    </div>
                </div>
                <div className="description">
                    <FormInput
                        label="Internal description"
                        placeholder="Re-use text from"
                        wrapperWidth="50%"
                    />
                    <FormTextarea
                        rows="5"
                        defaultValue={description ? description : ''}
                        onValid={(e) => this.addToWizardData(metadataTypes.DESCRIPTION, e.target.value)}
                    />
                </div>
                <div className="translations">
                    <div className="flex-row">
                        <span className="bold">Approved translations: 0</span>
                        <button className="btn-bordered">Translation view</button>
                    </div>
                    <div className="estimations">
                        <div className="estimation">
                            <span className="title">Preparation time estimation:</span>
                            <span className="time-value">
                                <TimePicker
                                    onValid={this.getPreparationTime}
                                />
                            </span>
                        </div>
                        <div className="estimation">
                            <span className="title">Installation time estimation:</span>
                            <span className="time-value">
                                <TimePicker
                                    onValid={this.getInstallationTime}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default WizardStep5;