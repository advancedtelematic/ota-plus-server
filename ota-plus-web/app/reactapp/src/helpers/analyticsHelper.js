/* eslint-disable no-undef */

// eslint-disable-next-line import/prefer-default-export
export const sendAction = (actionType) => {
  if (utag) {
    utag.link({
      link_id: this,
      link_text: actionType,
      linkEvent: actionType,
      actionTrack: actionType
    });
  }
};
