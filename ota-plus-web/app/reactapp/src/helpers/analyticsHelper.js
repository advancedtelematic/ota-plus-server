/* eslint-disable no-undef */

import { ANALYTICS_LINK_EVENT_URL_TRUNCATED } from '../constants/analyticsLinkEvents';
import { ANALYTICS_VIEW_DEVICE_DETAIL_VIEW } from '../constants/analyticsViews';

const utagEnabled = () => window.utag && utag && Object.keys(utag).length > 1;

export const sendAction = (actionType) => {
  if (utagEnabled()) {
    utag.link({
      link_id: this,
      link_text: actionType,
      linkEvent: actionType,
      actionTrack: actionType
    });
  }
};

export const getTruncatedURL = (viewType) => {
  switch (viewType) {
    default:
      return window.location.href;
    case ANALYTICS_VIEW_DEVICE_DETAIL_VIEW: {
      const { href } = window.location;
      return href.slice(0, href.lastIndexOf('/'));
    }
  }
};

export const setAnalyticsView = (viewType) => {
  if (utagEnabled()) {
    switch (viewType) {
      default:
        utag.view({ pName: viewType });
        break;
      case ANALYTICS_VIEW_DEVICE_DETAIL_VIEW:
        utag.view({
          pName: viewType,
          linkEvent: ANALYTICS_LINK_EVENT_URL_TRUNCATED,
          sURLTrunc: getTruncatedURL(viewType)
        });
        break;
    }
  }
};
