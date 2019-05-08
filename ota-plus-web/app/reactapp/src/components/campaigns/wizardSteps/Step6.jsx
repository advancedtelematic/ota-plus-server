/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import { Sequencer } from '../../../partials';
import { observable } from 'mobx';

import { getUpdateDetails } from '../../../helpers/updateDetailsHelper';
import { NO_VERSION_INFO } from '../../../constants';

@inject('stores')
@observer
class WizardStep6 extends Component {
  @observable
  updateDetails = [];

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

  componentDidMount() {
    const { stores } = this.props;
    const { updatesStore, softwareStore } = stores;
    const { data: mtuData } = updatesStore.currentMtuData;
    const { packages } = softwareStore;
    this.updateDetails = getUpdateDetails(mtuData, packages);
  }

  prepareVersionData = () => { 
    const versions = [];
    _.each(this.updateDetails, targetDetails => {
      const { hardwareId, fromVersion, toPackage, toVersion, toTarget, checksum } = targetDetails;
      versions.push({
        hardwareId,
        name: toPackage,
        ...(fromVersion ? { from: fromVersion } : { from: NO_VERSION_INFO }),
        to: toVersion,
        filepath: `${toTarget}-${checksum.hash}`,
      });
    });
    return versions;
  };

  render() {
    const { stores, wizardIdentifier } = this.props;
    const { campaignsStore } = stores;
    const versions = this.prepareVersionData();

    return versions.length ? (
      <Sequencer 
        campaignsStore={campaignsStore} 
        wizardIdentifier={wizardIdentifier} 
        data={versions} 
        entity='campaign' 
        readOnly={false} 
      />
    ) : (
      <div className='wrapper-center'>{'Live installation progress is not available for this update.'}</div>
    );
  }
}

export default WizardStep6;
