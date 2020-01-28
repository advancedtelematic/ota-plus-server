/* eslint-disable no-undef */

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

export const setAnalyticsView = (viewType) => {
  if (utagEnabled()) {
    utag.view({ pName: viewType });
  }
};
