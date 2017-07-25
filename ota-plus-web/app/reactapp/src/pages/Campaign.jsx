import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { Header } from '../partials';
import { CampaignContainer } from '../containers';
import { translate } from 'react-i18next';

const title = "Campaign";

@observer
class Campaign extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.props.campaignsStore.fetchCampaign(this.props.params.id);
        this.props.groupsStore.fetchGroups();
    }
    componentWillUnmount() {
        this.props.campaignsStore._reset();
        this.props.groupsStore._reset();
    }
    render() {
        const { campaignsStore, groupsStore, backButtonAction } = this.props;
        return (

            <FadeAnimation 
                display="flex">
                <div className="wrapper-flex">
                    <Header 
                        backButtonShown={true}
                        backButtonAction={backButtonAction}
                    />
                    {campaignsStore.campaignsOneFetchAsync.isFetching || campaignsStore.campaignsOneStatisticsFetchAsync.isFetching ?
                        null
                    :
                        <MetaData
                            title={title}>
                            <CampaignContainer
                                campaignsStore={campaignsStore}
                                groupsStore={groupsStore}
                            />
                        </MetaData>
                    }

                </div>
            </FadeAnimation>
        );
    }
}

Campaign.propTypes = {
    campaignsStore: PropTypes.object
}

export default translate()(Campaign);