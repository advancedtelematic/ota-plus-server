/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { Dropdown } from '../../partials';
import { FEATURES, isFeatureEnabled, UI_FEATURES } from '../../config';
import { sendAction } from '../../helpers/analyticsHelper';
import {
  OTA_SOFTWARE_DELETE_VERSION,
  OTA_SOFTWARE_EDIT_COMMENT,
  OTA_SOFTWARE_EDIT_DEPENDENCIES
} from '../../constants/analyticsActions';
import { SOFTWARE_VERSION_DATE_FORMAT } from '../../constants/datesTimesConstants';
import { getFormattedDateTime } from '../../helpers/datesTimesHelper';

@inject('stores')
@observer
class ListItemVersion extends Component {
  @observable isShown = false;

  constructor(props) {
    super(props);
    this.showDeleteConfirmation = this.showDeleteConfirmation.bind(this);
    this.showEditComment = this.showEditComment.bind(this);
    this.showDependenciesManager = this.showDependenciesManager.bind(this);
  }

  hideSubmenu = () => {
    this.isShown = false;
  };

  showSubmenu = () => {
    this.isShown = true;
  };

  showDeleteConfirmation(itemName, itemType) {
    const { showDeleteConfirmation } = this.props;
    showDeleteConfirmation(itemName, itemType);
    sendAction(OTA_SOFTWARE_DELETE_VERSION);
  }

  showEditComment(filePath, comment) {
    const { showEditComment } = this.props;
    showEditComment(filePath, comment);
    sendAction(OTA_SOFTWARE_EDIT_COMMENT);
  }

  showDependenciesManager(version) {
    const { showDependenciesManager } = this.props;
    showDependenciesManager(version);
    sendAction(OTA_SOFTWARE_EDIT_DEPENDENCIES);
  }

