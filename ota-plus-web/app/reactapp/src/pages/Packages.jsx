import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Loader } from '../partials';
import { PackagesContainer } from '../containers';

const title = "Packages";

@inject("stores")
@observer
class Packages extends Component {
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
        const { switchToSWRepo } = this.props;
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

export default Packages;