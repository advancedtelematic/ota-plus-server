
// eslint-disable-next-line import/prefer-default-export
export const sendAction = (actionType) => {
  // eslint-disable-next-line no-undef
  utag.link({
    link_id: this,
    link_text: actionType,
    linkEvent: actionType,
    actionTrack: actionType
  });
};
