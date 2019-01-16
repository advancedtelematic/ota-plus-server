/** @format */

import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { WhatsNewContainer } from '../containers';

const title = "WHAT's NEW";

@inject('stores')
@observer
class WhatsNew extends Component {
  render() {
    return (
      <FadeAnimation>
        <MetaData title={title}>
          <WhatsNewContainer />
        </MetaData>
      </FadeAnimation>
    );
  }
}

WhatsNew.propTypes = {
  stores: PropTypes.object,
};

export default WhatsNew;
