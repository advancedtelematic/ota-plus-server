import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { FormInput, FormTextarea, FormSelect, Loader, AsyncResponse } from '../../../../partials';
import { Form } from 'formsy-react';
import moment from 'moment';
import UpdateListItem from './UpdateListItem'; 

@inject("stores")
@observer
class UpdateList extends Component {
    render() {
        const { wizardData, onStep2DataSelect } = this.props;
        const { packagesStore } = this.props.stores;
        const selectedHardwares = wizardData[0].selectedHardwares;
        return (
            <span>
                {packagesStore.packagesFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader/>
                    </div>
                :
                    _.map(selectedHardwares, item => {
                        return (
                            <UpdateListItem
                                key={item.name}
                                item={item.name}
                                wizardData={wizardData}
                                onStep2DataSelect={onStep2DataSelect}
                            />
                        );
                    })
                }
            </span>
        );
    }
}

UpdateList.propTypes = {
    stores: PropTypes.object,
};

export default UpdateList;
