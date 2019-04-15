/** @format */

import React, { Component } from 'react';
import { Form } from 'formsy-antd';
import _ from 'lodash';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { FormSelect } from '../../../../partials';
import { Row, Col, Checkbox } from 'antd';

@inject('stores')
@observer
class UpdatesWizardDetailListItem extends Component {
  @observable fromVersions = [];
  @observable toVersions = [];
  @observable updateFromAny = false;

  constructor(props) {
    super(props);
    this.fromVersionSelect = React.createRef();
  }

  formatVersions = (type, name) => {
    const { softwareStore } = this.props.stores;
    const { preparedPackages } = softwareStore;
    let versions = null;
    _.each(preparedPackages, packs => {
      const found = _.find(packs, pack => pack.name === name);
      if (found) {
        versions = found.versions;
      }
    });
    const formattedData =
      versions &&
      versions.map(version => {
        return {
          text: `${version.id.version} Created at: ${moment(version.createdAt).format('ddd MMM DD YYYY, h:mm:ss A')}`,
          id: version.id.version,
          value: version.filepath,
          version,
        };
      });
    if (type === 'from') {
      this.fromVersions = formattedData;
    } else {
      this.toVersions = formattedData;
    }
  };

  toggleUpdateFromAny = () => {
    const { item, onStep2DataSelect } = this.props;
    this.updateFromAny = !this.updateFromAny;
    this.fromVersionSelect.current.setState({ selectedOptions: [] });
    onStep2DataSelect(item, 'updateFromAny', this.updateFromAny);
  };

  render() {
    const { item, wizardData, onStep2DataSelect } = this.props;
    const { softwareStore } = this.props.stores;
    const { update } = wizardData;
    const { fromPack, toPack, fromVersion, toVersion } = !_.isEmpty(update) && _.isObject(update[item.name]) && update[item.name];
    let uniqPackages = _.uniqBy(softwareStore.packages, item => {
      return item.id.name;
    });

    const packages = _.map(uniqPackages, item => {
      return {
        text: item.id.name,
        id: item.id.name,
        value: item.id.name,
        item,
      };
    });

    return (
      <div className='update-block'>
        <Row className='hardware-type'>
          <Col span={24}>{item.name}</Col>
        </Row>
        <Row className='header'>
          <Col span={12}>From</Col>
          <Col span={12}>To</Col>
        </Row>
        <Row className='packages'>
          <Form>
            <Col span={12}>
              <FormSelect
                id={`${item.name}-from-software`}
                options={packages}
                label='Software'
                multiple={false}
                wrapperWidth='100%'
                visibleFieldsCount={5}
                appendMenuToBodyTag={true}
                placeholder={'Select from software'}
                defaultValue={fromPack && fromPack.id && fromPack.id.name}
                onChange={value => {
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
                label='Software'
                multiple={false}
                wrapperWidth='100%'
                visibleFieldsCount={5}
                appendMenuToBodyTag={true}
                placeholder='Select to software'
                defaultValue={toPack && toPack.id && toPack.id.name}
                onChange={value => {
                  if (value && value.id) {
                    this.formatVersions('to', value.id);
                    onStep2DataSelect(item, 'toPack', value.item);
                  }
                }}
              />
            </Col>
          </Form>
        </Row>
        <Row className='versions'>
          <Form>
            <Col span={12}>
              <FormSelect
                id={`${item.name}-from-version`}
                ref={this.fromVersionSelect}
                disabled={this.updateFromAny}
                options={this.fromVersions}
                appendMenuToBodyTag={true}
                label='Version'
                multiple={false}
                placeholder={this.updateFromAny ? 'Any' : 'Select from version'}
                visibleFieldsCount={5}
                defaultValue={fromVersion && fromVersion.id && fromVersion.id.version}
                onChange={value => {
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
                appendMenuToBodyTag={true}
                label='Version'
                multiple={false}
                placeholder='Select to version'
                visibleFieldsCount={5}
                defaultValue={toVersion && toVersion.id && toVersion.id.version}
                onChange={value => {
                  if (value && value.version) {
                    onStep2DataSelect(item, 'toVersion', value.version);
                  }
                }}
              />
            </Col>
          </Form>
        </Row>
        <Row>
          <Col span={24}>
            <Checkbox className="no-sw-version-checkbox" onChange={this.toggleUpdateFromAny}>
              {'Do not specify the origin SW version. This may result in potential compatibility conflicts between some origin SW version and the target SW versions, or between this SW version and another SW of the update.'}
            </Checkbox>
          </Col>
        </Row>
      </div>
    );
  }
}

UpdatesWizardDetailListItem.propTypes = {
  stores: PropTypes.object,
  item: PropTypes.object,
  wizardData: PropTypes.object,
  onStep2DataSelect: PropTypes.func,
};

export default UpdatesWizardDetailListItem;
