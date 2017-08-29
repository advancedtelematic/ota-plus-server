import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../../partials';
import { resetAsync } from '../../utils/Common';
import _ from 'underscore';
import LastPackagesItem from './LastPackagesItem';
import { PackagesCreateModal } from '../packages';
import { FlatButton } from 'material-ui';

@observer
class LastPackages extends Component {
    @observable createModalShown = false;

    constructor(props) {
        super(props);
        this.showCreateModal = this.showCreateModal.bind(this);
        this.hideCreateModal = this.hideCreateModal.bind(this);
    }
    showCreateModal(e) {
        if(e) e.preventDefault();
        this.createModalShown = true;
    }
    hideCreateModal(e) {
        if(e) e.preventDefault();
        this.createModalShown = false;
        resetAsync(this.props.packagesStore.packagesCreateAsync);
    }
    render() {
        const { packagesStore, hardwareStore, devicesStore, toggleTufUpload, uploadToTuf } = this.props;
        const { lastPackages } = packagesStore;
        return (
            <span>
                {packagesStore.packagesFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader 
                            className="dark"
                        />
                    </div>
                :
                    Object.keys(lastPackages).length ? 
                        _.map(lastPackages, (pack) => {
                            return (
                                <LastPackagesItem 
                                    key={pack.uuid}
                                    pack={pack}
                                />
                            );
                        })
                    :
                        <div className="wrapper-center">
                            <FlatButton
                                label="Add new package"
                                type="button"
                                className="btn-main btn-small btn-add"
                                onClick={this.showCreateModal}
                            />
                        </div>
                }
                <PackagesCreateModal 
                    shown={this.createModalShown}
                    hide={this.hideCreateModal}
                    packagesStore={packagesStore}
                    hardwareStore={hardwareStore}
                    devicesStore={devicesStore}
                    toggleTufUpload={toggleTufUpload}
                    uploadToTuf={uploadToTuf}
                />
            </span>
        );
    }
}

LastPackages.propTypes = {
    packagesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
    toggleTufUpload: PropTypes.func.isRequired,
    uploadToTuf: PropTypes.bool.isRequired
}

export default LastPackages;