import React, { Component, PropTypes } from 'react';
import { inject, observer } from 'mobx-react';
import { Sequencer } from '../../../partials';
import _ from "underscore";

@inject('stores')
@observer
class WizardStep6 extends Component {

    componentWillMount() {
        const { updatesStore } = this.props.stores;
        const { wizardData } = this.props;
        const { update } = wizardData;
        const { source } = _.first(update);
        updatesStore.fetchUpdate(source && source.id);
    }

    prepareVersionData = () => {
        const { updatesStore } = this.props.stores;
        const { currentMtuData: mtu } = updatesStore;
        let versions = [];
        _.each(mtu.data, (data, hardwareId) => {
            const { checksum: fromVersion } = data.from;
            const { checksum: toVersion, target } = data.to;
            versions.push({
                hardwareId: hardwareId,
                name: target,
                from: fromVersion.hash,
                to: toVersion.hash,
                filepath: `${target}-${toVersion.hash}`,
            });
        });
        return versions;
    };

    render() {
        const { wizardIdentifier } = this.props;
        const { campaignsStore } = this.props.stores;
        let versions = this.prepareVersionData();

        return (
            !!versions.length ?
                <Sequencer
                    campaignsStore={ campaignsStore }
                    wizardIdentifier={ wizardIdentifier }
                    data={ versions }
                    entity={ "campaign" }
                    readOnly={ false }
                />
                :
                <div className="wrapper-center">
                    { "Live installation progress is not available for this update." }
                </div>
        );
    }
}

export default WizardStep6;
