import React, {Component, PropTypes} from 'react';
import {observable} from "mobx"
import {observer} from 'mobx-react';
import _ from 'underscore';
import {AsyncStatusCallbackHandler, FadeAnimation} from '../utils';
import { Loader } from '../partials';
import Cookies from 'js-cookie';

const initialPreparationSequence = [
    {
        nr: 1,
        name: "Create user profile"
    },
    {
        nr: 2,
        name: "Activate provisioning"
    },
    {
        nr: 3,
        name: "Create tuf repo"
    },
    {
        nr: 4,
        name: "Create director repo"
    },
    {
        nr: 5,
        name: "Activate treehub"
    }
];

@observer
class Preparation extends Component {
    @observable preparationSequence = initialPreparationSequence;

    constructor(props) {
        super(props);
        this.doorOpen = this.doorOpen.bind(this);
    }

    componentWillMount() {
        this.props.featuresStore.activateTreehub();
        this.props.provisioningStore.activateProvisioning();
        this.props.userStore.fetchUser();
    }

    doorOpen() {
        let container = document.getElementsByClassName('preparation-container')[0];
        if(container && !_.includes(container.classList, 'door-open')) {
            container.className += " door-open";
            Cookies.set('systemReady', 1);
        }
    }

    render() {
        const {devicesStore, userStore, provisioningStore, featuresStore} = this.props;
        let finished = !userStore.userFetchAsync.isFetching && !provisioningStore.provisioningStatusFetchAsync.isFetching && !featuresStore.featuresTreehubActivateAsync.isFetching;
        if(finished) {
            setTimeout(this.doorOpen, 2000);
        }
        return (
            <FadeAnimation>
                <div className="preparation-container">
                    <div className="wrapper-center wrapper-responsive">
                        <div>
                            <div className="title">
                                Setting up ATS Garage:
                            </div>
                            <ul className="sequence-list">
                                {_.map(this.preparationSequence, (step, index) => {
                                    return (
                                        <li key={'sequence-step-' + index}>
                                            <div className="stepnum">
                                                {step.nr === 1 ?
                                                    userStore.userFetchAsync.isFetching ?
                                                        <span className="img">
                                                            <img src="/assets/img/icons/loading_dots.gif" alt="Icon"/>
                                                        </span>
                                                    : userStore.userFetchAsync.code === 200 && !_.isEmpty(userStore.user.email) ?
                                                        <span className="img">
                                                            <img src="/assets/img/icons/check.png" alt="pass"/>
                                                        </span>
                                                    :
                                                        <span className="img">
                                                            <img src="/assets/img/icons/red_cross.png" alt="fail"/>
                                                        </span>
                                                :
                                                step.nr === 2 ?
                                                    provisioningStore.provisioningStatusFetchAsync.isFetching ?
                                                        <span className="img">
                                                            <img src="/assets/img/icons/loading_dots.gif" alt="Icon"/>
                                                        </span>
                                                    : provisioningStore.provisioningStatusFetchAsync.code === 200 && provisioningStore.provisioningStatus.active ?
                                                        <span className="img">
                                                            <img src="/assets/img/icons/check.png" alt="pass"/>
                                                        </span>
                                                    :
                                                        <span className="img">
                                                            <img src="/assets/img/icons/red_cross.png" alt="fail"/>
                                                        </span>
                                                    :
                                                step.nr === 5 ?
                                                    featuresStore.featuresFetchAsync.isFetching ?
                                                        <span className="img">
                                                            <img src="/assets/img/icons/loading_dots.gif" alt="Icon"/>
                                                        </span>
                                                    : featuresStore.featuresFetchAsync.code === 200 && _.includes(featuresStore.features, 'treehub') ?
                                                        <span className="img">
                                                            <img src="/assets/img/icons/check.png" alt="pass"/>
                                                        </span>
                                                    :
                                                        <span className="img">
                                                            <img src="/assets/img/icons/red_cross.png" alt="fail"/>
                                                        </span>
                                                :   
                                                    <span className="img">
                                                        <img src="/assets/img/icons/loading_dots.gif" alt="Icon"/>
                                                    </span>
                                                }
                                                <span>{step.name}</span>
                                            </div>
                                        </li>
                                    );
                                }, this)}
                            </ul>
                            {userStore.userFetchAsync.isFetching || provisioningStore.provisioningStatusFetchAsync.isFetching || featuresStore.featuresTreehubActivateAsync.isFetching ?
                                <div className="setting-up">
                                    <div className="loader">
                                        <Loader />
                                    </div>
                                    <div className="text">
                                        Setting up...
                                    </div>
                                </div>
                            :
                                <div className="setting-up">
                                    <div className="text">
                                        Everything has been set up...
                                    </div>
                                </div>
                            }
                            
                        </div>
                    </div>
                </div>
            </FadeAnimation>
        );
    }
}

Preparation.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Preparation;