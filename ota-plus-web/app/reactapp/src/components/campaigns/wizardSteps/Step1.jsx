/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Row } from 'antd';
import _ from 'lodash';
import serialize from 'form-serialize';
import { OTAForm, FormInput } from '../../../partials';

@observer
class WizardStep1 extends Component {
  static propTypes = {
    wizardData: PropTypes.shape({}).isRequired,
    markStepAsFinished: PropTypes.func.isRequired,
    markStepAsNotFinished: PropTypes.func.isRequired,
  };

  changeCampaignName = () => {
    const { wizardData, markStepAsFinished, markStepAsNotFinished } = this.props;
    const data = serialize(document.querySelector('#add-campaign-name-form'), { hash: true });
    wizardData.name = data.name;
    if (!_.isEmpty(wizardData.name)) markStepAsFinished();
    else markStepAsNotFinished();
  };

  render() {
    const { wizardData } = this.props;
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
              label="Name"
              name="name"
              placeholder="Name"
              id="add-campaign-name-form-input"
              showIcon={false}
              title="Select campaign name"
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

export default WizardStep1;
