/** @format */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import { withTranslation } from 'react-i18next';

import { Loader } from '../../../../partials';
import UpdatesWizardDetailListItem from './UpdatesWizardDetailListItem';

@inject('stores')
@observer
class UpdatesWizardDetailList extends Component {
  render() {
    const { wizardData, onStep2DataSelect, stores, t } = this.props;
    const { softwareStore } = stores;
    const { selectedHardwares } = wizardData;
    const uniqPackages = _.uniqBy(softwareStore.packages, pack => pack.id.name);
    return (
      <span>
        {softwareStore.packagesFetchAsync.isFetching ? (
          <div className="wrapper-center">
            <Loader />
          </div>
        ) : (
          <>
            {_.map(selectedHardwares, item => (
              <UpdatesWizardDetailListItem
                key={item.name}
                item={item}
                wizardData={wizardData}
                onStep2DataSelect={onStep2DataSelect}
              />
            ))}
            {uniqPackages.length === 1 && (
              <Row>
                <Col span={12}>
                  <div className="information-text">{t('updates.creating.wizard.information_step2')}</div>
                </Col>
              </Row>
            )}
          </>
        )}
      </span>
    );
  }
}

UpdatesWizardDetailList.propTypes = {
  stores: PropTypes.shape({}),
  wizardData: PropTypes.shape({}),
  onStep2DataSelect: PropTypes.func,
  t: PropTypes.func.isRequired
};

export default withTranslation()(UpdatesWizardDetailList);
