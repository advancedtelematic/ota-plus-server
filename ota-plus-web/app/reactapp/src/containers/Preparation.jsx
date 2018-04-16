import React, {Component, PropTypes} from 'react';
import {observable} from "mobx"
import {observer} from 'mobx-react';
import _ from 'underscore';
import {AsyncStatusCallbackHandler, AsyncConflictCallbackHandler, FadeAnimation} from '../utils';
import {Loader} from '../partials';
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
    },
    {
        nr: 6,
        name: "File uploader"
    }
];

@observer
class Preparation extends Component {
    @observable preparationSequence = initialPreparationSequence;
    @observable userProfile = null;
    @observable activatedProvisioning = null;
    @observable createdTuf = null;
    @observable createdDirector = null;
    @observable createdTreehub = null;
    @observable createdFileUploader = null;
    @observable timesCheckCreatedTufCalled = 0;
    @observable timesCreateTufCalled = 0;
    @observable timesCheckCreatedDirectorCalled = 0;
    @observable timesCreateDirectorCalled = 0;
    @observable checkedCreatedDirector = false;
    @observable checkedCreatedTufCalled = false;
    @observable namespaceSetupIntervalDirector = null;
    @observable namespaceSetupIntervalTuf = null;

    constructor(props) {
        super(props);
        this.doorOpen = this.doorOpen.bind(this);
        this.userProfileHandler = new AsyncStatusCallbackHandler(props.userStore, 'userFetchAsync', this.checkUserProfile.bind(this));
        this.activatedProvisioningHandler = new AsyncStatusCallbackHandler(props.provisioningStore, 'provisioningStatusFetchAsync', this.checkActivatedProvisioning.bind(this));
        this.createdTufHandler = new AsyncStatusCallbackHandler(props.provisioningStore, 'namespaceSetupFetchAsync', this.checkCreatedTuf.bind(this));
        this.createdDirectorHandler = new AsyncStatusCallbackHandler(props.provisioningStore, 'namespaceSetupFetchAsync', this.checkCreatedDirector.bind(this));
        this.createdTreehubHandler = new AsyncStatusCallbackHandler(props.featuresStore, 'featuresFetchAsync', this.checkCreatedTreehub.bind(this));
        this.createdFileUploaderHandler = new AsyncStatusCallbackHandler(props.featuresStore, 'featuresFetchAsync', this.checkCreatedFileUploader.bind(this));
    }

    componentWillMount() {
        this.props.userStore.fetchUser();
        this.props.provisioningStore.namespaceSetup();
        this.props.featuresStore.activateTreehub();
        this.props.featuresStore.activateFileUploader();
    }

    componentWillUnmount() {
        this.userProfileHandler();
        this.activatedProvisioningHandler();
        this.createdTufHandler();
        this.createdDirectorHandler();
        this.createdTreehubHandler();
        this.createdFileUploaderHandler();
    }

    checkUserProfile() {
        if (this.props.userStore.userFetchAsync.code === 200 && !_.isEmpty(this.props.userStore.user.email)) {
            this.userProfile = true;
        }
    }

    checkActivatedProvisioning() {
        if (this.props.provisioningStore.namespaceSetupFetchAsync.code === 200 && this.props.provisioningStore.namespaceSetupFetchAsync.data.crypt) {
            this.activatedProvisioning = true;
        }
    }

