import React, {Component, PropTypes} from 'react';
import {observable} from "mobx"
import {observer} from 'mobx-react';
import _ from 'underscore';
import {AsyncStatusCallbackHandler, AsyncConflictCallbackHandler, FadeAnimation} from '../utils';
import {Loader} from '../partials';

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
        if(props.uiUserProfileMenu) {
            this.userProfileHandler = new AsyncStatusCallbackHandler(props.userStore, 'userFetchAsync', this.checkUserProfile.bind(this));
        }
        this.activatedProvisioningHandler = new AsyncStatusCallbackHandler(props.provisioningStore, 'provisioningStatusFetchAsync', this.checkActivatedProvisioning.bind(this));
        this.createdTufHandler = new AsyncStatusCallbackHandler(props.provisioningStore, 'namespaceSetupFetchAsync', this.checkCreatedTuf.bind(this));
        this.createdDirectorHandler = new AsyncStatusCallbackHandler(props.provisioningStore, 'namespaceSetupFetchAsync', this.checkCreatedDirector.bind(this));
        this.createdTreehubHandler = new AsyncStatusCallbackHandler(props.featuresStore, 'featuresFetchAsync', this.checkCreatedTreehub.bind(this));
    }

    componentWillMount() {
        if(this.props.uiUserProfileMenu) {
            this.props.userStore.fetchUser();
        }
        this.props.provisioningStore.namespaceSetup();
        this.props.featuresStore.activateTreehub();
        this.props.featuresStore.activateFileUploader();
    }

    componentWillUnmount() {
        if(this.props.uiUserProfileMenu) {
            this.userProfileHandler();
        }
        this.activatedProvisioningHandler();
        this.createdTufHandler();
        this.createdDirectorHandler();
        this.createdTreehubHandler();
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

    doorOpen() {
        let container = document.getElementsByClassName('preparation')[0];
        if (container && !_.includes(container.classList, 'door-open')) {
            this.props.setSystemReady();
        }
    }

    render() {
        const {userStore, provisioningStore, featuresStore, uiUserProfileMenu} = this.props;
        let finished = !userStore.userFetchAsync.isFetching &&
            !provisioningStore.namespaceSetupFetchAsync.isFetching &&
            !featuresStore.featuresTreehubActivateAsync.isFetching &&
            !featuresStore.featuresFileUploaderActivateAsync.isFetching && this.checkedCreatedTufCalled && this.checkedCreatedDirectorCalled;
        let allIsPassed = false;

        if(uiUserProfileMenu) {
            allIsPassed = finished && this.userProfile && this.activatedProvisioning && this.createdTuf && this.createdDirector && this.createdTreehub
        } else {
            allIsPassed = finished && this.activatedProvisioning && this.createdTuf && this.createdDirector && this.createdTreehub
        }

        if (allIsPassed) {
            for (let i = 1; i < 100; i++)
                window.clearInterval(i);
            setTimeout(this.doorOpen, 2000);
        }
        return (
            <FadeAnimation>
                <div className="preparation">
                    <div className="wrapper-center">
                        <img className="preparation__logo-image" src="/assets/img/HERE_pos.png" alt="HERE"/>
                        <div className="preparation__title">
                            Setting up your account:
                        </div>
                        <ul className="preparation__list">
                            {_.map(this.preparationSequence, (step, index) => {
                                return (
                                    <li className="preparation__item" key={index}>
                                        {step.nr === 1 && uiUserProfileMenu ?
                                            <span className="preparation__item-inner">
                                                {userStore.userFetchAsync.isFetching ?
                                                    <span className="preparation__item-pending">
                                                        <Loader />
                                                    </span>
                                                : this.userProfile ?
                                                    <img className="preparation__item-image" src="/assets/img/icons/green_tick.svg" alt="pass"/>
                                                : finished ?
                                                    <img className="preparation__item-image" src="/assets/img/icons/red_cross.svg" alt="fail"/>
                                                : 
                                                    <span className="preparation__item-pending">
                                                        <Loader />
                                                    </span>
                                                }
                                                <span className="preparation__item-name">
                                                    {step.name}
                                                </span>
                                            </span>
                                        : step.nr === 2 ?
                                            <span className="preparation__item-inner">
                                                {provisioningStore.namespaceSetupFetchAsync.isFetching || provisioningStore.provisioningActivateAsync.isFetching ?
                                                    <span className="preparation__item-pending">
                                                        <Loader />
                                                    </span>
                                                : this.activatedProvisioning ?
                                                    <img className="preparation__item-image" src="/assets/img/icons/green_tick.svg" alt="pass"/>
                                                : finished ?
                                                    <img className="preparation__item-image" src="/assets/img/icons/red_cross.svg" alt="fail"/>
                                                :
                                                    <span className="preparation__item-pending">
                                                        <Loader />
                                                    </span>
                                                }
                                                <span className="preparation__item-name">
                                                    {step.name}
                                                </span>
                                            </span>
                                        : step.nr === 3 ?
                                            <span className="preparation__item-inner">
                                                {provisioningStore.namespaceSetupFetchAsync.isFetching || !this.checkedCreatedTufCalled ?
                                                    <span className="preparation__item-pending">
                                                        <Loader />
                                                    </span>
                                                : this.createdTuf ?
                                                    <img className="preparation__item-image" src="/assets/img/icons/green_tick.svg" alt="pass"/>
                                                : finished ?
                                                    <img className="preparation__item-image" src="/assets/img/icons/red_cross.svg" alt="fail"/>
                                                : 
                                                    <span className="preparation__item-pending">
                                                        <Loader />
                                                    </span>
                                                }
                                                <span className="preparation__item-name">
                                                    {step.name}
                                                </span>
                                            </span>
                                        : step.nr === 4 ?
                                            <span className="preparation__item-inner">
                                                {provisioningStore.namespaceSetupFetchAsync.isFetching || !this.checkedCreatedDirectorCalled ?
                                                    <span className="preparation__item-pending">
                                                        <Loader />
                                                    </span>
                                                : this.createdDirector ?
                                                    <img className="preparation__item-image" src="/assets/img/icons/green_tick.svg" alt="pass"/>
                                                : finished ?
                                                    <img className="preparation__item-image" src="/assets/img/icons/red_cross.svg" alt="fail"/>
                                                :
                                                    <span className="preparation__item-pending">
                                                        <Loader />
                                                    </span>
                                                }
                                                <span className="preparation__item-name">
                                                    {step.name}
                                                </span>
                                            </span>
                                        : step.nr === 5 ?
                                            <span className="preparation__item-inner">
                                                {featuresStore.featuresFetchAsync.isFetching ?
                                                    <span className="preparation__item-pending">
                                                        <Loader />
                                                    </span>
                                                : this.createdTreehub ?
                                                    <img className="preparation__item-image" src="/assets/img/icons/green_tick.svg" alt="pass"/>
                                                : finished ?
                                                    <img className="preparation__item-image" src="/assets/img/icons/red_cross.svg" alt="fail"/>
                                                :
                                                    <span className="preparation__item-pending">
                                                        <Loader />
                                                    </span> 
                                                }
                                                <span className="preparation__item-name">
                                                    {step.name}
                                                </span>
                                            </span>
                                        :
                                            null
                                        }
                                    </li>
                                );
                            }, this)}
                        </ul>
                        {!finished ?
                            <div className="preparation__setting">
                                <div className="preparation__setting-loader">
                                    <Loader />
                                </div>
                                <div className="preparation__setting-title">
                                    Setting up...
                                </div>
                            </div>
                            : allIsPassed ?
                                <div className="preparation__setting">
                                    <div className="preparation__setting-title">
                                        Everything has been set up.
                                    </div>
                                </div>
                                :
                                <div className="preparation__setting">
                                    <div className="preparation__setting-title">
                                        Something went wrong!
                                    </div>
                                </div>
                        }
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
