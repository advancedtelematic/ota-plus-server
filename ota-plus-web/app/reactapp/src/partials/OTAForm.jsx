/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'antd';

export const OTAForm = ({ id, formWidth = '100%', flexDirection = 'column', customStyles, children, onSubmit }) => (
  <Form
    className='c-form'
    method='POST'
    id={id || ''}
    style={{
      width: formWidth,
      flexDirection,
      ...customStyles,
    }}
    onSubmit={onSubmit}
  >
    {children}
  </Form>
);

OTAForm.propTypes = {
  id: PropTypes.string,
  formWidth: PropTypes.string,
  flexDirection: PropTypes.string,
  customStyles: PropTypes.object,
  // children: PropTypes.object,
  onSubmit: PropTypes.func,
};
