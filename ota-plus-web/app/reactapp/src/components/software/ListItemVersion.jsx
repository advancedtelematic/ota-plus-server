/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import _ from 'lodash';
import { Dropdown } from '../../partials';

@inject('stores')
@observer
class ListItemVersion extends Component {
  @observable isShown = false;

  hideSubmenu = () => {
    this.isShown = false;
  };

  showSubmenu = () => {
    this.isShown = true;
  };

  render() {
    const { stores, version, showDependenciesModal, showDependenciesManager, showDeleteConfirmation, showEditComment } = this.props;
    const { softwareStore, featuresStore } = stores;
    const { compatibilityData } = softwareStore;
    // const { alphaPlusEnabled } = featuresStore;
    // ToDo: this is a quick & dirty switch to locally disable alpha plus
    const alphaPlusEnabled = false;
    const packageName = version.id.name;
    let borderStyle = {
      borderLeft: '10px solid #e1e1e1',
    };
    if (version.installedOnEcus > 0) {
      borderStyle = {
        borderLeft: `10px solid ${version.color}`,
      };
    }

    /* ToDo: according to softwareStore._getAllStorage()
     *
    let versionCompatibilityData = null;
    if (alphaPlusEnabled && Object.keys(compatibilityData).length) {
      versionCompatibilityData = _.find(softwareStore.compatibilityData, item => item.name === version.filepath);
    }*/

    const directorBlock = (
      <span>
        <div className='c-package__sw-box'>
          <div className='c-package__heading'>Version</div>
          <div className='c-package__sw-wrapper'>
            {version.customExists ? (
              <span>
                <div className='c-package__sw-row'>
                  <span className='c-package__sw-subtitle'>Version:</span>
                  <span className='c-package__sw-value' id={`package-${packageName}-version-${version.id.version.substring(0, 8)}`}>
                    {version.id.version}
                  </span>
                </div>
                <div className='c-package__sw-row'>
                  <span className='c-package__sw-subtitle'>Created at:</span>
                  <span className='c-package__sw-value' id={`package-${packageName}-created-at-${version.id.version.substring(0, 8)}`}>
                    {moment(version.createdAt).format('ddd MMM DD YYYY, h:mm:ss A')}
                  </span>
                </div>
                <div className='c-package__sw-row'>
                  <span className='c-package__sw-subtitle'>Updated at:</span>
                  <span className='c-package__sw-value' id={`package-${packageName}-updated-at-${version.id.version.substring(0, 8)}`}>
                    {moment(version.updatedAt).format('ddd MMM DD YYYY, h:mm:ss A')}
                  </span>
                </div>
                <div className='c-package__sw-row'>
                  <span className='c-package__sw-subtitle'>Hash:</span>
                  <span className='c-package__sw-value' id={`package-${packageName}-hash-${version.id.version.substring(0, 8)}`}>
                    {version.packageHash}
                  </span>
                </div>
                <div className='c-package__sw-row'>
                  <span className='c-package__sw-subtitle'>Length:</span>
                  <span className='c-package__sw-value' id={`package-${packageName}-target-length-${version.id.version.substring(0, 8)}`}>
                    {version.targetLength}
                  </span>
                </div>
              </span>
            ) : (
              <span>
                <div className='c-package__sw-row'>
                  <span className='c-package__sw-subtitle'>Hash:</span>
                  <span className='c-package__sw-value' id={`package-${packageName}-hash-${version.id.version.substring(0, 8)}`}>
                    {version.packageHash}
                  </span>
                </div>
                <div className='c-package__sw-row'>
                  <span className='c-package__sw-subtitle'>Length:</span>
                  <span className='c-package__sw-value' id={`package-${packageName}-target-length-${version.id.version.substring(0, 8)}`}>
                    {version.targetLength}
                  </span>
                </div>
              </span>
            )}
          </div>
          <div className='c-package__sw-wrapper'>
            <div className='c-package__hw-row'>
              Installed on <span id={`package-${packageName}-installed-on-ecus-count-${version.id.version.substring(0, 8)}`}>{version.installedOnEcus}</span> ECU(s)
            </div>
          </div>
          <div className='c-package__sw-wrapper'>
            <div className='c-package__hw-row'>
              <div className='c-package__subheading'>ECU types:</div>
              <div className='c-package__hw-value'>
                {_.map(version.hardwareIds, (hardwareId, index) => (
                  <span className='app-label' key={index} id={`package-${packageName}-app-label-${version.id.version.substring(0, 8)}`}>
                    {hardwareId}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {version.targetFormat ? (
            <div className='c-package__sw-wrapper'>
              <div className='c-package__hw-row'>
                <div className='c-package__sw-subtitle'>Format:</div>
                <div className='c-package__hw-value'>
                  <span className='app-label' id={`package-${packageName}-app-format-${version.id.version.substring(0, 8)}`}>
                    {version.targetFormat}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className='c-package__inner-box'>
          <div className='c-package__comment'>
            <div className='c-package__heading'>Comment</div>
            <textarea className='c-package__comment-value' name='comment-stick' rows='5' value={version.comment} disabled id={`package-${packageName}-comment-${version.id.version.substring(0, 8)}`} />
          </div>
          {alphaPlusEnabled && (
            <div className='c-package__manager'>
              <div className='c-package__heading'>Dependencies</div>
              <div className='c-package__manager-content'>
                {versionCompatibilityData && versionCompatibilityData.required.length && (
                  <div className='c-package__relations' id='required'>
                    <div className='c-package__heading'>Required</div>
                    {_.map(versionCompatibilityData.required, (filepath, i) => {
                      const pack = _.find(softwareStore.packages, item => item.filepath === filepath);
                      return (
                        <div className='c-package__relation-item' key={i}>
                          <span className='c-package__relation-name' id={`required-${pack.id.name}`}>
                            {pack.id.name}
                          </span>
                          <span className='c-package__relation-version' id={`required-${pack.id.version}`}>
                            {pack.id.version}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {versionCompatibilityData && versionCompatibilityData.incompatibles.length && (
                  <div className='c-package__relations' id='not-compatible'>
                    <div className='c-package__heading'>Not compatible:</div>
                    {_.map(versionCompatibilityData.incompatibles, (filepath, i) => {
                      const pack = _.find(softwareStore.packages, item => item.filepath === filepath);
                      return (
                        <div className='c-package__relation-item' key={i}>
                          <span className='c-package__relation-name' id={`not-compatible-${pack.id.name}`}>
                            {pack.id.name}
                          </span>
                          <span className='c-package__relation-version' id={`not-compatible-${pack.id.version}`}>
                            {pack.id.version}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {versionCompatibilityData && versionCompatibilityData.requiredBy.length && (
                  <div className='c-package__relations' id='required-by'>
                    <div className='c-package__heading'>Required by:</div>
                    {_.map(versionCompatibilityData.requiredBy, (filepath, i) => {
                      const pack = _.find(softwareStore.packages, item => item.filepath === filepath);
                      return (
                        <div className='c-package__relation-item' key={i}>
                          <span className='c-package__relation-name' id={`required-by-${pack.id.version}`}>
                            {pack.id.name}
                          </span>
                          <span className='c-package__relation-version' id={`required-by-${pack.id.version}`}>
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
        <div className='dots' onClick={this.showSubmenu} id={`package-${packageName}-comment-overlay-${version.id.version.substring(0, 8)}`}>
          <span />
          <span />
          <span />

          {this.isShown && (
            <Dropdown hideSubmenu={this.hideSubmenu}>
              <li className='package-dropdown-item'>
                <a className='package-dropdown-item' href='#' id='edit-comment' onClick={showEditComment.bind(this, version.filepath, version.comment)}>
                  <img src='/assets/img/icons/edit_icon.svg' alt='Icon' />
                  Edit comment
                </a>
              </li>
              {alphaPlusEnabled && (
                <li className='package-dropdown-item'>
                  <i className='icon icon-dependencies' />
                  <a className='package-dropdown-item' href='#' id='show-dependencies' onClick={showDependenciesManager.bind(this, version)}>
                    Edit dependencies
                  </a>
                </li>
              )}
              <li className='package-dropdown-item'>
                <a className='package-dropdown-item' href='#' id='delete-version' onClick={showDeleteConfirmation.bind(this, version.filepath, 'version')}>
                  <img src='/assets/img/icons/trash_icon.svg' alt='Icon' />
                  Delete version
                </a>
              </li>
            </Dropdown>
          )}
        </div>
      </span>
    );
    return (
      <span>
        <li className='c-package__version-item' data-installed={version.installedOnEcus} style={borderStyle} id={`package-${packageName}-version`}>
          {directorBlock}
        </li>
      </span>
    );
  }
}

ListItemVersion.propTypes = {
  version: PropTypes.object.isRequired,
  stores: PropTypes.object,
};

export default ListItemVersion;