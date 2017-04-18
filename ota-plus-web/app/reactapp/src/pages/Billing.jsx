import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { BillingContainer } from '../containers';

const title = "Billing";

@observer
class Billing extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { userStore } = this.props;
        return (
            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <Header 
                        title={title}
                    />
                    <MetaData 
                        title={title}>
                        <BillingContainer 
                            userStore={userStore}
                        />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

Billing.propTypes = {
    userStore: PropTypes.object
}

export default Billing;