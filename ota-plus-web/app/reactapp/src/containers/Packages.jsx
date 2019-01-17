/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Loader, DependenciesModal, ConfirmationModal } from '../partials';
import { SoftwareRepository } from '../pages';
import { PackagesCreateModal, PackagesHeader, PackagesList, PackagesDependenciesManager, PackagesEditCommentModal } from '../components/packages';

@inject('stores')
@observer
class Packages extends Component {
  @observable
  createModalShown = false;
  @observable
  fileUploaderModalShown = false;
  @observable
  fileDropped = null;
  @observable
  copied = false;
  @observable
  dependenciesModalShown = false;
  @observable
  dependenciesManagerShown = false;
  @observable
  activeVersionFilepath = null;
  @observable
  activeManagerVersion = null;
  @observable
  deleteConfirmationShown = false;
  @observable
  expandedPackageName = null;
  @observable
  itemToDelete = null;
  @observable
  editCommentShown = false;
  @observable
  activeComment = '';
  @observable
  activePackageFilepath = '';

  showEditComment = (filepath, comment, e) => {
    if (e) e.preventDefault();
    this.editCommentShown = true;
    this.activeComment = comment;
    this.activePackageFilepath = filepath;
  };

  hideEditComment = e => {
    if (e) e.preventDefault();
    this.editCommentShown = false;
    this.activeComment = '';
    this.activePackageFilepath = null;
  };

  setExpandedPackageName = name => {
    this.expandedPackageName = name;
  };

  deleteItem = e => {
    if (e) e.preventDefault();
    const { packagesStore } = this.props.stores;
    packagesStore.deletePackage(this.itemToDelete);
    this.hideDeleteConfirmation();
  };

  showDeleteConfirmation = (itemName, itemType, e) => {
    if (e) e.preventDefault();
    this.itemToDelete = itemName;
    this.deleteConfirmationShown = true;
  };

  hideDeleteConfirmation = e => {
    if (e) e.preventDefault();
    this.deleteConfirmationShown = false;
  };

  showDependenciesModal = (activeVersionFilepath, e) => {
    if (e) e.preventDefault();
    this.dependenciesModalShown = true;
    this.activeVersionFilepath = activeVersionFilepath;
  };

  hideDependenciesModal = e => {
    if (e) e.preventDefault();
    this.dependenciesModalShown = false;
    this.activeVersionFilepath = null;
  };

  showDependenciesManager = (activeManagerVersion, e) => {
    if (e) e.preventDefault();
    this.dependenciesManagerShown = true;
    this.activeManagerVersion = activeManagerVersion;
  };

  hideDependenciesManager = e => {
    if (e) e.preventDefault();
    this.dependenciesManagerShown = false;
    this.activeManagerVersion = null;
  };

  showCreateModal = (files, e) => {
    if (e) e.preventDefault();
    this.createModalShown = true;
    this.fileDropped = files ? files[0] : null;
  };

  showFileUploaderModal = e => {
    if (e) e.preventDefault();
    this.fileUploaderModalShown = true;
  };

  hideFileUploaderModal = e => {
    if (e) e.preventDefault();
    this.fileUploaderModalShown = false;
  };

  handleCopy = e => {
    if (e) e.preventDefault();
    this.copied = true;
  };

  hideCreateModal = e => {
    if (e) e.preventDefault();
    this.createModalShown = false;
    this.fileDropped = null;
  };

  onFileDrop = files => {
    this.showCreateModal(files);
  };

  render() {
    const { highlightedPackage, switchToSWRepo } = this.props;
    const { packagesStore } = this.props.stores;
    return (
      <span ref='component'>
        {packagesStore.packagesFetchAsync.isFetching ? (
          <div className='wrapper-center'>
            <Loader />
          </div>
        ) : packagesStore.packagesCount ? (
          <span>
            {!switchToSWRepo ? <PackagesHeader showCreateModal={this.showCreateModal} /> : null}
            {!switchToSWRepo ? (
              <PackagesList
                onFileDrop={this.onFileDrop}
                highlightedPackage={highlightedPackage}
                showDependenciesModal={this.showDependenciesModal}
                showDependenciesManager={this.showDependenciesManager}
                showDeleteConfirmation={this.showDeleteConfirmation}
                expandedPackageName={this.expandedPackageName}
                setExpandedPackageName={this.setExpandedPackageName}
                showEditComment={this.showEditComment}
              />
            ) : (
              <SoftwareRepository />
            )}
          </span>
        ) : (
          <div className='wrapper-center'>
            <div className='page-intro'>
              <div>
                <img src='/assets/img/icons/white/packages.svg' alt='Icon' />
              </div>
              <div>{"You haven't created any packages yet."}</div>
              <div>
                <a href='#' className='add-button light' id='add-new-package' onClick={this.showCreateModal.bind(this, null)}>
                  <span>+</span>
                  <span>Add new package</span>
                </a>
              </div>
            </div>
          </div>
        )}
        {this.createModalShown ? <PackagesCreateModal shown={this.createModalShown} hide={this.hideCreateModal} fileDropped={this.fileDropped} /> : null}
        {this.deleteConfirmationShown ? (
          <ConfirmationModal
            modalTitle={
              <div className='text-red' id='delete-package-title'>
                Delete package
              </div>
            }
            shown={this.deleteConfirmationShown}
            hide={this.hideDeleteConfirmation}
            deleteItem={this.deleteItem}
            topText={
              <div className='delete-modal-top-text' id='delete-package-top-text'>
                Remove <b id={'delete-package-' + this.expandedPackageName}>{this.expandedPackageName}</b> v.
                <b id={'delete-package-' + this.expandedPackageName + '-version-' + this.itemToDelete}>{this.itemToDelete}</b> permanently?
              </div>
            }
            bottomText={
              <div className='delete-modal-bottom-text' id='delete-package-bottom-text'>
                If the package is part of any active campaigns, any devices that haven't installed it will fail the campaign.
              </div>
            }
            showDetailedInfo={true}
          />
        ) : null}
        {this.dependenciesModalShown ? <DependenciesModal shown={this.dependenciesModalShown} hide={this.hideDependenciesModal} activeItemName={this.activeVersionFilepath} /> : null}
        {this.dependenciesManagerShown ? (
          <PackagesDependenciesManager shown={this.dependenciesManagerShown} hide={this.hideDependenciesManager} packages={packagesStore.preparedPackages} activePackage={this.activeManagerVersion} />
        ) : null}
        {this.editCommentShown ? <PackagesEditCommentModal shown={this.editCommentShown} hide={this.hideEditComment} comment={this.activeComment} filepath={this.activePackageFilepath} /> : null}
      </span>
    );
  }
}

Packages.propTypes = {
  stores: PropTypes.object,
  highlightedPackage: PropTypes.string,
};

export default Packages;
