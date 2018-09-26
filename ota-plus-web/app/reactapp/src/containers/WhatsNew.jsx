import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import {
    WhatsNewHeader,
    WhatsNewList
} from '../components/whatsnew';


@inject("stores")
@observer
class WhatsNew extends Component {

    componentWillMount() {
        const { featuresStore } = this.props.stores;
        this.features = featuresStore.whatsNew;
    }

    render() {
        return (
            <span>
                <WhatsNewHeader/>
                <WhatsNewList data={ this.features}/>
            </span>
        );
    }
}

WhatsNew.propTypes = {
    stores: PropTypes.object,
}

export default WhatsNew;