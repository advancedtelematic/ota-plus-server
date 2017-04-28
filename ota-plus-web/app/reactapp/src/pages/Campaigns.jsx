import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { CampaignsContainer } from '../containers';
import { translate } from 'react-i18next';

const title = "Campaigns";

@observer
class Campaigns extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.props.campaignsStore.fetchCampaigns();
    }
    componentWillUnmount() {
        this.props.campaignsStore._reset();
    }
    render() {
        const { t, campaignsStore, packagesStore, groupsStore } = this.props;
        return (
            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <Header 
                        title={title}
                        subtitle={(
                            <span>
                                {campaignsStore.overallCampaignsCount === null && campaignsStore.campaignsFetchAsync.isFetching ?
                                    <span>
                                        <i className="fa fa-square-o fa-spin"></i> campaigns counting
                                    </span>
                                :
                                    null
                                }
                                <FadeAnimation>
                                    {!campaignsStore.campaignsFetchAsync.isFetching ?
                                        <span id="campaigns-count﻿">
                                            {t('common.campaignWithCount', {count: campaignsStore.overallCampaignsCount})}
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
                        <CampaignsContainer 
                            campaignsStore={campaignsStore}
                            packagesStore={packagesStore}
                            groupsStore={groupsStore}
                        />
                    </MetaData>
                </div>
            </FadeAnimation>
        );
    }
}

Campaigns.propTypes = {
    campaignsStore: PropTypes.object,
    packagesStore: PropTypes.object,
    groupsStore: PropTypes.object
}

export default translate()(Campaigns);