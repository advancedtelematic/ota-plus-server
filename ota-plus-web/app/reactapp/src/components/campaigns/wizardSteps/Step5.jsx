import React, {Component} from 'react';
import {FormTextarea, FormInput, TimePicker} from '../../../partials';
import {observable} from "mobx"
import {observer} from 'mobx-react';
import moment from 'moment';
import { FormsyText } from 'formsy-material-ui/lib';
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
    @observable inputText = '';
    constructor() {
        super();
        this._parseTime = this._parseTime.bind(this);
        this._getTimeFromSeconds = this._getTimeFromSeconds.bind(this);
        this.getPreparationTime = this.getPreparationTime.bind(this);
        this.getInstallationTime = this.getInstallationTime.bind(this);
        this.clearInput = this.clearInput.bind(this);
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
        this.driverAction === action ? this.driverAction = '' : this.driverAction = action;
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

    clearInput() {
        this.inputRef.value = '';
    }

    render() {
        const {wizardData, currentStepId} = this.props;
        const {description, estimatedPreparationDuration, estimatedInstallationDuration, driverAction} = wizardData[currentStepId];
        const checkActionType = (type) => {
            return this.driverAction === type && driverAction === type
        };
        return (
            <div className="distribution-info">
                <div className="checkboxes">
                    <div className="flex-row">
                        <button className={`btn-checkbox ${checkActionType(driverActionTypes.NOTIFY) || checkActionType(driverActionTypes.APPROVE) ? 'checked' : ''}`}
                                onClick={this.chooseDriverAction.bind(this, driverActionTypes.NOTIFY)}>
                            <i id={`driver-${driverActionTypes.NOTIFY}`} className="fa fa-check" aria-hidden="true"/>
                        </button>
                        <span>Notify driver</span>
                    </div>
                    <div className="flex-row">
                        <button className={`btn-checkbox ${checkActionType(driverActionTypes.APPROVE) ? 'checked' : ''}`}
                                onClick={this.chooseDriverAction.bind(this, driverActionTypes.APPROVE)}>
                            <i id={`driver-${driverActionTypes.APPROVE}`} className="fa fa-check" aria-hidden="true"/>
                        </button>
                        <span>Request driver's approval</span>
                    </div>
                </div>
                <div className="description">
                    <div className="search-box">
                        <FormInput
                            label="Internal description"
                            id="internal_reuse-text"
                            placeholder="Re-use text from"
                            getInputRef={(ref) => this.inputRef = ref}
                            wrapperWidth="50%"
                        >
                            <i className="fa fa-search icon-search"/>
                            <i className="fa fa-close icon-close" onClick={this.clearInput}/>
                        </FormInput>
                    </div>
                    <FormTextarea
                        rows="5"
                        id="internal_driver-description"
                        defaultValue={description ? description : ''}
                        onValid={(e) => this.addToWizardData(metadataTypes.DESCRIPTION, e.target.value)}
                    />
                </div>
                <div className="translations">
                    <div className="flex-row">
                        <span className="bold" id="approved-translations-0">Approved translations: 0</span>
                        <button className="btn-bordered" id="translations-view_button">Translation view</button>
                    </div>
                    <div className="estimations">
                        <div className="estimation">
                            <span className="title">Preparation time estimation:</span>
                            <span className="time-value">
                                <TimePicker
                                    id={`timepicker_${metadataTypes.PRE_DUR}`}
                                    onValid={this.getPreparationTime}
                                />
                            </span>
                        </div>
                        <div className="estimation">
                            <span className="title">Installation time estimation:</span>
                            <span className="time-value">
                                <TimePicker
                                    id={`timepicker_${metadataTypes.INSTALL_DUR}`}
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