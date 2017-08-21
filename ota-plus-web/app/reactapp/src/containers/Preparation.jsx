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

    constructor(props) {
        super(props);
        this.doorOpen = this.doorOpen.bind(this);
        this.doubleCheckCreatedTuf = this.doubleCheckCreatedTuf.bind(this);
        this.doubleCheckCreatedDirector = this.doubleCheckCreatedDirector.bind(this);
        this.fetchDirectorRepoExists = this.fetchDirectorRepoExists.bind(this);
        this.fetchTufRepoExists = this.fetchTufRepoExists.bind(this);
        this.userProfileHandler = new AsyncStatusCallbackHandler(props.userStore, 'userFetchAsync', this.checkUserProfile.bind(this));
        this.activatedProvisioningHandler = new AsyncStatusCallbackHandler(props.provisioningStore, 'provisioningStatusFetchAsync', this.checkActivatedProvisioning.bind(this));
        this.createdTufHandler = new AsyncConflictCallbackHandler(props.packagesStore, 'tufRepoExistsFetchAsync', this.checkCreatedTuf.bind(this));
        this.createTufHandler = new AsyncStatusCallbackHandler(props.packagesStore, 'tufRepoCreateFetchAsync', this.doubleCheckCreatedTuf.bind(this));
        this.createdDirectorHandler = new AsyncConflictCallbackHandler(props.packagesStore, 'directorRepoExistsFetchAsync', this.checkCreatedDirector.bind(this));
        this.createDirectorHandler = new AsyncConflictCallbackHandler(props.packagesStore, 'directorRepoCreateFetchAsync', this.doubleCheckCreatedDirector.bind(this));
        this.createdTreehubHandler = new AsyncStatusCallbackHandler(props.featuresStore, 'featuresFetchAsync', this.checkCreatedTreehub.bind(this));
        this.createdFileUploaderHandler = new AsyncStatusCallbackHandler(props.featuresStore, 'featuresFetchAsync', this.checkCreatedFileUploader.bind(this));
    }

    componentWillMount() {
        this.props.userStore.fetchUser();
        this.props.provisioningStore.activateProvisioning();
        this.props.packagesStore.fetchTufRepoExists();
        this.props.packagesStore.fetchDirectorRepoExists();
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
        this.createDirectorHandler();
        this.createTufHandler();
    }

    checkUserProfile() {
        if (this.props.userStore.userFetchAsync.code === 200 && !_.isEmpty(this.props.userStore.user.email)) {
            this.userProfile = true;
        }
    }

    checkActivatedProvisioning() {
        if (this.props.provisioningStore.provisioningStatusFetchAsync.code === 200 && this.props.provisioningStore.provisioningStatus.active) {
            this.activatedProvisioning = true;
        }
    }

    doubleCheckCreatedTuf() {
        if(this.timesCreateTufCalled > 0) {
            setTimeout(this.fetchTufRepoExists, 3000);
        } else if(this.createdTuf !== true) {
            this.props.packagesStore.fetchTufRepoExists();
        }
    }

    fetchTufRepoExists() {
        this.props.packagesStore.fetchTufRepoExists();
    }

    doubleCheckCreatedDirector() {
        if (this.timesCreateDirectorCalled > 0) {
            setTimeout(this.fetchDirectorRepoExists, 3000);
        } else if(this.createdDirector !== true) {
            this.props.packagesStore.fetchDirectorRepoExists()

        }
    }

    fetchDirectorRepoExists() {
        if (this.createdDirector !== true) {
            this.props.packagesStore.fetchDirectorRepoExists();
        }
    }

    checkCreatedTuf() {
        if (this.props.packagesStore.tufRepoExistsFetchAsync.code === 409) {
            this.timesCheckCreatedTufCalled += 1;
            if(this.timesCheckCreatedTufCalled === 1){
                setInterval(this.doubleCheckCreatedTuf, 800);
            }
        }
        if(this.props.packagesStore.tufRepoExistsFetchAsync.code === 200) {
            this.createdTuf = true;
            this.checkedCreatedTufCalled = true;
        }
        if(this.props.packagesStore.tufRepoExistsFetchAsync.code === 404 || this.props.packagesStore.tufRepoExistsFetchAsync.code === 502) {
            this.timesCreateTufCalled +=1;
            if(this.timesCreateTufCalled === 1) {
                this.props.packagesStore.createTufRepo();
            }
        }
    }

    checkCreatedDirector() {
        if (this.props.packagesStore.directorRepoExistsFetchAsync.code === 409) {
            this.timesCheckCreatedDirectorCalled += 1;
            if(this.timesCheckCreatedDirectorCalled === 1){
                setInterval(this.doubleCheckCreatedDirector, 800);
            }
        }
        if(this.props.packagesStore.directorRepoExistsFetchAsync.code === 200) {
            this.createdDirector = true;
            this.checkedCreatedDirectorCalled = true;
        }
        if(this.props.packagesStore.directorRepoExistsFetchAsync.code === 404 || this.props.packagesStore.directorRepoExistsFetchAsync.code === 502) {
            this.timesCreateDirectorCalled += 1;
            if(this.timesCreateDirectorCalled === 1) {
                this.props.packagesStore.createDirectorRepo();
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
            container.className += " door-open";
            Cookies.set('systemReady', 1);
            this.props.setSystemReady(true);
        }
    }

    render() {
        const {userStore, provisioningStore, featuresStore, packagesStore} = this.props;
        let finished = !userStore.userFetchAsync.isFetching &&
            !provisioningStore.provisioningStatusFetchAsync.isFetching &&
            !packagesStore.tufRepoExistsFetchAsync.isFetching &&
            !packagesStore.directorRepoExistsFetchAsync.isFetching &&
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
                                                        : this.userProfile ?
                                                        <span className="img">
                                                            <img src="/assets/img/icons/check.png" alt="pass"/>
                                                        </span>
                                                        : finished ?
                                                            <span className="img">
                                                            <img src="/assets/img/icons/red_cross.png" alt="fail"/>
                                                        </span> : null
                                                    :
                                                    step.nr === 2 ?
                                                        provisioningStore.provisioningStatusFetchAsync.isFetching ?
                                                            <span className="img">
                                                                <img src="/assets/img/icons/loading_dots.gif" alt="Icon"/>
                                                            </span>
                                                            : this.activatedProvisioning ?
                                                            <span className="img">
                                                                <img src="/assets/img/icons/check.png" alt="pass"/>
                                                            </span>
                                                            : finished ?
                                                                <span className="img">
                                                                    <img src="/assets/img/icons/red_cross.png" alt="fail"/>
                                                                </span>
                                                                : null
                                                        :
                                                        step.nr === 3 ?
                                                            packagesStore.tufRepoExistsFetchAsync.isFetching || !this.checkedCreatedTufCalled ?
                                                                <span className="img">
                                                                    <img src="/assets/img/icons/loading_dots.gif" alt="Icon"/>
                                                                </span>
                                                                : this.createdTuf ?
                                                                <span className="img">
                                                                    <img src="/assets/img/icons/check.png" alt="pass"/>
                                                                </span>
                                                                : finished ?
                                                                    <span className="img">
                                                                        <img src="/assets/img/icons/red_cross.png" alt="fail"/>
                                                                    </span>
                                                                    : null
                                                            :
                                                            step.nr === 4 ?
                                                                packagesStore.directorRepoExistsFetchAsync.isFetching || !this.checkedCreatedDirectorCalled ?
                                                                    <span className="img">
                                                                        <img src="/assets/img/icons/loading_dots.gif" alt="Icon"/>
                                                                    </span>
                                                                    : this.createdDirector ?
                                                                    <span className="img">
                                                                        <img src="/assets/img/icons/check.png" alt="pass"/>
                                                                    </span>
                                                                    : finished ?
                                                                        <span className="img">
                                                                            <img src="/assets/img/icons/red_cross.png" alt="fail"/>
                                                                        </span>
                                                                        : null
                                                                :
                                                                step.nr === 5 ?
                                                                    featuresStore.featuresFetchAsync.isFetching ?
                                                                        <span className="img">
                                                                            <img src="/assets/img/icons/loading_dots.gif" alt="Icon"/>
                                                                        </span>
                                                                        : this.createdTreehub ?
                                                                        <span className="img">
                                                                            <img src="/assets/img/icons/check.png" alt="pass"/>
                                                                        </span>
                                                                        : finished ?
                                                                            <span className="img">
                                                                                <img src="/assets/img/icons/red_cross.png" alt="fail"/>
                                                                            </span>
                                                                            : null
                                                                :
                                                                step.nr === 6 ?
                                                                    featuresStore.featuresFetchAsync.isFetching ?
                                                                        <span className="img">
                                                                            <img src="/assets/img/icons/loading_dots.gif" alt="Icon"/>
                                                                        </span>
                                                                        : this.createdFileUploader ?
                                                                        <span className="img">
                                                                            <img src="/assets/img/icons/check.png" alt="pass"/>
                                                                        </span>
                                                                        : finished ?
                                                                            <span className="img">
                                                                                <img src="/assets/img/icons/red_cross.png" alt="fail"/>
                                                                            </span>
                                                                            : null
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
                            {!finished ?
                                <div className="setting-up">
                                    <div className="loader">
                                        <Loader />
                                    </div>
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
