import React, { PropTypes, Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import { shortenCampaignId } from '../../utils/Transform';
import _ from 'underscore';
import { Loader } from '../../partials';
import { VelocityTransitionGroup } from "velocity-react";
import Statistics from './Statistics';

@observer
export default class ListItem extends Component {
    static propTypes = {
        campaign: PropTypes.object.isRequired,
        type: PropTypes.string.isRequired,
        isExpanded: PropTypes.bool.isRequired,
        toggleCampaign: PropTypes.func.isRequired,
        showCancelCampaignModal: PropTypes.func,
        showDependenciesModal: PropTypes.func,
        expandedCampaignId: PropTypes.string,
        hideCancel: PropTypes.bool,
    };

    renderCompact = () => {
        const {
            campaign,
            type,
        } = this.props;
        const notInPreparation = (type !== 'prepared');

        let totalAffected = 0;
        let totalProcessed = 0;
        let totalFinished = 0;
        let totalFailed = 0;
        let failureRate = 0;

        if (type === 'launched' || type === 'finished') {
            let stats = campaign.summary.stats;
            totalFailed = campaign.summary.failed.length;
            totalFinished = campaign.summary.finished;
            _.each(stats, (stat, groupId) => {
                totalAffected += stat.affected;
                totalProcessed += stat.processed;
            });
            failureRate = Math.round(totalFailed / Math.max(totalFinished, 1) * 100);
        }

        return (
            <div className="campaigns__item"
                 id={ "item-" + campaign.id }
                 onClick={ (e) => this.toggle(campaign, e) }
            >
                <div className="campaigns__column" id={ "campaign-name-" + campaign.id }>
                    { campaign.name }
                </div>
                <div className="campaigns__column" id={ "campaign-start-date-" + campaign.id }>
                    { moment(campaign.createdAt).format("DD.MM.YYYY") }
                </div>
                {
                    notInPreparation &&
                    <div className="campaigns__column" id={ "campaign-processed-" + campaign.id }>
                        <span><span>{ totalProcessed }</span></span>
                    </div>
                }
                {
                    notInPreparation &&
                    <div className="campaigns__column" id={ "campaign-affected-" + campaign.id }>
                        <span><span>{ totalAffected }</span></span>
                    </div>
                }
                {
                    notInPreparation &&
                    <div className="campaigns__column" id={ "campaign-finished-" + campaign.id }>
                        <span><span>{ totalFinished }</span>/<span>{ totalAffected }</span></span>
                    </div>
                }
                {
                    notInPreparation &&
                    <div className="campaigns__column" id={ "campaign-failure-rate-" + campaign.id }>
                        <span><span>{ failureRate } %</span></span>
                    </div>
                }
                <div className="campaigns__column campaigns__column--additional-info"
                     id={ "campaign-additional-info-" + campaign.id }
                >
                    {
                        notInPreparation ?
                            <div id="campaign-more-info">
                                More info
                            </div>
                            :
                            <div className="wrapper-center">
                                <Loader
                                    size={ 30 }
                                    thickness={ 5 }
                                />
                            </div>
                    }
                </div>
            </div>
        )
    };

    toggle = (campaign, mouseEvent) => {
        const { toggleCampaign } = this.props;
        mouseEvent && mouseEvent.preventDefault();
        toggleCampaign(campaign);
    };

    render() {
        const {
            campaign,
            isExpanded,
        } = this.props;

        return (
            <VelocityTransitionGroup
                enter={ {
                    animation: "slideDown",
                } }
                leave={ {
                    animation: "slideUp",
                } }
            >
                {
                    isExpanded ?
                        <div className="campaigns__item" id={ "item-" + campaign.id }
                             onClick={ (e) => this.toggle(campaign, e) }>
                            <div className="wrapper-center">
                                <img src="assets/img/icons/black/arrow-up.svg" alt="Icon"/>
                            </div>
                        </div>
                        :
                        this.renderCompact()
                }
            </VelocityTransitionGroup>
        );
    }
}
