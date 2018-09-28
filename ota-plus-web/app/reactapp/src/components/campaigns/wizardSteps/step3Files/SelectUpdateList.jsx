import React, { Component, PropTypes } from 'react';
import { SelectableListItem } from '../../../../partials/lists';
import { inject, observer } from "mobx-react";
import _ from 'underscore';
import { _contains } from '../../../../utils/Collection';
import InfiniteScroll from "../../../../utils/InfiniteScroll";

@inject("stores")
@observer
class SelectUpdateList extends Component {

    onUpdateSelect = (update) => {
        this.props.toggleSelection(update);
    };


    render() {
        const { updatesStore } = this.props.stores;
        const { wizardData, showUpdateDetails } = this.props;
        const { update: selectedUpdate } = wizardData;


        return (
            <div className="row update-container" id="update-container">
                <div className="col-xs-12">
                    <div className="ios-list">
                        { Object.keys(updatesStore.preparedUpdatesWizard).length ?
                            (
                                <InfiniteScroll
                                    className="wrapper-infinite-scroll"
                                    hasMore={ updatesStore.hasMoreWizardUpdates }
                                    isLoading={ updatesStore.updatesWizardFetchAsync.isFetching }
                                    useWindow={ false }
                                    loadMore={() => {
                                        updatesStore.loadMoreWizardUpdates();
                                    }}
                                    threshold={ 1 }
                                >
                            <span>
                                {_.map(updatesStore.preparedUpdatesWizard, (updates, firstLetter) => {

                                    return (
                                        <div key={ firstLetter }>
                                            <div className="header">{ firstLetter }</div>
                                            {_.map(updates, (update, index) => {
                                                update.type = "update";
                                                return (
                                                    <SelectableListItem
                                                        key={ index }
                                                        item={ update }
                                                        selected={ _contains(selectedUpdate, update) }
                                                        onItemSelect={ this.onUpdateSelect }
                                                        showDetails={ showUpdateDetails }
                                                        sourceType={update.source.sourceType}
                                                    />
                                                );
                                            })
                                            }
                                        </div>
                                    )
                                })}
                             </span>
                                </InfiniteScroll>
                            )
                            :
                            (
                                <div className="error">
                                    <p>
                                        No updates found. Create some updates first.
                                    </p>
                                    <p>
                                        If you’re working with a customized version of OTA Connect, contact your administrator. They might need to map your updates to your devices first.
                                    </p>
                                </div>

                            )
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