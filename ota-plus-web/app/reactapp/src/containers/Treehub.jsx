import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../partials';
import _ from 'underscore';
import { TreehubTooltip } from '../components/treehub';
import { AsyncStatusCallbackHandler } from '../utils';

@observer
class Treehub extends Component {
    @observable tooltipShown = false;

    constructor(props) {
        super(props);
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
        this.activateHandler = new AsyncStatusCallbackHandler(props.featuresStore, 'featuresTreehubActivateAsync', this.hideTooltip);
    }
    componentWillUnmount() {
        this.activateHandler();
    }
    showTooltip(e) {
        if(e) e.preventDefault();
        this.tooltipShown = true;
    }
    hideTooltip(e) {
        if(e) e.preventDefault();
        this.tooltipShown = false;
    }
    render() {
        const { featuresStore } = this.props;
        return (
            <span>
                {featuresStore.featuresFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                :
                    _.contains(featuresStore.features, 'treehub') ? 
                        <div className="wrapper-center">
                            <span>
                                <span className="main-title">Welcome to TreeHub,</span><br />
                                the future of embedded device version management.<br />
                                The first thing you'll need to do is add OSTree support into your project.<br /><br />
                                Download your credentials and start pushing your images to TreeHub.<br />

                                <a href="/api/v1/features/treehub/config" className="btn-main" id="download-treehub-client">
                                    Download
                                </a>

                                <div>
                                    <div className="panel panel-grey">
                                        <div className="panel-heading">
                                            <img src="/assets/img/icons/white/treehub_leaf.png" alt=""/>
                                        </div>
                                        <div className="panel-body">
                                            I'm new to Yocto/Open Embedded. <br />
                                            Show me how to start a project <br />
                                            from scratch.
                                            <a href="http://docs.atsgarage.com/start-yocto/your-first-ostreeenabled-yocto-project.html" target="_blank" className="btn-main btn-small" id="user-new-yocto-docs">Start</a>
                                        </div>
                                    </div>
                                    <div className="panel panel-grey">
                                        <div className="panel-heading">
                                            <img src="/assets/img/icons/white/treehub_tree.png" alt=""/>
                                        </div>
                                        <div className="panel-body">
                                            I have an existing Yocto project <br />
                                              that I want to OTA-enable.
                                            <a href="http://docs.atsgarage.com/start-yocto/adding-ostree-updates-to-your-existing-yocto-project.html" target="_blank" className="btn-main btn-small" id="user-existing-yocto-docs">Start</a>
                                        </div>
                                    </div>
                                </div>
                            </span>
                        </div>
                    :
                        <div className="wrapper-center">
                            <div className="page-intro">
                                <div>TreeHub not activated.</div>
                                <a href="#" onClick={this.showTooltip}>What is this?</a>
                            </div>
                        </div>
                }
                <TreehubTooltip 
                    shown={this.tooltipShown}
                    hide={this.hideTooltip}
                    featuresStore={featuresStore}
                />
            </span>
        );
    }
}

Treehub.propTypes = {
    featuresStore: PropTypes.object
}

export default Treehub;
