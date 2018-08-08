import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import ListItem from './ListItem';
import NoKeys from './NoKeys';
import { Loader } from '../../../partials';

@inject("stores")
@observer
class List extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { showTooltip } = this.props;
        const { provisioningStore } = this.props.stores;
        return (
            provisioningStore.preparedProvisioningKeys.length ?
                <span>
                    <div className="section-header">
                        <div className="column">
                            Name
                        </div>
                        <div className="column">
                            Start date
                        </div>
                        <div className="column">
                            End date
                        </div>
                        <div className="column">
                            Download
                        </div>
                    </div>
                    <div className="keys-info">
                        {_.map(provisioningStore.preparedProvisioningKeys, (provisioningKey, index) => {
                            return (
                                <ListItem
                                    provisioningKey={provisioningKey}
                                    key={index}
                                />
                            );
                        })}
                    </div>
                </span>
            :
                provisioningStore.provisioningKeysFetchAsync.isFetching ? 
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                :
                    <NoKeys 
                        showTooltip={showTooltip}
                    />
        );
    }
}

List.propTypes = {
    stores: PropTypes.object
}

export default List;
