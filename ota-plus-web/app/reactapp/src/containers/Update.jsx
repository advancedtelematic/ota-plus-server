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

    showCreateModal = (e) => {
        e.preventDefault();
        this.createModalShown = true;
    }

    hideCreateModal = (e) => {
        e.preventDefault();
        this.createModalShown = false;
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
                                <UpdateList />
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

            </span>
        );
    }
}

Update.propTypes = {
    stores: PropTypes.object,
}

export default Update;