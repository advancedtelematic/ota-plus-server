import React, { Component, PropTypes } from 'react';
import { observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { VelocityTransitionGroup } from 'velocity-react';
import PackagesListItem from './PackagesListItem';
import { Loader } from '../../../../partials';

const headerHeight = 28;

@inject("stores")
@observer
class PackagesList extends Component {
    @observable fakeHeaderLetter = null;
    @observable fakeHeaderTopPosition = 0;
    @observable expandedPackageName = null;

    constructor(props) {
        super(props);
        const { packagesStore } = props.stores;
        this.generatePositions = this.generatePositions.bind(this);
        this.listScroll = this.listScroll.bind(this);
        this.togglePackage = this.togglePackage.bind(this);
        this.packagesChangeHandler = observe(packagesStore, (change) => {
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
    componentDidMount() {
        this.refs.list.addEventListener('scroll', this.listScroll);
        this.listScroll();
    }
    componentWillUnmount() {
        this.packagesChangeHandler();
        if (this.refs.list) {
            this.refs.list.removeEventListener('scroll', this.listScroll);
        }
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
        const { packagesStore } = this.props.stores;
        if(this.refs.list) {
            let scrollTop = this.refs.list.scrollTop;
            let newFakeHeaderLetter = this.fakeHeaderLetter;
            const positions = this.generatePositions();
            _.each(positions, (position, index) => {
                if(scrollTop >= position) {
                    newFakeHeaderLetter = Object.keys(packagesStore.preparedPackages)[index];
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
        localStorage.removeItem(`matrix-${this.props.wizardIdentifier}`);
        this.expandedPackageName = (this.expandedPackageName !== packageName ? packageName : null);
    }
    render() {
        const { chosenPackagesList, setWizardData } = this.props;
        const { packagesStore } = this.props.stores;
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
                                        let chosen = null;
                                        _.each(chosenPackagesList, (listItem, index) => {
                                            if(listItem.packageName === pack.packageName) {
                                                chosen = pack;
                                            }
                                        });
                                        return (
                                            <span key={index}>
                                                <PackagesListItem
                                                    pack={pack}
                                                    togglePackage={this.togglePackage}
                                                    setWizardData={setWizardData}
                                                    chosen={chosen}
                                                />
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
    setWizardData: PropTypes.func.isRequired,
    stores: PropTypes.object,
}

export default PackagesList;