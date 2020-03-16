/* eslint-disable no-param-reassign */
/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import { Loader, OTAForm, FormSelect, FormInput } from '../../../partials';
import {
  MANAGER_ICON_DANGER_WHITE,
  MANAGER_ICON_SUCCESS,
  MANAGER_ICON_SUCCESS_WHITE,
  MANAGER_ICON_WARNING_WHITE,
} from '../../../config';

const VERSION_CHANGE_TIMEOUT = 500;

@inject('stores')
@observer
class WizardStep5 extends Component {
  @observable blocks = [];

  @observable isLoading = false;

  @observable selectedVersions = [];

  static propTypes = {
    stores: PropTypes.shape({}),
    wizardData: PropTypes.shape({}).isRequired,
    markStepAsFinished: PropTypes.func.isRequired,
    selectVersion: PropTypes.func,
    addToCampaign: PropTypes.func,
    t: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { stores, wizardData, markStepAsFinished } = this.props;
    const { updatesStore } = stores;
    const { update } = wizardData;
    const { source } = _.first(update);
    updatesStore.fetchUpdate(source && source.id);
    markStepAsFinished();
  }

  fetchSelectedVersions = () => {
    const { stores } = this.props;
    const { updatesStore } = stores;
    const { currentMtuData: mtu } = updatesStore;
    _.each(mtu.data, (data) => {
      const { checksum: toVersion, target: toPackage } = data.to;
      this.selectedVersions.push({
        packName: toPackage,
        filepath: `${toPackage}-${toVersion.hash}`,
      });
    });
  };

  checkVersion = (data) => {
    const { stores, markStepAsFinished } = this.props;
    const { softwareStore } = stores;
    this.fetchSelectedVersions();

    const objWithRelations = JSON.parse(localStorage.getItem(data.filepath));
    if (objWithRelations) {
      const requiredPackages = objWithRelations.required;
      const incompatiblePackages = objWithRelations.incompatibles;
      if (requiredPackages) {
        _.each(requiredPackages, (filepath) => {
          let skipAdd = false;
          _.each(this.selectedVersions, (version) => {
            if (version.filepath === filepath) {
              skipAdd = true;
            }
          });
          if (!skipAdd) {
            const childPack = _.find(softwareStore.packages, pack => pack.filepath === filepath);
            const obj = {
              parentPack: data.packName,
              parentFilepath: data.filepath,
              childPack: childPack.id.name,
              childRequiredVersion: childPack.id.version,
              isCompatible: true,
            };
            this.addBlock(obj);
          }
        });
      }
      if (incompatiblePackages) {
        _.each(incompatiblePackages, (filepath) => {
          let isTryingToInstall = false;
          _.each(this.selectedVersions, (version) => {
            if (version.filepath === filepath) {
              isTryingToInstall = true;
            }
          });
          if (isTryingToInstall) {
            const childPack = _.find(softwareStore.packages, pack => pack.filepath === filepath);
            const obj = {
              parentPack: data.packName,
              parentFilepath: data.filepath,
              childPack: childPack.id.name,
              childRequiredVersion: childPack.id.version,
              isCompatible: false,
            };
            this.addBlock(obj);
          }
        });
      }
    }

    if (this.blocks.length <= 0) {
      markStepAsFinished();
    }
  };

  addBlock = (data) => {
    let shouldAdd = true;
    _.each(this.blocks, (block) => {
      if (block.parentPack === data.childPack) {
        shouldAdd = false;
      }
    });
    if (shouldAdd) {
      this.blocks.push(data);
    }
  };

  getPackVersions = (packName) => {
    const { stores } = this.props;
    const { softwareStore } = stores;
    let matchedVersions = [];
    _.each(softwareStore.preparedPackages, (packs) => {
      _.each(packs, (pack) => {
        matchedVersions = pack.packageName === packName ? pack.versions : [];
      });
    });
    return matchedVersions;
  };

  formatVersions = packName => this.getPackVersions(packName).map(version => ({
    id: version.id.version,
    text: version.id.version,
    value: version.filepath,
  }));

