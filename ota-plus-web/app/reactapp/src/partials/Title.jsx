import styled from 'styled-components';

const styleVariants = () => ({
  small: {
    height: '22px',
    fontSize: '1.29em',
    lineHeight: '22px'
  },
  medium: {
    fontSize: '1.58em',
    lineHeight: '40px',
    marginBottom: '20px'
  },
  large: {
    fontSize: '2.29em',
    lineHeight: '40px',
    marginBottom: '22px'
  }
});

export default styled.h1(({ size = 'medium', theme }) => ({
  fontWeight: 700,
  color: theme.palette.texts.black,
  ...styleVariants()[size]
}));
