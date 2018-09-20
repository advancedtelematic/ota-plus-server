import React, { Component, PropTypes } from 'react';
import { Loader } from '../../../../partials';
import { SelectableListItem } from '../../../../partials/lists';
import { inject, observer } from "mobx-react";
import _ from 'underscore';
import { _contains } from '../../../../utils/Collection';
import InfiniteScroll from "../../../../utils/InfiniteScroll";

@inject("stores")
@observer
class SelectUpdateList extends Component {
    constructor(props) {
        super(props);
        this.onUpdateSelect = this.onUpdateSelect.bind(this);
    }

    componentDidMount() {
        this.loadMore();
    }

    componentWillUnmount() {
        const { updatesStore } = this.props.stores;
        updatesStore._resetWizardData();
    }

    onUpdateSelect = (update) => {
        this.props.toggleSelection(update);
    };

    hasMore = () => {
        const { updatesStore } = this.props.stores;
        const { currentPagesLoadedWizard, updatesTotalCount, updatesLimitWizard } = updatesStore;

        return (currentPagesLoadedWizard < updatesTotalCount / updatesLimitWizard);
    };

    loadMore = () => {
        const { updatesStore } = this.props.stores;
        updatesStore.loadMoreUpdates();
    };

    render() {
        const { updatesStore } = this.props.stores;
        const { wizardData, showUpdateDetails } = this.props;
        const { update: selectedUpdate } = wizardData;

        const groupedUpdates = updatesStore.preparedUpdatesWizard;

        return (
            <div className="row update-container" id="update-container">
                <div className="col-xs-12">
                    <div className="ios-list">
                        {
                            <InfiniteScroll
                                className="wrapper-infinite-scroll"
                                hasMore={ this.hasMore() }
                                isLoading={ updatesStore.updatesFetchAsync.isFetching }
                                useWindow={ false }
                                loadMore={ this.loadMore }
                                threshold={ 1 }
                            >
                            {
                                updatesStore.updatesFetchAsync.isFetching ?
                                    <div className="wrapper-center">
                                        <Loader/>
                                    </div>
                                    :
                                    !!_.keys(groupedUpdates).length ?
                                        _.map(groupedUpdates, (updates, firstLetter) => {
                                            return (
                                                <div key={ firstLetter }>
                                                    <div className="header">{ firstLetter }</div>
                                                    {
                                                        _.map(updates, (update, index) => {
                                                            update.type = "update";
                                                            return (
                                                                <SelectableListItem
                                                                    key={ index }
                                                                    item={ update }
                                                                    selected={ _contains(selectedUpdate, update) }
                                                                    onItemSelect={ this.onUpdateSelect }
                                                                    showDetails={ showUpdateDetails }
                                                                />
                                                            );
                                                        })
                                                    }
                                                </div>
                                            )
                                        })
                                        :
                                        <div className="error">{ "No updates found." }</div>
                            }
                            </InfiniteScroll>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

SelectUpdateList.PropTypes = {
    stores: PropTypes.object.isRequired,
    wizardData: PropTypes.object.isRequired,
    stepId: PropTypes.object.isRequired,
    showUpdateDetails: PropTypes.func,
    toggleSelection: PropTypes.func,
};

export default SelectUpdateList;