import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'underscore';
import ListItem from './ListItem';
import NoKeys from './NoKeys';
import { Loader } from '../../../partials';

@observer
class List extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { provisioningStore, showTooltip } = this.props;
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
                                    provisioningStore={provisioningStore}
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
    provisioningStore: PropTypes.object.isRequired
}

export default List;
