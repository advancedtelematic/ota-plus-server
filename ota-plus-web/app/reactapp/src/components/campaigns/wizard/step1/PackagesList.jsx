import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { VelocityTransitionGroup } from 'velocity-react';
import PackagesListItem from './PackagesListItem';
import PackagesListItemVersion from './PackagesListItemVersion';
import { Loader } from '../../../../partials';

const headerHeight = 28;

@observer
class PackagesList extends Component {
    @observable fakeHeaderLetter = null;
    @observable fakeHeaderTopPosition = 0;
    @observable expandedPackageName = null;
    @observable tmpIntervalId = null;

    constructor(props) {
        super(props);
        this.generatePositions = this.generatePositions.bind(this);
        this.listScroll = this.listScroll.bind(this);
        this.togglePackage = this.togglePackage.bind(this);
        this.packagesChangeHandler = observe(props.packagesStore, (change) => {
            if(change.name === 'preparedPackages' && !_.isMatch(change.oldValue, change.object[change.name])) {
                const that = this;
                  setTimeout(() => {
                      if(that.refs.list)
                          that.refs.list.scrollTop = 0;
                      that.listScroll();
                  }, 50);
            }
        });
    }
    componentWillMount() {
        this.expandedPackageName = this.props.chosenPackage.name;
    }
    componentDidMount() {
        this.refs.list.addEventListener('scroll', this.listScroll);
        this.listScroll();
    }
    componentWillUnmount() {
        this.packagesChangeHandler();
        this.refs.list.removeEventListener('scroll', this.listScroll);
    }
    generatePositions() {
        const headers = this.refs.list.getElementsByClassName('header');
        const wrapperPosition = this.refs.list.getBoundingClientRect();
        let positions = [];
        _.each(headers, (header) => {
            let position = header.getBoundingClientRect().top - wrapperPosition.top + this.refs.list.scrollTop;
            positions.push(position);
        }, this);
        return positions;
    }
    listScroll() {
        if(this.refs.list) {
            let scrollTop = this.refs.list.scrollTop;
            let newFakeHeaderLetter = this.fakeHeaderLetter;
            const positions = this.generatePositions();
            _.each(positions, (position, index) => {
                if(scrollTop >= position) {
                    newFakeHeaderLetter = Object.keys(this.props.packagesStore.preparedPackages)[index];
                    return true;
                } else if(scrollTop >= position - headerHeight) {
                    scrollTop -= scrollTop - (position - headerHeight);
                    return true;
                }
            }, this);
            this.fakeHeaderLetter = newFakeHeaderLetter;
            this.fakeHeaderTopPosition = scrollTop;
        }
    }
    togglePackage(packageName) {
        this.expandedPackageName = (this.expandedPackageName !== packageName ? packageName : null);
    }
    startIntervalListScroll() {
        clearInterval(this.tmpIntervalId);
        let intervalId = setInterval(() => {
            this.listScroll();
        }, 10);
        this.tmpIntervalId = intervalId;
    }
    stopIntervalListScroll() {
        clearInterval(this.tmpIntervalId);
        this.tmpIntervalId = null;
    }
    render() {
        const { chosenPackage, setWizardData, packagesStore } = this.props;
        return (
            <div className={"ios-list" + (packagesStore.packagesFetchAsync.isFetching ? " fetching" : "")} ref="list">
                {packagesStore.packagesCount ? 
                    <span>
                        <div className="fake-header" style={{top: this.fakeHeaderTopPosition}}>
                            {this.fakeHeaderLetter}
                        </div>
                        {_.map(packagesStore.preparedPackages, (packages, letter) => {
                            return (
                                <span key={letter}>
                                    <div className="header">{letter}</div>
                                    {_.map(packages, (pack, index) => {
                                        const that = this;
                                        return (
                                            <span key={index}>
                                                <PackagesListItem 
                                                    pack={pack}
                                                    togglePackage={this.togglePackage}
                                                />
                                                <VelocityTransitionGroup 
                                                    enter={{
                                                        animation: "slideDown", 
                                                        begin: () => {that.startIntervalListScroll()}, 
                                                        complete: () => {that.stopIntervalListScroll()}
                                                    }} 
                                                    leave={{
                                                        animation: "slideUp",
                                                        begin: () => {that.startIntervalListScroll();},
                                                        complete: () => {that.stopIntervalListScroll();}
                                                    }}
                                                >
                                                    {this.expandedPackageName === pack.packageName ?
                                                        <ul className="versions">
                                                            {_.map(pack.versions, (version, i) => {
                                                                return (
                                                                    <PackagesListItemVersion 
                                                                        version={version}
                                                                        setWizardData={setWizardData}
                                                                        isChosen={version.id.name == chosenPackage.name && version.id.version == chosenPackage.version}
                                                                        key={i}
                                                                    />
                                                                );
                                                            })}
                                                        </ul>
                                                    : 
                                                        null
                                                    }
                                                </VelocityTransitionGroup>
                                            </span>
                                        );
                                    })}
                                </span>
                            );
                        })}
                    </span>
                :
                    <span className="content-empty">
                        <div className="wrapper-center">
                            No matching packages found.
                        </div>
                    </span>
                }
            </div>
        );
    }
}

PackagesList.propTypes = {
    chosenPackage: PropTypes.object.isRequired,
    setWizardData: PropTypes.func.isRequired,
    packagesStore: PropTypes.object.isRequired
}

export default PackagesList;