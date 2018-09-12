import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { Loader } from '../../../../partials';
import UpdateDetailListItem from './UpdateDetailListItem';

@inject("stores")
@observer
class UpdateDetailList extends Component {
    render() {
        const { wizardData, onStep2DataSelect } = this.props;
        const { packagesStore } = this.props.stores;
        const selectedHardwares = wizardData.selectedHardwares;
        return (
            <span>
                { packagesStore.packagesFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader/>
                    </div>
                    :
                    _.map(selectedHardwares, item => {
                        return (
                            <UpdateDetailListItem
                                key={ item.name }
                                item={ item }
                                wizardData={ wizardData }
                                onStep2DataSelect={ onStep2DataSelect }
                            />
                        );
                    })
                }
            </span>
        );
    }
}

UpdateDetailList.propTypes = {
    stores: PropTypes.object,
};

export default UpdateDetailList;
