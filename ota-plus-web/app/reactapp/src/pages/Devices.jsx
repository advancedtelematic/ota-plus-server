import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { DevicesContainer } from '../containers';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const title = "Devices";

@DragDropContext(HTML5Backend)
@observer
class Devices extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.props.devicesStore.fetchDevices();
        this.props.groupsStore.fetchGroups();
    }
    componentWillUnmount() {
        this.props.devicesStore._reset();
        this.props.groupsStore._reset();
    }
    render() {
        const { t, devicesStore, groupsStore } = this.props;
        return (
            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <Header 
                        title={title}
                        subtitle={(
                            <span>
                                {devicesStore.devicesInitialTotalCount === null && devicesStore.devicesFetchAsync.isFetching ?
                                    <span>
                                        <i className="fa fa-square-o fa-spin"></i> devices counting
                                    </span>
                                :
                                    null
                                }
                                <FadeAnimation>
                                    {devicesStore.devicesInitialTotalCount !== null ?
                                        <span id = "devices-count">
                                            {t('common.deviceWithCount', {count: devicesStore.devicesInitialTotalCount})}
                                        </span>
                                    :
                                        null
                                    }
                                </FadeAnimation>
                            </span>
                        )}
                    />
                    <MetaData 
                        title={title}>
                        <DevicesContainer 
                            devicesStore={devicesStore}
                            groupsStore={groupsStore}
                        />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

Devices.propTypes = {
    devicesStore: PropTypes.object,
    groupsStore: PropTypes.object
}

export default translate()(Devices);
