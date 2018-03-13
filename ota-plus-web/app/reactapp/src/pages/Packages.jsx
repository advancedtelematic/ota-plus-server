import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Header, Loader } from '../partials';
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
                    <Header 
                        title={title}
                        subtitle={(
                            <span>
                                {packagesStore.packagesFetchAsync.isFetching ?
                                    <span>
                                        <i className="fa fa-square-o fa-spin"></i> packages counting
                                    </span>
                                :
                                    <FadeAnimation>
                                        <span id="packages-count">
                                            {t('common.packageWithCount', {count: packagesStore.packagesCount})}
                                        </span>
                                    </FadeAnimation>
                                }
                            </span>
                        )}
                    />
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