    checkCreatedTuf() {
        switch (this.props.provisioningStore.namespaceSetupFetchAsync.code) {
            case 200: {
                if (this.props.provisioningStore.namespaceSetupFetchAsync.data.tuf) {
                    this.createdTuf = true;
                    this.checkedCreatedTufCalled = true;
                    clearInterval(this.namespaceSetupIntervalTuf);
                } else {
                    this.namespaceSetupIntervalTuf = setInterval(this.props.provisioningStore.namespaceSetup, 800);
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    checkCreatedDirector() {
        switch (this.props.provisioningStore.namespaceSetupFetchAsync.code) {
            case 200: {
                if (this.props.provisioningStore.namespaceSetupFetchAsync.data.director) {
                    this.createdDirector = true;
                    this.checkedCreatedDirectorCalled = true;
                    clearInterval(this.namespaceSetupIntervalDirector);
                } else {
                    this.namespaceSetupIntervalDirector = setInterval(this.props.provisioningStore.namespaceSetup, 800);
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    checkCreatedTreehub() {
        if (this.props.featuresStore.featuresFetchAsync.code === 200 && _.includes(this.props.featuresStore.features, 'treehub')) {
            this.createdTreehub = true;
        }
    }

    checkCreatedFileUploader() {
        if (this.props.featuresStore.featuresFetchAsync.code === 200 && _.includes(this.props.featuresStore.features, 'tufupload')) {
            this.createdFileUploader = true;
        }
    }

    doorOpen() {
        let container = document.getElementsByClassName('preparation-container')[0];
        if (container && !_.includes(container.classList, 'door-open')) {
            Cookies.set('systemReady', 1);
            this.props.setSystemReady(true);
        }
    }

    render() {
        const {userStore, provisioningStore, featuresStore} = this.props;
        let finished = !userStore.userFetchAsync.isFetching &&
            !provisioningStore.namespaceSetupFetchAsync.isFetching &&
            !featuresStore.featuresTreehubActivateAsync.isFetching &&
            !featuresStore.featuresFileUploaderActivateAsync.isFetching && this.checkedCreatedTufCalled && this.checkedCreatedDirectorCalled;
        let allIsPassed = finished && this.userProfile && this.activatedProvisioning && this.createdTuf && this.createdDirector && this.createdTreehub && this.createdFileUploader;
        if (allIsPassed) {
            for (let i = 1; i < 100; i++)
                window.clearInterval(i);
            setTimeout(this.doorOpen, 2000);
        }
        return (
            <FadeAnimation>
                <div className="preparation-container">
                    <div className="wrapper-center wrapper-responsive">
                        <div className="logo">
                            <img src="/assets/img/HERE_pos.png" alt="HERE"/>
                        </div>
                        <div>
                            <div className="title">
                                Setting up your account:
                            </div>
                            <ul className="sequence-list">
                                {_.map(this.preparationSequence, (step, index) => {
                                    return (
                                        <li key={'sequence-step-' + index}>
                                            <div className="stepnum">
                                                {step.nr === 1 ?
                                                    userStore.userFetchAsync.isFetching ?
                                                        <span className="pending">
                                                            <Loader />
                                                        </span>
                                                    : this.userProfile ?
                                                        <span>
                                                            <img src="/assets/img/icons/green_tick.svg" alt="pass"/>
                                                        </span>
                                                    : finished ?
                                                        <span>
                                                            <img src="/assets/img/icons/red_cross.svg" alt="fail"/>
                                                        </span> 
                                                    : 
                                                        <span className="pending">
                                                            <Loader />
                                                        </span>
                                                : step.nr === 2 ?
                                                    provisioningStore.namespaceSetupFetchAsync.isFetching || provisioningStore.provisioningActivateAsync.isFetching ?
                                                        <span className="pending">
                                                            <Loader />
                                                        </span>
                                                    : this.activatedProvisioning ?
                                                        <span>
                                                            <img src="/assets/img/icons/green_tick.svg" alt="pass"/>
                                                        </span>
                                                    : finished ?
                                                        <span>
                                                            <img src="/assets/img/icons/red_cross.svg" alt="fail"/>
                                                        </span>
                                                    :
                                                        <span className="pending">
                                                            <Loader />
                                                        </span>
                                                : step.nr === 3 ?
                                                    provisioningStore.namespaceSetupFetchAsync.isFetching || !this.checkedCreatedTufCalled ?
                                                        <span className="pending">
                                                            <Loader />
                                                        </span>
                                                    : this.createdTuf ?
                                                        <span>
                                                            <img src="/assets/img/icons/green_tick.svg" alt="pass"/>
                                                        </span>
                                                    : finished ?
                                                        <span>
                                                            <img src="/assets/img/icons/red_cross.svg" alt="fail"/>
                                                        </span>
                                                    : 
                                                        <span className="pending">
                                                            <Loader />
                                                        </span>
                                                : step.nr === 4 ?
                                                    provisioningStore.namespaceSetupFetchAsync.isFetching || !this.checkedCreatedDirectorCalled ?
                                                        <span className="pending">
                                                            <Loader />
                                                        </span>
                                                    : this.createdDirector ?
                                                        <span>
                                                            <img src="/assets/img/icons/green_tick.svg" alt="pass"/>
                                                        </span>
                                                    : finished ?
                                                        <span>
                                                            <img src="/assets/img/icons/red_cross.svg" alt="fail"/>
                                                        </span>
                                                    :
                                                        <span className="pending">
                                                            <Loader />
                                                        </span>
                                                : step.nr === 5 ?
                                                    featuresStore.featuresFetchAsync.isFetching ?
                                                        <span className="pending">
                                                            <Loader />
                                                        </span>
                                                    : this.createdTreehub ?
                                                        <span>
                                                            <img src="/assets/img/icons/green_tick.svg" alt="pass"/>
                                                        </span>
                                                    : finished ?
                                                        <span>
                                                            <img src="/assets/img/icons/red_cross.svg" alt="fail"/>
                                                        </span>
                                                    :
                                                        <span className="pending">
                                                            <Loader />
                                                        </span> 
                                                : step.nr === 6 ?
                                                    featuresStore.featuresFetchAsync.isFetching ?
                                                        <span className="pending">
                                                            <Loader />
                                                        </span>
                                                    : this.createdFileUploader ?
                                                        <span>
                                                            <img src="/assets/img/icons/green_tick.svg" alt="pass"/>
                                                        </span>
                                                    : finished ?
                                                        <span>
                                                            <img src="/assets/img/icons/red_cross.svg" alt="fail"/>
                                                        </span>
                                                    :
                                                        <span className="pending">
                                                            <Loader />
                                                        </span>
                                                :
                                                    <span className="pending">
                                                        <Loader />
                                                    </span>
                                                }
                                                <span className="feature-name">{step.name}</span>
                                            </div>
                                        </li>
                                    );
                                }, this)}
                            </ul>
                            {!finished ?
                                <div className="setting-up">
                                    <Loader />
                                    <div className="text">
                                        Setting up...
                                    </div>
                                </div>
                                : allIsPassed ?
                                    <div className="setting-up">
                                        <div className="text">
                                            Everything has been set up.
                                        </div>
                                    </div>
                                    :
                                    <div className="setting-up">
                                        <div className="text">
                                            Something went wrong!
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
