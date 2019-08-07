/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Row } from 'antd';
import _ from 'lodash';
import serialize from 'form-serialize';
import { withTranslation } from 'react-i18next';

import { OTAForm, FormInput } from '../../../partials';

@observer
class WizardStep1 extends Component {
  static propTypes = {
    wizardData: PropTypes.shape({}).isRequired,
    markStepAsFinished: PropTypes.func.isRequired,
    markStepAsNotFinished: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  changeCampaignName = () => {
    const { wizardData, markStepAsFinished, markStepAsNotFinished } = this.props;
    const data = serialize(document.querySelector('#add-campaign-name-form'), { hash: true });
    wizardData.name = data.name;
    if (!_.isEmpty(wizardData.name)) markStepAsFinished();
    else markStepAsNotFinished();
  };

  render() {
    const { wizardData, t } = this.props;
    const { name: campaignName } = wizardData;
    return (
      <div className="step-wrapper">
        <div>
          <Row className="gutter-bottom">
            Use campaigns to push software updates to specific device groups.
            Before you continue, make sure that you&apos;ve created the necessary updates and device groups.
          </Row>
          <OTAForm formWidth="60%" id="add-campaign-name-form" onSubmit={e => e.preventDefault()}>
            <FormInput
              label={t('campaigns.wizard.name')}
              name="name"
              placeholder={t('campaigns.wizard.name')}
              id="add-campaign-name-form-input"
              showIcon={false}
              title={t('campaigns.wizard.select_campaign_name')}
              previousValue={campaignName}
              onValid={this.changeCampaignName}
              onInvalid={this.changeCampaignName}
            />
          </OTAForm>
        </div>
      </div>
    );
  }
}

export default withTranslation()(WizardStep1);