  render() {
    const { stores, version, t } = this.props;
    const { softwareStore, featuresStore, userStore } = stores;
    const { compatibilityData } = softwareStore;
    const { features } = featuresStore;
    const isDependencySoftwareEnabled = features.includes(FEATURES.DEPENDENCY_SOFTWARE);
    const packageName = version.id.name;
    let borderStyle = {
      borderLeft: '10px solid #e1e1e1',
    };
    if (version.installedOnEcus > 0) {
      borderStyle = {
        borderLeft: `10px solid ${version.color}`,
      };
    }

    /*
     *  ToDo: according to softwareStore._getAllStorage()
     */
    let versionCompatibilityData = null;
    if (isDependencySoftwareEnabled && Object.keys(compatibilityData)) {
      versionCompatibilityData = _.find(compatibilityData, item => item && item.name === version.filepath);
    }

    const directorBlock = (
      <span>
        <div className="c-package__sw-box">
          <div className="c-package__heading">{t('software.details.version_no_colon')}</div>
          <div className="c-package__sw-wrapper">
            {version.customExists ? (
              <span>
                <div className="c-package__sw-row">
                  <span className="c-package__sw-subtitle">{t('software.details.version')}</span>
                  <span className="c-package__sw-value" id={`package-${packageName}-version-${version.id.version.substring(0, 8)}`}>
                    {version.id.version}
                  </span>
                </div>
                <div className="c-package__sw-row">
                  <span className="c-package__sw-subtitle">{t('software.details.created-at')}</span>
                  <span className="c-package__sw-value" id={`package-${packageName}-created-at-${version.id.version.substring(0, 8)}`}>
                    {getFormattedDateTime(version.createdAt, SOFTWARE_VERSION_DATE_FORMAT)}
                  </span>
                </div>
                <div className="c-package__sw-row">
                  <span className="c-package__sw-subtitle">{t('software.details.updated-at')}</span>
                  <span className="c-package__sw-value" id={`package-${packageName}-updated-at-${version.id.version.substring(0, 8)}`}>
                    {getFormattedDateTime(version.updatedAt, SOFTWARE_VERSION_DATE_FORMAT)}
                  </span>
                </div>
                <div className="c-package__sw-row">
                  <span className="c-package__sw-subtitle">{t('software.details.hash')}</span>
                  <span className="c-package__sw-value" id={`package-${packageName}-hash-${version.id.version.substring(0, 8)}`}>
                    {version.packageHash}
                  </span>
                </div>
                <div className="c-package__sw-row">
                  <span className="c-package__sw-subtitle">{t('software.details.length')}</span>
                  <span className="c-package__sw-value" id={`package-${packageName}-target-length-${version.id.version.substring(0, 8)}`}>
                    {version.targetLength}
                  </span>
                </div>
              </span>
            ) : (
              <span>
                <div className="c-package__sw-row">
                  <span className="c-package__sw-subtitle">{t('software.details.hash')}</span>
                  <span className="c-package__sw-value" id={`package-${packageName}-hash-${version.id.version.substring(0, 8)}`}>
                    {version.packageHash}
                  </span>
                </div>
                <div className="c-package__sw-row">
                  <span className="c-package__sw-subtitle">{t('software.details.length')}</span>
                  <span className="c-package__sw-value" id={`package-${packageName}-target-length-${version.id.version.substring(0, 8)}`}>
                    {version.targetLength}
                  </span>
                </div>
              </span>
            )}
          </div>
          <div className="c-package__sw-wrapper">
            <div className="c-package__hw-row">
              <div className="c-package__sw-subtitle">{t('software.details.ecu_types')}</div>
              <div className="c-package__hw-value">
                {_.map(version.hardwareIds, (hardwareId, index) => (
                  <span
                    className="app-label"
                    key={index}
                    id={`package-${packageName}-app-label-${version.id.version.substring(0, 8)}`}
                  >
                    {hardwareId}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {version.targetFormat && (
            <div className="c-package__sw-wrapper">
              <div className="c-package__hw-row">
                <div className="c-package__sw-subtitle">{t('software.details.format')}</div>
                <div className="c-package__hw-value">
                  <span
                    className="app-label"
                    id={`package-${packageName}-app-format-${version.id.version.substring(0, 8)}`}
                  >
                    {version.targetFormat}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="c-package__sw-wrapper">
            <div className="c-package__subheading">
              <span id={`package-${packageName}-installed-on-ecus-count-${version.id.version.substring(0, 8)}`}>
                {t('software.installed_on_count', { count: version.installedOnEcus })}
              </span>
            </div>
          </div>
        </div>
        <div className="c-package__inner-box">
          <div className="c-package__comment">
            <div className="c-package__heading">{t('software.details.comment')}</div>
            <textarea
              className="c-package__comment-value"
              name="comment-stick"
              rows="5"
              value={version.comment}
              disabled
              id={`package-${packageName}-comment-${version.id.version.substring(0, 8)}`}
            />
          </div>
          {isDependencySoftwareEnabled && (
            <div className="c-package__manager">
              <div className="c-package__heading">{t('software.dependencies.title')}</div>
              <div className="c-package__manager-content">
                {versionCompatibilityData && versionCompatibilityData.required.length && (
                  <div className="c-package__relations" id="required">
                    <div className="c-package__heading">{t('software.dependencies.required')}</div>
                    {_.map(versionCompatibilityData.required, (filepath, i) => {
                      const pack = _.find(softwareStore.packages, item => item.filepath === filepath);
                      return (
                        <div className="c-package__relation-item" key={i}>
                          <span className="c-package__relation-name" id={`required-${pack.id.name}`}>
                            {pack.id.name}
                          </span>
                          <span className="c-package__relation-version" id={`required-${pack.id.version}`}>
                            {pack.id.version}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {versionCompatibilityData && versionCompatibilityData.incompatibles.length && (
                  <div className="c-package__relations" id="not-compatible">
                    <div className="c-package__heading">{t('software.dependencies.not_compatible')}</div>
                    {_.map(versionCompatibilityData.incompatibles, (filepath, i) => {
                      const pack = _.find(softwareStore.packages, item => item.filepath === filepath);
                      return (
                        <div className="c-package__relation-item" key={i}>
                          <span className="c-package__relation-name" id={`not-compatible-${pack.id.name}`}>
                            {pack.id.name}
                          </span>
                          <span className="c-package__relation-version" id={`not-compatible-${pack.id.version}`}>
                            {pack.id.version}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {versionCompatibilityData && versionCompatibilityData.requiredBy.length && (
                  <div className="c-package__relations" id="required-by">
                    <div className="c-package__heading">{t('software.dependencies.required_by')}</div>
                    {_.map(versionCompatibilityData.requiredBy, (filepath, i) => {
                      const pack = _.find(softwareStore.packages, item => item.filepath === filepath);
                      return (
                        <div className="c-package__relation-item" key={i}>
                          <span className="c-package__relation-name" id={`required-by-${pack.id.version}`}>
                            {pack.id.name}
                          </span>
                          <span className="c-package__relation-version" id={`required-by-${pack.id.version}`}>
                            {pack.id.version}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div
          className="dots"
          onClick={this.showSubmenu}
          id={`package-${packageName}-comment-overlay-${version.id.version.substring(0, 8)}`}
        >
          <span />
          <span />
          <span />
          {this.isShown && (
            <Dropdown hideSubmenu={this.hideSubmenu}>
              {isFeatureEnabled(userStore.uiFeatures, UI_FEATURES.EDIT_SOFTWARE_COMMENT) && (
                <li className="package-dropdown-item">
                  <a
                    className="package-dropdown-item"
                    href="#"
                    id="edit-comment"
                    onClick={(e) => {
                      e.preventDefault();
                      this.showEditComment(version.filepath, version.comment);
                    }}
                  >
                    {t('software.action_buttons.edit_comment')}
                  </a>
                </li>
              )}
              {isDependencySoftwareEnabled && (
                <li className="package-dropdown-item">
                  <a
                    className="package-dropdown-item"
                    href="#"
                    id="show-dependencies"
                    onClick={(e) => {
                      e.preventDefault();
                      this.showDependenciesManager(version);
                    }}
                  >
                    {t('software.action_buttons.edit_dependencies')}
                  </a>
                </li>
              )}
              {isFeatureEnabled(userStore.uiFeatures, UI_FEATURES.DELETE_SOFTWARE_VERSION) && (
                <li className="package-dropdown-item">
                  <a
                    className="package-dropdown-item"
                    href="#"
                    id="delete-version"
                    onClick={(e) => {
                      e.preventDefault();
                      this.showDeleteConfirmation(version.filepath, 'version');
                    }}
                  >
                    {t('software.action_buttons.delete_version')}
                  </a>
                </li>
              )}
            </Dropdown>
          )}
        </div>
      </span>
    );
    return (
      <span>
        <li
          className="c-package__version-item"
          data-installed={version.installedOnEcus}
          style={borderStyle}
          id={`package-${packageName}-version`}
        >
          {directorBlock}
        </li>
      </span>
    );
  }
}

ListItemVersion.propTypes = {
  version: PropTypes.shape({}).isRequired,
  stores: PropTypes.shape({}),
  showDependenciesManager: PropTypes.func,
  showDeleteConfirmation: PropTypes.func,
  showEditComment: PropTypes.func,
  t: PropTypes.func.isRequired
};

export default withTranslation()(ListItemVersion);
