/** @format */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Terms } from '../containers';
import * as contracts from '../../../assets/contracts/';
import _ from 'underscore';

const title = 'Policy';

@inject('stores')
@observer
class TermsAndConditions extends Component {
  render() {
    const { userStore } = this.props.stores;
    let terms = _.find(userStore.contracts, obj => contracts.default[obj.contract]);
    const htmlDoc = terms && terms.contract ? { __html: contracts.default[terms.contract] } : null;
    const oldTerms = (
      <div>
        <div className='header'>General terms and conditions</div>
        <div className='wrapper'>
          <div className='content-header'>
            <span>Privacy Policy</span>
            <span>
              Effective date: <span className='date'>Friday, 4 December, 2015</span>
            </span>
          </div>
          <div className='content' dangerouslySetInnerHTML={htmlDoc} />
        </div>
      </div>
    );
    return (
      <FadeAnimation>
        <MetaData title={title}>
          <Terms goBack={true} checked={true} />
        </MetaData>
      </FadeAnimation>
    );
  }
}

export default TermsAndConditions;
