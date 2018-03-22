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
            <div className="wrapper">
                <div className="inner-container" ref="innerContainer">
                    {provisioningStore.preparedProvisioningKeys.length ?
                        _.map(provisioningStore.preparedProvisioningKeys, (provisioningKey, index) => {
                            return (
                                <ListItem
                                    provisioningStore={provisioningStore}
                                    provisioningKey={provisioningKey}
                                    key={index}
                                />
                            );
                        })
                    :
                        provisioningStore.provisioningKeysFetchAsync.isFetching ? 
                            <div className="wrapper-center">
                                <Loader />
                            </div>
                        :
                            <NoKeys 
                                showTooltip={showTooltip}
                            />
                    }
                </div>
            </div>
        );
    }
}

List.propTypes = {
    provisioningStore: PropTypes.object.isRequired
}

export default List;
