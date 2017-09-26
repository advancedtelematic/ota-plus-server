import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import _ from 'underscore';
import { Loader } from '../../../partials';

@observer
class TufListItem extends Component {
    constructor(props) {
        super(props);
    }
    rename(e) {
        e.stopPropagation();
        this.props.showRenameModal(this.props.campaign.id);
    }
    render() {
        const { groupsStore, campaign, goToCampaignDetails, rename, type, onHomePage } = this.props;

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
            <div className={"item" + (onHomePage ? " off" : "")} onClick={goToCampaignDetails.bind(this, campaign.id)}>
                <div className="actions">
                    <ul>
                        <li id={"rename-campaign-" + campaign.name} onClick={this.rename.bind(this)}>
                            <img src="/assets/img/icons/edit_white.png" alt="" />
                            <span>Rename</span>
                        </li>
                    </ul>
                </div>
                <div className="column" id={"campaign-" + campaign.name}>
                    {campaign.name}
                </div>
                <div className="column" id={"campaign-start-date-" + campaign.name}>
                    {moment(campaign.createdAt).format("DD.MM.YYYY")}
                </div>
                <div className="column" id={"campaign-processed-" + campaign.name}>
                    {type === 'running' || type === 'finished' || type === 'cancelled' ?
                        <span>
                            <span>{totalProcessed}</span>                            
                        </span>
                    :
                        null
                    }
                </div>
                <div className="column" id={"campaign-affected-" + campaign.name}>
                    {type === 'running' || type === 'finished' || type === 'cancelled' ?
                        <span>
                            <span>{totalAffected}</span>                            
                        </span>
                    :
                        null
                    }
                </div>
                <div className="column" id={"campaign-finished-" + campaign.name}>
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
                <div className="column" id={"campaign-failure-rate-" + campaign.name}>
                    {type === 'running' || type === 'finished' || type === 'cancelled' ?
                        <span>
                            <span>{failureRate} %</span>
                        </span>
                    :
                        null
                    }
                </div>
                <div className="column additional-info" id={"campaign-additional-info-" + campaign.name}>
                    {type === 'inPreparation' ?
                        <div className="wrapper-center">
                            <Loader 
                                size={30}
                                thickness={5}
                            />
                        </div>
                    : type === 'running' || type === 'finished' || type === 'cancelled' ?
                        <div className="more-info" id="campaign-more-info">
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
    groupsStore: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired,
    goToCampaignDetails: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired
}

export default TufListItem;