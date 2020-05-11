/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { action, observable, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { Loader, DependenciesModal, ConfirmationModal, SecondaryButton } from '../partials';
import SoftwareRepositoryAlpha from '../pages/SoftwareRepositoryAlpha';
import {
  SoftwareCreateModal,
  SoftwareHeader,
  SoftwareList,
  SoftwareDependenciesManager,
  SoftwareEditCommentModal
} from '../components/software';
import {
  ACTIVE_TAB_KEY,
  PACKAGES_DEFAULT_TAB,
  PACKAGES_BLACKLISTED_TAB,
  PACKAGES_ADVANCED_TAB,
  SOFTWARE_ICON,
  PLUS_ICON
} from '../config';
import { MetaData } from '../utils';
import { ANALYTICS_VIEW_SOFTWARE_VERSIONS } from '../constants/analyticsViews';
import { setAnalyticsView } from '../helpers/analyticsHelper';
import ReadMore from '../partials/ReadMore';
import UnderlinedLink from '../partials/UnderlinedLink';
import { URL_SOFTWARE_UPLOAD_METHODS } from '../constants/urlConstants';
import { ImpactAnalysisPage } from '../pages';

@inject('stores')
@observer
class Software extends Component {
  @observable createModalShown = false;

  @observable fileUploaderModalShown = false;

  @observable fileDropped = null;

  @observable copied = false;

  @observable dependenciesModalShown = false;

  @observable dependenciesManagerShown = false;

  @observable activeVersionFilepath = null;

  @observable activeManagerVersion = null;

  @observable deleteConfirmationShown = false;

  @observable expandedPackageName = null;

  @observable itemToDelete = null;

  @observable editCommentShown = false;

  @observable activeComment = '';

  @observable activePackageFilepath = '';

  @observable switchToTab = PACKAGES_DEFAULT_TAB;

  static propTypes = {
    stores: PropTypes.shape({}),
    highlightedPackage: PropTypes.string,
    history: PropTypes.shape({}),
    t: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.componentRef = React.createRef();
    this.updateHeaderTitle();
  }

  componentDidMount() {
    const { stores } = this.props;
    const { softwareStore } = stores;
    this.cancelObserveTabChange = observe(softwareStore, (change) => {
      this.applyTab(change);
    });
    const { history } = this.props;
    const { state } = history.location;
    if (state && state.openWizard) {
      this.showCreateModal();
    }
    setAnalyticsView(ANALYTICS_VIEW_SOFTWARE_VERSIONS);
  }

  componentWillUnmount() {
    if (!_.isUndefined(this.cancelObserveTabChange)) {
      this.cancelObserveTabChange();
    }
  }

  @action setActive = (tab) => {
    const { stores } = this.props;
    const { softwareStore } = stores;
    this.switchToTab = tab;
    softwareStore.activeTab = tab;
    this.updateHeaderTitle();
  };

  resumeScope = () => {
    const { stores } = this.props;
    const { softwareStore } = stores;

    this.setActive(softwareStore.activeTab);
  };

  applyTab = (change) => {
    const { name, newValue } = change;

    if (name === ACTIVE_TAB_KEY) {
      this.setActive(newValue);
    }
  };

  showEditComment = (filepath, comment, e) => {
    if (e) e.preventDefault();
    this.editCommentShown = true;
    this.activeComment = comment;
    this.activePackageFilepath = filepath;
  };

  hideEditComment = (e) => {
    if (e) e.preventDefault();
    this.editCommentShown = false;
    this.activeComment = '';
    this.activePackageFilepath = null;
  };

  setExpandedPackageName = (name) => {
    this.expandedPackageName = name;
    this.updateHeaderTitle();
  };

  deleteItem = (e) => {
    const { stores } = this.props;
    const { softwareStore } = stores;
    if (e) e.preventDefault();
    softwareStore.deletePackage(this.itemToDelete);
    this.hideDeleteConfirmation();
  };

  showDeleteConfirmation = (itemName, itemType, e) => {
    if (e) e.preventDefault();
    this.itemToDelete = itemName;
    this.deleteConfirmationShown = true;
  };

  hideDeleteConfirmation = (e) => {
    if (e) e.preventDefault();
    this.deleteConfirmationShown = false;
  };

  showDependenciesModal = (activeVersionFilepath, e) => {
    if (e) e.preventDefault();
    this.dependenciesModalShown = true;
    this.activeVersionFilepath = activeVersionFilepath;
  };

  hideDependenciesModal = (e) => {
    if (e) e.preventDefault();
    this.dependenciesModalShown = false;
    this.activeVersionFilepath = null;
  };

  showDependenciesManager = (activeManagerVersion, e) => {
    if (e) e.preventDefault();
    this.dependenciesManagerShown = true;
    this.activeManagerVersion = activeManagerVersion;
  };

  hideDependenciesManager = (e) => {
    if (e) e.preventDefault();
    this.dependenciesManagerShown = false;
    this.activeManagerVersion = null;
  };

  showCreateModal = (files, e) => {
    if (e) e.preventDefault();
    this.createModalShown = true;
    this.fileDropped = files ? files[0] : null;
  };

  showFileUploaderModal = (e) => {
    if (e) e.preventDefault();
    this.fileUploaderModalShown = true;
  };

  hideFileUploaderModal = (e) => {
    if (e) e.preventDefault();
    this.fileUploaderModalShown = false;
  };

  handleCopy = (e) => {
    if (e) e.preventDefault();
    this.copied = true;
  };

  hideCreateModal = (e) => {
    if (e) e.preventDefault();
    this.createModalShown = false;
    this.fileDropped = null;
  };

  onFileDrop = (files) => {
    this.showCreateModal(files);
  };

  updateHeaderTitle = () => {
    const { t } = this.props;
    switch (this.switchToTab) {
      case PACKAGES_ADVANCED_TAB:
        this.title = t('software.advanced.title');
        break;
      case PACKAGES_BLACKLISTED_TAB:
        this.title = t('software.tabs.blacklisted');
        break;
      default:
        this.title = t('software.title');
        if (this.expandedPackageName) {
          this.title = t('software.details.title');
        }
        break;
    }
  };

  render() {
    const { stores, highlightedPackage, t } = this.props;
    const { softwareStore } = stores;
    return (
      <span ref={this.componentRef}>
        <MetaData title={this.title}>
          {softwareStore.packagesFetchAsync.isFetching ? (
            <div className="wrapper-center">
              <Loader />
            </div>
          ) : softwareStore.packagesCount ? (
            <div className="packages-container">
              <SoftwareHeader showCreateModal={this.showCreateModal} switchToTab={this.switchToTab} />
              {this.switchToTab === PACKAGES_DEFAULT_TAB && (
                <SoftwareList
                  onFileDrop={this.onFileDrop}
                  highlightedPackage={highlightedPackage}
                  showDependenciesModal={this.showDependenciesModal}
                  showDependenciesManager={this.showDependenciesManager}
                  showDeleteConfirmation={this.showDeleteConfirmation}
                  expandedPackageName={this.expandedPackageName}
                  setExpandedPackageName={this.setExpandedPackageName}
                  showEditComment={this.showEditComment}
                />
              )}
              {this.switchToTab === PACKAGES_ADVANCED_TAB && (
                <SoftwareRepositoryAlpha />
              )}
              {this.switchToTab === PACKAGES_BLACKLISTED_TAB && (
                <ImpactAnalysisPage />
              )}
            </div>
          ) : (
            <div className="wrapper-center">
              <div className="page-intro">
                <img src={SOFTWARE_ICON} alt="Icon" />
                <div>{t('software.empty.no-software-1')}</div>
                <ReadMore>
                  {t('software.empty.no-software-2')}
                  <UnderlinedLink url={URL_SOFTWARE_UPLOAD_METHODS}>{t('miscellaneous.read-more')}</UnderlinedLink>
                </ReadMore>
                <div>
                  <SecondaryButton type="link" id="add-new-software" onClick={this.showCreateModal}>
                    <img src={PLUS_ICON} />
                    {t('software.empty.add-new')}
                  </SecondaryButton>
                </div>
              </div>
            </div>
          )}
          {this.createModalShown && (
          <SoftwareCreateModal
            shown={this.createModalShown}
            hide={this.hideCreateModal}
            fileDropped={this.fileDropped}
          />
          )}
          {this.deleteConfirmationShown && (
            <ConfirmationModal
              modalTitle={(
                <div className="text-red" id="delete-software-title">
                  {t('software.action_buttons.delete_software')}
                </div>
              )}
              shown={this.deleteConfirmationShown}
              hide={this.hideDeleteConfirmation}
              deleteItem={this.deleteItem}
              topText={(
                <div className="delete-modal-top-text" id="delete-software-top-text">
                  {t('software.delete_soft_version.top_text.p1')}
                  <b id={`delete-software-${this.expandedPackageName}`}>{this.expandedPackageName}</b>
                  {t('software.delete_soft_version.top_text.p2')}
                  <b id={`delete-software-${this.expandedPackageName}-version-${this.itemToDelete}`}>
                    {this.itemToDelete}
                  </b>
                  {t('software.delete_soft_version.top_text.p3')}
                </div>
              )}
              bottomText={(
                <div className="delete-modal-bottom-text" id="delete-software-bottom-text">
                  {t('software.delete_soft_version.bottom_text')}
                </div>
              )}
              showDetailedInfo
            />
          )}
          {this.dependenciesModalShown && (
            <DependenciesModal
              shown={this.dependenciesModalShown}
              hide={this.hideDependenciesModal}
              activeItemName={this.activeVersionFilepath}
            />
          )}
          {this.dependenciesManagerShown && (
            <SoftwareDependenciesManager
              shown={this.dependenciesManagerShown}
              hide={this.hideDependenciesManager}
              packages={softwareStore.preparedPackages}
              activePackage={this.activeManagerVersion}
            />
          )}
          {this.editCommentShown && (
            <SoftwareEditCommentModal
              shown={this.editCommentShown}
              hide={this.hideEditComment}
              comment={this.activeComment}
              filepath={this.activePackageFilepath}
            />
          )}
        </MetaData>
      </span>
    );
  }
}

export default withTranslation()(withRouter(Software));
