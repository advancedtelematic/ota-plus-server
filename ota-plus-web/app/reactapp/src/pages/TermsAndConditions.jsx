import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import * as contracts from '../../../assets/contracts/';
import _ from 'underscore';

const title = "Policy";

@observer
class TermsAndConditions extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { userStore } = this.props;
        let terms = _.find(userStore.contracts, (obj) => contracts.default[obj.contract]);
        const htmlDoc = terms && terms.contract  ? {__html: contracts.default[terms.contract]} : null;
        return (
            <FadeAnimation>
                <MetaData title={title}>
                    <div className="header">
                        General terms and conditions
                    </div>
                    <div className="wrapper">
                        <div className="content-header">
                            <span>Privacy Policy</span>
                            <span>Effective date: <span className="date">Friday, 4 December, 2015</span></span>
                        </div>
                        <div className="content" dangerouslySetInnerHTML={htmlDoc}>
                        </div>
                    </div>
                </MetaData>
            </FadeAnimation>
        );
    }
}

export default TermsAndConditions;