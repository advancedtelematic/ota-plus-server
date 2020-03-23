import React from 'react';
import PropTypes from 'prop-types';
import { FlexCenter, HeaderWrapper } from './styled';

const PageHeader = ({ mainContent, sideContent }) => (
  <HeaderWrapper>
    <FlexCenter>{mainContent}</FlexCenter>
    <div>{sideContent}</div>
  </HeaderWrapper>
);

PageHeader.propTypes = {
  mainContent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  sideContent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
};

export default PageHeader;
