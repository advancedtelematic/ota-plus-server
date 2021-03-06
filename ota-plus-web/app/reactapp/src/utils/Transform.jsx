/** @format */

const toUpperCaseFirst = value => value[0].toUpperCase() + value.slice(1);

const shortenCampaignId = (id) => {
  const parts = id.split('-');
  return `${parts[parts.length - 1]}-${parts[0]}`;
};

export { toUpperCaseFirst, shortenCampaignId };
