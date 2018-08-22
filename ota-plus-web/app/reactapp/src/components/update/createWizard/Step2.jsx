import React, { Component, PropTypes } from 'react';
import { Form } from 'formsy-react';
import { FormInput, FormTextarea, FormSelect, Loader, AsyncResponse } from '../../../partials';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { observable } from 'mobx';
import moment from 'moment';
import { Step2UpdateList } from './step2';

@inject("stores")
@observer
class Step2 extends Component {
    componentWillMount() {
        const { packagesStore } = this.props.stores;
        packagesStore.fetchPackages();
    }
    render() {
        const { wizardData, onStep2DataSelect } = this.props;
        const { updateStore } = this.props.stores;        
        return (
            <div className="update-modal">
                <AsyncResponse 
                    handledStatus="error"
                    action={updateStore.updatesCreateAsync}
                    errorMsg={(updateStore.updatesCreateAsync.data ? updateStore.updatesCreateAsync.data.description : null)}
                />
                <div className="updates-container clearfix">
                    <Step2UpdateList 
                        wizardData={wizardData}
                        onStep2DataSelect={onStep2DataSelect}
                    />                       
                </div>
            </div>
        );
    }
}

export default Step2;