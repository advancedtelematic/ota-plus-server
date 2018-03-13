import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'underscore';
import Versions from './Versions';
import { SlideAnimation } from '../../utils';

@observer
class BlacklistedPackages extends Component {
    @observable headerTopPosition = 0;
    @observable expandedPackage = null;

    constructor(props) {
        super(props);
        this.listScroll = this.listScroll.bind(this);
        this.togglePackage = this.togglePackage.bind(this);
    }
    componentDidMount() {
        this.refs.list.addEventListener('scroll', this.listScroll);
    }
    componentWillUnmount() {
        this.refs.list.removeEventListener('scroll', this.listScroll);
    }
    listScroll() {
        this.headerTopPosition = this.refs.list.scrollTop;
    }
    togglePackage(name) {
        this.expandedPackage = this.expandedPackage !== name ? name : null;
    }
    render() {
        const { packagesStore } = this.props; 
        const blacklist = packagesStore.preparedBlacklist;
        return (
            <div className="blacklisted-packages-panel">
                <div className="section-header">
                    Blacklisted packages
                </div>
                <div className="wrapper-list" ref="list">
                    <div className="header" style={{top: this.headerTopPosition}}>
                        <div className="column column-first">Package</div>
                        <div className="column column-second">Impacted devices</div>
                    </div>
                    <div className="list">
                        {_.map(blacklist, (pack, index) => {
                            return (
                                <span key={index}>
                                    <button 
                                        className={"item" + (this.expandedPackage == pack.packageName ? " selected" : "")}
                                        id={"impact-analysis-blacklisted-" + pack.packageName}
                                        onClick={this.togglePackage.bind(this, pack.packageName )}
                                        key={pack.packageName }>
                                        <div className="column column-first" title={pack.packageName}>
                                            {pack.packageName}
                                        </div>
                                        <div className="column column-second">
                                            {pack.deviceCount}
                                        </div>
                                    </button>
                                    <SlideAnimation changeDisplay={false}>
                                        {this.expandedPackage == pack.packageName  ?
                                            <Versions 
                                                versions={pack.versions}
                                            />
                                        : 
                                            null
                                        }
                                    </SlideAnimation>
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

BlacklistedPackages.propTypes = {
    packagesStore: PropTypes.object.isRequired
}

export default BlacklistedPackages;