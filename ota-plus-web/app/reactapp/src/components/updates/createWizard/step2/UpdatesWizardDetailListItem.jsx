/** @format */

import React, { Component } from 'react';
import { Form } from 'formsy-antd';
import _ from 'lodash';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { Row, Col, Checkbox } from 'antd';
import { FormSelect } from '../../../../partials';
import { SOFTWARE_UPDATE_VERSIONS_DATE_FORMAT } from '../../../../constants/datesTimesConstants';
import { getFormattedDateTime } from '../../../../helpers/datesTimesHelper';

@inject('stores')
@observer
class UpdatesWizardDetailListItem extends Component {
  @observable fromVersions = [];

  @observable toVersions = [];

  @observable updateFromAny = false;

  constructor(props) {
    super(props);
    this.fromPackageSelect = React.createRef();
    this.fromVersionSelect = React.createRef();
  }

  formatVersions = (type, name) => {
    const { stores, t } = this.props;
    const { softwareStore } = stores;
    const { preparedPackages } = softwareStore;
    let versions = null;
    _.each(preparedPackages, (packs) => {
      const found = _.find(packs, pack => pack.name === name);
      if (found) {
        const { versions: foundVersions } = found;
        versions = foundVersions;
      }
    });
    const formattedData = versions
      && versions.map(version => ({
        text: `${t('updates.creating.wizard.version.created', { version: version.id.version, date: getFormattedDateTime(version.createdAt, SOFTWARE_UPDATE_VERSIONS_DATE_FORMAT) })}`,
        id: version.id.version,
        value: version.filepath,
        version,
      }));
    if (type === 'from') {
      this.fromVersions = formattedData;
    } else {
      this.toVersions = formattedData;
    }
  };

  toggleUpdateFromAny = () => {
    const { item, onStep2DataSelect } = this.props;
    this.updateFromAny = !this.updateFromAny;
    this.fromPackageSelect.current.setState({ selectedOptions: [] });
    this.fromVersionSelect.current.setState({ selectedOptions: [] });
    onStep2DataSelect(item, 'updateFromAny', this.updateFromAny);
  };

  render() {
    const { item, wizardData, onStep2DataSelect, stores, t } = this.props;
    const { softwareStore } = stores;
    const { update } = wizardData;
    const {
      fromPack,
      toPack,
      fromVersion,
      toVersion
    } = !_.isEmpty(update) && _.isObject(update[item.name]) && update[item.name];
    const uniqPackages = _.uniqBy(softwareStore.packages, pack => pack.id.name);

    const packages = _.map(uniqPackages, pack => ({
      text: pack.id.name,
      id: pack.id.name,
      value: pack.id.name,
      item,
    }));

    return (
      <div className="update-block">
        <Row className="hardware-type">
          <Col span={24}>{item.name}</Col>
        </Row>
        <Row className="no-sw-version">
          <Col span={24}>
            <Checkbox className="no-sw-version__checkbox" onChange={this.toggleUpdateFromAny}>
              {'Update to my selected version regardless of what is currently installed.'}
            </Checkbox>
            {this.updateFromAny && (
              <span className="no-sw-version__warning">
                {t('updates.creating.wizard.no_sw_version_warning')}
              </span>
            )}
          </Col>
        </Row>
        <Row className="header">
          <Col span={12}>From</Col>
          <Col span={12}>To</Col>
        </Row>
        <Row className="packages">
          <Form>
            <Col span={12}>
              <FormSelect
                id={`${item.name}-from-software`}
                ref={this.fromPackageSelect}
                disabled={this.updateFromAny}
                options={packages}
                label="Software"
                multiple={false}
                wrapperWidth="100%"
                visibleFieldsCount={5}
                appendMenuToBodyTag
                placeholder={this.updateFromAny ? 'Any software version' : 'Select from software'}
                defaultValue={!this.updateFromAny && fromPack && fromPack.id && fromPack.id.name}
                onChange={(value) => {
                  if (value && value.id) {
                    this.formatVersions('from', value.id);
                    onStep2DataSelect(item, 'fromPack', value.item);
                  }
                }}
              />
            </Col>
            <Col span={12}>
              <FormSelect
                id={`${item.name}-to-software`}
                options={packages}
                label="Software"
                multiple={false}
                wrapperWidth="100%"
                visibleFieldsCount={5}
                appendMenuToBodyTag
                placeholder="Select to software"
                defaultValue={toPack && toPack.id && toPack.id.name}
                onChange={(value) => {
                  if (value && value.id) {
                    this.formatVersions('to', value.id);
                    onStep2DataSelect(item, 'toPack', value.item);
                  }
                }}
              />
            </Col>
          </Form>
        </Row>
        <Row className="versions">
          <Form>
            <Col span={12}>
              <FormSelect
                id={`${item.name}-from-version`}
                ref={this.fromVersionSelect}
                disabled={this.updateFromAny}
                options={this.fromVersions}
                appendMenuToBodyTag
                label="Version"
                multiple={false}
                placeholder={this.updateFromAny ? 'Any software version' : 'Select from version'}
                visibleFieldsCount={5}
                defaultValue={!this.updateFromAny && fromVersion && fromVersion.id && fromVersion.id.version}
                onChange={(value) => {
                  if (value && value.version) {
                    onStep2DataSelect(item, 'fromVersion', value.version);
                  }
                }}
              />
            </Col>
            <Col span={12}>
              <FormSelect
                id={`${item.name}-to-version`}
                options={this.toVersions}
                appendMenuToBodyTag
                label="Version"
                multiple={false}
                placeholder="Select to version"
                visibleFieldsCount={5}
                defaultValue={toVersion && toVersion.id && toVersion.id.version}
                onChange={(value) => {
                  if (value && value.version) {
                    onStep2DataSelect(item, 'toVersion', value.version);
                  }
                }}
              />
            </Col>
          </Form>
        </Row>
      </div>
    );
  }
}

UpdatesWizardDetailListItem.propTypes = {
  stores: PropTypes.shape({}),
  item: PropTypes.shape({}),
  wizardData: PropTypes.shape({}),
  onStep2DataSelect: PropTypes.func,
  t: PropTypes.func.isRequired
};

export default withTranslation()(UpdatesWizardDetailListItem);
