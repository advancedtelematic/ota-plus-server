import React, {Component, PropTypes} from 'react';
import {observable} from "mobx"
import {observer} from 'mobx-react';
import _ from 'underscore';
import { FadeAnimation } from '../utils';
import { Loader } from '../partials';

@observer
class SanityCheck extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { provisioningStore, proceed } = this.props;
        const loading = provisioningStore.namespaceSetupFetchAsync.isFetching || provisioningStore.namespaceSetupPostAsync.isFetching;
        const sanityCheckCompleted = provisioningStore.sanityCheckCompleted;
        if(sanityCheckCompleted) {
            setTimeout(() => { proceed() }, 2000);
        }
        return (
            <FadeAnimation>
                <div className="sanity-check">
                    <div className="wrapper-center">
                        <img className="sanity-check__logo-image" src="/assets/img/HERE_pos.png" alt="HERE"/>
                        <div className="sanity-check__title">
                            Setting up your account
                        </div>
                        <ul className="sanity-check__list">
                            <li className="sanity-check__item">
                                <span className="sanity-check__item-inner">
                                    {loading ?
                                        <span className="sanity-check__item-pending">
                                            <Loader />
                                        </span>
                                    : sanityCheckCompleted ?
                                        <img className="sanity-check__item-image" src="/assets/img/icons/green_tick.svg" alt="pass"/>
                                    :
                                        <span className="sanity-check__item-pending">
                                            <Loader />
                                        </span>
                                    }
                                    <span className="sanity-check__item-name">
                                        Your account is being initialized.
                                    </span>
                                </span>
                            </li>
                        </ul>
                        {loading ?
                            <div className="sanity-check__setting">
                                <div className="sanity-check__setting-loader">
                                    <Loader />
                                </div>
                                <div className="sanity-check__setting-title">
                                    Setting up...
                                </div>
                            </div>
                        : sanityCheckCompleted ?
                            <div className="sanity-check__setting">
                                <div className="sanity-check__setting-title">
                                    Everything has been set up.
                                </div>
                            </div>
                        :
                            <div className="sanity-check__setting">
                                <div className="sanity-check__setting-loader">
                                    <Loader />
                                </div>
                                <div className="sanity-check__setting-title">
                                    Setting up...
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </FadeAnimation>
        );
    }
}

export default SanityCheck;