  onParentVersionChange = (data, event) => {
    const { selectVersion } = this.props;
    const filepath = event.target.value;
    data.filepath = filepath;
    selectVersion(data);

    const block = _.find(this.blocks, singleBlock => singleBlock.parentPack === data.packageName);
    block.parentFilepath = filepath;

    this.isLoading = true;
    this.blocks = [];
    const obj = {
      packName: data.packageName,
      filepath,
    };
    this.checkVersion(obj);

    const $this = this;
    setTimeout(() => {
      $this.isLoading = false;
    }, VERSION_CHANGE_TIMEOUT);
  };

  render() {
    const { addToCampaign, t } = this.props;
    const isOneIncompatible = _.find(this.blocks, block => !block.isCompatible);
    return (
      <div className="content">
        {this.blocks.length ? (
          isOneIncompatible ? (
            <div className="top-alert danger" id="compatibility-issue">
              <img src={MANAGER_ICON_DANGER_WHITE} alt="Icon" />
              {t('campaigns.wizard.compatibility_issue')}
            </div>
          ) : (
            <div className="top-alert warning" id="missing-dependencies">
              <img src={MANAGER_ICON_WARNING_WHITE} alt="Icon" />
              {t('campaigns.wizard.missing_dependencies')}
            </div>
          )
        ) : (
          <div className="top-alert success" id="success">
            <img src={MANAGER_ICON_SUCCESS_WHITE} alt="Icon" />
            {t('campaigns.wizard.dependencies_check')}
          </div>
        )}
        {this.isLoading ? (
          <div className="wrapper-center">
            <Loader />
          </div>
        ) : this.blocks.length ? (
          <span>
            {_.map(this.blocks, (block, index) => (
              <section className="pair" key={index}>
                <div className="item">
                  <OTAForm formWidth="100%" flexDirection="row" customStyles={{ justifyContent: 'space-between' }}>
                    <FormInput
                      isEditable={false}
                      defaultValue={block.parentPack}
                      label={t('campaigns.wizard.package')}
                      wrapperWidth="49%"
                    />
                    <FormSelect
                      id="from-pack-versions"
                      options={this.formatVersions(block.parentPack)}
                      visibleFieldsCount={this.formatVersions(block.parentPack).length}
                      label={t('campaigns.wizard.version')}
                      wrapperWidth="49%"
                      defaultValue={block.parentFilepath}
                      onChange={() => this.onParentVersionChange(
                        {
                          type: 'to',
                          packageName: block.parentPack,
                        },
                        this,
                      )
                      }
                    />
                  </OTAForm>
                </div>
                {block.isCompatible ? (
                  <div className="status required" id="required">
                    {t('campaigns.wizard.requires')}
                  </div>
                ) : (
                  <div className="status incompatible" id="incompatible">
                    {t('campaigns.wizard.not_compatible_with')}
                  </div>
                )}

                <div className="item">
                  <OTAForm formWidth="100%" flexDirection="row" customStyles={{ justifyContent: 'space-between' }}>
                    <FormInput
                      isEditable={false}
                      defaultValue={block.childPack}
                      label={t('campaigns.wizard.package')}
                      wrapperWidth="49%"
                    />
                    <FormInput
                      isEditable={false}
                      defaultValue={block.childRequiredVersion}
                      label={t('campaigns.wizard.version')}
                      wrapperWidth="49%"
                    />
                  </OTAForm>
                </div>
                <div className="add">
                  {block.isCompatible ? (
                    <button
                      type="button"
                      id="add-to-campaign"
                      className="add-button light"
                      onClick={addToCampaign.bind(this, block.childPack)}
                    >
                      <span>+</span>
                      <span>{t('campaigns.wizard.add_to_campaign')}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      href="#"
                      id="change-version"
                      className="add-button light"
                      onClick={addToCampaign.bind(this, block.childPack)}
                    >
                      <span>+</span>
                      <span>{t('campaigns.wizard.change_version')}</span>
                    </button>
                  )}
                </div>
              </section>
            ))}
          </span>
        ) : (
          <div className="wrapper-center">
            <div className="step-pass" id="step-pass">
              <img src={MANAGER_ICON_SUCCESS} alt="Icon" />
              {t('campaigns.wizard.no_dependency_issues')}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withTranslation()(WizardStep5);
