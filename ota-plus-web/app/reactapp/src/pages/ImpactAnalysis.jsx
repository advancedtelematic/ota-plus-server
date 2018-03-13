import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { ImpactAnalysisContainer } from '../containers';
import { translate } from 'react-i18next';

const title = "Impact analysis";

@observer
class ImpactAnalysis extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.props.packagesStore.fetchBlacklist(true, true);
        this.props.impactAnalysisStore.fetchImpactAnalysis();
    }
    render() {
        const { t, packagesStore, impactAnalysisStore } = this.props;
        return (
            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <Header 
                        title={title}
                        subtitle={(
                            <span>
                                {packagesStore.packagesBlacklistFetchAsync.isFetching || impactAnalysisStore.impactAnalysisFetchAsync.isFetching ?
                                    <span>
                                        <i className="fa fa-square-o fa-spin"></i> impact analysis
                                    </span>
                                :
                                    null
                                }
                                <FadeAnimation>
                                    {!packagesStore.packagesBlacklistFetchAsync.isFetching && !impactAnalysisStore.impactAnalysisFetchAsync.isFetching ?
                                        <span id="impact-analysis-affected-count">
                                            Impact: {t('common.deviceWithCount', {count: Object.keys(impactAnalysisStore.impactAnalysis).length})}
                                        </span>
                                    :
                                        null
                                    }
                                </FadeAnimation>
                            </span>
                        )}
                    />
                    <MetaData 
                        title={title}>
                        <ImpactAnalysisContainer 
                            packagesStore={packagesStore}
                            impactAnalysisStore={impactAnalysisStore}
                        />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

ImpactAnalysis.propTypes = {
    packagesStore: PropTypes.object,
    impactAnalysisStore: PropTypes.object
}

export default translate()(ImpactAnalysis);