/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import { Sequencer } from '../../../partials';

@inject('stores')
@observer
class WizardStep6 extends Component {
  static propTypes = {
    stores: PropTypes.object,
    wizardData: PropTypes.object,
    wizardIdentifier: PropTypes.number,
  };

  componentWillMount() {
    const { stores, wizardData } = this.props;
    const { updatesStore } = stores;
    const { update } = wizardData;
    const { source } = _.first(update);
    updatesStore.fetchUpdate(source && source.id);
  }

  prepareVersionData = () => {
    const { stores } = this.props;
    const { updatesStore } = stores;
    const { currentMtuData: mtu } = updatesStore;
    const versions = [];
    _.each(mtu.data, (data, hardwareId) => {
      const { checksum: fromVersion } = data.from;
      const { checksum: toVersion, target } = data.to;
      versions.push({
        hardwareId,
        name: target,
        from: fromVersion.hash,
        to: toVersion.hash,
        filepath: `${target}-${toVersion.hash}`,
      });
    });
    return versions;
  };

  render() {
    const { stores, wizardIdentifier } = this.props;
    const { campaignsStore } = stores;
    const versions = this.prepareVersionData();

    return versions.length ? (
      <Sequencer campaignsStore={campaignsStore} wizardIdentifier={wizardIdentifier} data={versions} entity='campaign' readOnly={false} />
    ) : (
      <div className='wrapper-center'>{'Live installation progress is not available for this update.'}</div>
    );
  }
}

export default WizardStep6;
