import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Loader } from '../partials';
import { PackagesContainer } from '../containers';
import { translate } from 'react-i18next';

const title = "Packages";

@inject("stores")
@observer
class Packages extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        const { packagesStore } = this.props.stores;
        packagesStore.page = 'packages';
        packagesStore.fetchPackages();
    }
    componentWillUnmount() {
        const { packagesStore } = this.props.stores;
        packagesStore._reset();
    }
    render() {
        const { t, switchToSWRepo } = this.props;
        return (
            <FadeAnimation>
                <MetaData 
                    title={title}>
                    <PackagesContainer 
                        switchToSWRepo={switchToSWRepo}
                        highlightedPackage={this.props.params.packageName}
                    />
                </MetaData>
            </FadeAnimation>
        );
    }
}

Packages.propTypes = {
    stores: PropTypes.object,
}

export default translate()(Packages);