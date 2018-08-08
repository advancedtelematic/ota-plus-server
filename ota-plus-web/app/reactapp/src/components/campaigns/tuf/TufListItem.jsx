import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import _ from 'underscore';
import { Loader } from '../../../partials';

@observer
class TufListItem extends Component {
    render() {
        const { campaign, toggleCampaign, type, expandedCampaignName } = this.props;

        let totalAffected = 0;
        let totalProcessed = 0;
        let totalFinished = 0;
        let totalFailed = 0;
        let failureRate = 0;

        if(type === 'running' || type === 'finished') {
            let stats = campaign.summary.stats;   
            totalFailed = campaign.summary.failed.length;       
            totalFinished = campaign.summary.finished;
            _.each(stats, (stat, groupId) => {
                totalAffected += stat.affected;
                totalProcessed += stat.processed;
            });
            failureRate = Math.round(totalFailed/Math.max(totalFinished, 1) * 100);
        }
        return (
            expandedCampaignName === campaign.name?
                <div className="campaigns__item" id={"item-" + campaign.name} onClick={toggleCampaign.bind(this, campaign.name)}>
                    <div className="wrapper-center">
                        <img src="assets/img/icons/black/arrow-up.svg" alt="Icon" />
                    </div>
                </div>
            :
                <div className="campaigns__item" id={"item-" + campaign.name} onClick={toggleCampaign.bind(this, campaign.name)}>
                    <div className="campaigns__column" id={"campaign-" + campaign.name}>
                        {campaign.name}
                    </div>
                    <div className="campaigns__column" id={"campaign-start-date-" + campaign.name}>
                        {moment(campaign.createdAt).format("DD.MM.YYYY")}
                    </div>
                    <div className="campaigns__column" id={"campaign-processed-" + campaign.name}>
                        {type === 'running' || type === 'finished' || type === 'cancelled' ?
                            <span>
                                <span>{totalProcessed}</span>                            
                            </span>
                        :
                            null
                        }
                    </div>
                    <div className="campaigns__column" id={"campaign-affected-" + campaign.name}>
                        {type === 'running' || type === 'finished' || type === 'cancelled' ?
                            <span>
                                <span>{totalAffected}</span>                            
                            </span>
                        :
                            null
                        }
                    </div>
                    <div className="campaigns__column" id={"campaign-finished-" + campaign.name}>
                        {type === 'running' || type === 'finished' || type === 'cancelled' ?
                            <span>
                                <span>{totalFinished}</span>
                                /
                                <span>{totalAffected}</span>
                            </span>
                        :
                            null
                        }
                    </div>
                    <div className="campaigns__column" id={"campaign-failure-rate-" + campaign.name}>
                        {type === 'running' || type === 'finished' || type === 'cancelled' ?
                            <span>
                                <span>{failureRate} %</span>
                            </span>
                        :
                            null
                        }
                    </div>
                    <div className="campaigns__column campaigns__column--additional-info" id={"campaign-additional-info-" + campaign.name}>
                        {type === 'inPreparation' ?
                            <div className="wrapper-center">
                                <Loader 
                                    size={30}
                                    thickness={5}
                                />
                            </div>
                        : type === 'running' || type === 'finished' || type === 'cancelled' ?
                            <div id="campaign-more-info">
                                More info
                            </div>
                        :
                            null
                        }
                    </div>
                </div>
        );
    }
}

TufListItem.propTypes = {
    campaign: PropTypes.object.isRequired,
    toggleCampaign: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired
}

export default TufListItem;