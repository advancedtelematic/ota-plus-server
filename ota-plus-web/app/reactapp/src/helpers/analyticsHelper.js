/* eslint-disable no-undef */

// eslint-disable-next-line import/prefer-default-export
export const sendAction = (actionType) => {
  if (window.utag && utag && Object.keys(utag).length) {
    utag.link({
      link_id: this,
      link_text: actionType,
      linkEvent: actionType,
      actionTrack: actionType
    });
  }
};
