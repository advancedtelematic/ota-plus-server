import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import {
    UpdateCreateModal,
    UpdateHeader,
    UpdateList,
} from '../components/update';
import { Loader } from '../partials';

@inject("stores")
@observer
class Update extends Component {
    @observable createModalShown = false;
    @observable editModalShown = false;
    @observable selectedUpdate = null;

    showCreateModal = (e) => {
        if(e) e.preventDefault();
        this.createModalShown = true;
    }
    hideCreateModal = (e) => {
        if(e) e.preventDefault();
        this.createModalShown = false;
    }
    showEditModal = (update, e) => {
        if(e) e.preventDefault();
        this.editModalShown = true;
        this.selectedUpdate = update;
    }
    hideEditModal = (e) => {
        if(e) e.preventDefault();
        this.editModalShown = false;
    }
    render() {
        const { updateStore } = this.props.stores;
        return (
            <span ref="component">
                {updateStore.updatesFetchAsync.isFetching ?
                        <div className="wrapper-center">
                            <Loader />
                        </div>
                    :
                        updateStore.updatesInitialTotalCount ?
                            <span>
                                <UpdateHeader
                                    showCreateModal={this.showCreateModal} 
                                />
                                <UpdateList 
                                    showEditModal={this.showEditModal}
                                />
                            </span>
                        :
                            <div className="wrapper-center">
                                <div className="page-intro">
                                    <div>
                                        <img src="/assets/img/icons/white/packages.svg" alt="Icon" />
                                    </div>
                                    <div>
                                        You haven't created any updates yet.
                                    </div>
                                    <div>
                                        <a href="#" className="add-button light" id="add-new-update" onClick={this.showCreateModal}>
                                            <span>
                                                +
                                            </span>
                                            <span>
                                                Create new update
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                }
                {this.createModalShown ?
                    <UpdateCreateModal
                        shown={this.createModalShown}
                        hide={this.hideCreateModal}
                    />
                :
                    null
                }
                {this.editModalShown ?
                    <UpdateCreateModal
                        shown={this.editModalShown}
                        hide={this.hideEditModal}
                        editMode={true}
                        update={this.selectedUpdate}
                    />
                :
                    null
                }
            </span>
        );
    }
}

Update.propTypes = {
    stores: PropTypes.object,
}

export default Update;