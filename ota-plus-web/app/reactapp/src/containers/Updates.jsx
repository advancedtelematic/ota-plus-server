/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Pagination } from 'antd';
import { withTranslation } from 'react-i18next';

import { UpdateCreateModal, UpdateHeader, UpdateList } from '../components/updates';
import { Loader, SecondaryButton } from '../partials';

import { UPDATE_ICON, UPDATES_FETCH_ASYNC, UPDATES_LIMIT_PER_PAGE, PLUS_ICON } from '../config';
import { MetaData } from '../utils';
import { sendAction, setAnalyticsView } from '../helpers/analyticsHelper';
import {
  OTA_UPDATES_SEE_ALL,
  OTA_UPDATES_SEE_DETAILS,
  OTA_UPDATES_SEARCH_UPDATE
} from '../constants/analyticsActions';
import { ANALYTICS_VIEW_SOFTWARE_UPDATES } from '../constants/analyticsViews';
import ReadMore from '../partials/ReadMore';
import UnderlinedLink from '../partials/UnderlinedLink';
import { URL_UPDATES_INTRO } from '../constants/urlConstants';

const PAGE_NUMBER_DEFAULT = 1;

@inject('stores')
@observer
class Updates extends Component {
  @observable
  createModalShown = false;

  @observable
  updateDetailsShown = false;

  @observable
  selectedUpdate = null;

  constructor(props) {
    super(props);
    const { t } = props;
    this.componentRef = React.createRef();
    this.state = { pageNumber: PAGE_NUMBER_DEFAULT };
    this.title = t('updates.title');
  }

  componentDidMount() {
    sendAction(OTA_UPDATES_SEE_ALL);
    const { history } = this.props;
    const { state } = history.location;
    if (state && state.openWizard) {
      this.showCreateModal();
    }
    setAnalyticsView(ANALYTICS_VIEW_SOFTWARE_UPDATES);
  }

  showCreateModal = (e) => {
    if (e) e.preventDefault();
    this.createModalShown = true;
  };

  hideCreateModal = (e) => {
    if (e) e.preventDefault();
    this.createModalShown = false;
  };

  showUpdateDetails = (update, e) => {
    if (e) e.preventDefault();
    this.updateDetailsShown = true;
    this.selectedUpdate = update;
    const { t } = this.props;
    this.title = t('updates.details.title');
    sendAction(OTA_UPDATES_SEE_DETAILS);
  };

  hideUpdateDetails = (e) => {
    if (e) e.preventDefault();
    this.updateDetailsShown = false;
    const { t } = this.props;
    this.title = t('updates.title');
  };

  onPageChange = (page, pageSize) => {
    this.setState({ pageNumber: page });
    const { stores } = this.props;
    const { updatesStore } = stores;
    updatesStore.fetchUpdates(UPDATES_FETCH_ASYNC, (page - 1) * pageSize);
  };

  showTotalTemplate = (total, range) => (total > 0 ? `${range[0]}-${range[1]} of ${total}` : '');

  filterChangeCallback = (filter, event) => {
    if (event) {
      event.preventDefault();
    }
    this.setState({ pageNumber: PAGE_NUMBER_DEFAULT });
    const { stores } = this.props;
    const { updatesStore } = stores;
    updatesStore.filterUpdates(filter);
    sendAction(OTA_UPDATES_SEARCH_UPDATE);
  };

  render() {
    const { pageNumber } = this.state;
    const { stores, t } = this.props;
    const { updatesStore } = stores;
    const { isFetching } = updatesStore.updatesFetchAsync;
    return (
      <span ref={this.componentRef}>
        <MetaData title={this.title}>
          {isFetching ? (
            <div className="wrapper-center">
              <Loader />
            </div>
          ) : (updatesStore.updatesTotalCount || updatesStore.updateFilter.length) ? (
            <span>
              <UpdateHeader filterChangeCallback={this.filterChangeCallback} showCreateModal={this.showCreateModal} />
              <UpdateList showUpdateDetails={this.showUpdateDetails} />
              <div className="ant-pagination__wrapper clearfix">
                <Pagination
                  current={pageNumber}
                  defaultPageSize={UPDATES_LIMIT_PER_PAGE}
                  onChange={this.onPageChange}
                  total={updatesStore.updatesTotalCount}
                  showTotal={this.showTotalTemplate}
                />
              </div>
            </span>
          ) : (
            <span>
              <UpdateHeader filterChangeCallback={this.filterChangeCallback} showCreateModal={this.showCreateModal} />
              <div className="wrapper-center">
                <div className="page-intro">
                  <img src={UPDATE_ICON} alt="Icon" />
                  <div>{t('updates.empty.no-updates-1')}</div>
                  <ReadMore>
                    {t('updates.empty.no-updates-2')}
                    <UnderlinedLink url={URL_UPDATES_INTRO}>{t('miscellaneous.read-more')}</UnderlinedLink>
                  </ReadMore>
                  <div>
                    <SecondaryButton id="add-new-update" type="link" onClick={this.showCreateModal}>
                      <img src={PLUS_ICON} />
                      {t('updates.empty.add-new')}
                    </SecondaryButton>
                  </div>
                </div>
              </div>
            </span>
          )}
          {this.createModalShown ? (
            <UpdateCreateModal
              shown={this.createModalShown}
              hide={this.hideCreateModal}
            />
          ) : null}
          {this.updateDetailsShown ? (
            <UpdateCreateModal
              shown={this.updateDetailsShown}
              hide={this.hideUpdateDetails}
              showDetails={this.selectedUpdate}
            />
          ) : null}
        </MetaData>
      </span>
    );
  }
}

Updates.propTypes = {
  history: PropTypes.shape({}),
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(withRouter(Updates));
