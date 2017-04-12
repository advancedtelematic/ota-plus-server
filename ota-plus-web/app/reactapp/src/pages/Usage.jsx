import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { UsageContainer } from '../containers';

const title = "Usage";

@observer
class Usage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <Header 
                        title={title}
                    />
                    <MetaData 
                        title={title}>
                        <UsageContainer
                            userStore={userStore}
                        />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

Usage.propTypes = {
    userStore: PropTypes.object.isRequired
}

export default Usage;