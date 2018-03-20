import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Loader } from '../partials';
import { PackagesContainer } from '../containers';
import { translate } from 'react-i18next';

const title = "Packages";

@observer
class Packages extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.props.packagesStore.page = 'packages';
        this.props.packagesStore.fetchPackages();
    }
    componentWillUnmount() {
        this.props.packagesStore._reset();
    }
    render() {
        const { t, packagesStore, hardwareStore, featuresStore, devicesStore, campaignsStore, otaPlusStore } = this.props;
        return (
            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <MetaData 
                        title={title}>
                        <PackagesContainer 
                            packagesStore={packagesStore}
                            hardwareStore={hardwareStore}
                            featuresStore={featuresStore}
                            devicesStore={devicesStore}
                            campaignsStore={campaignsStore}
                            highlightedPackage={this.props.params.packageName}
                            alphaPlusEnabled={otaPlusStore.alphaPlusEnabled}
                        />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

Packages.propTypes = {
    packagesStore: PropTypes.object,
    hardwareStore: PropTypes.object,
    featuresStore: PropTypes.object,
    devicesStore: PropTypes.object,
}

export default translate()(Packages);