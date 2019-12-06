import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div(({ elevation = 1, rounded = true }) => ({
  padding: '20px',
  backgroundColor: '#3F454D',
  borderRadius: rounded ? '5px' : 0,
  boxShadow: `0 2px 4px 0 rgba(15,22,33,${0.05 * elevation})`
}));

Container.propTypes = {
  elevation: PropTypes.number,
  rounded: PropTypes.bool
};

export default Container;
