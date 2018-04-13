import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
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
            <FadeAnimation>
                <MetaData 
                    title={title}>
                    <ImpactAnalysisContainer 
                        packagesStore={packagesStore}
                        impactAnalysisStore={impactAnalysisStore}
                    />
                </MetaData>
            </FadeAnimation>
        );
    }
}

ImpactAnalysis.propTypes = {
    packagesStore: PropTypes.object,
    impactAnalysisStore: PropTypes.object
}

export default translate()(ImpactAnalysis);