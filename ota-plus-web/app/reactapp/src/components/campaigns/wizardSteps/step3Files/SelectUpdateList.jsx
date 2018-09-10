import React, { Component, PropTypes } from 'react';
import { FormInput, FormTextarea, Loader } from '../../../../partials';
import { SelectableListItem } from '../../../../partials/lists';
import { inject, observer } from "mobx-react";
import _ from 'underscore';
import { _contains } from '../../../../utils/Collection';

@inject("stores")
@observer
class SelectUpdateList extends Component {
    constructor(props) {
        super(props);
        this.onUpdateSelect = this.onUpdateSelect.bind(this);
    }

    componentWillMount() {
        const { updatesStore } = this.props.stores;
        updatesStore.fetchUpdates();
    }

    onUpdateSelect = (update) => {
        this.props.toggleSelection(update);
    };

    render() {
        const { updatesStore } = this.props.stores;
        const { wizardData, showUpdateDetails } = this.props;
        const { update: selectedUpdate } = wizardData;

        const groupedUpdates = updatesStore.preparedUpdates;

        return (
            <div className="row update-container">
                <div className="col-xs-12">
                    <div className="ios-list">
                        { updatesStore.updatesFetchAsync.isFetching ?
                            <div className="wrapper-center">
                                <Loader/>
                            </div>
                            :
                            <div>
                                {
                                    updatesStore.updatesTotalCount ?
                                        _.map(groupedUpdates, (updates, firstLetter) => {
                                            return (
                                                <div key={firstLetter}>
                                                    <div className="header">{firstLetter}</div>
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
                            </div>
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