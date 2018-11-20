import React, { Component } from 'react';
import moment from 'moment';

class MtuListItem extends Component {
	render() {
		const { campaign, cancelApprovalPendingCampaign } = this.props;
		const metadata = campaign.metadata.length ? campaign.metadata :  null;

        return (
			<li className="overview-panel__item">
                <div className="overview-panel__item-header">
                    <div className="overview-panel__item-header--title overview-panel__item-header--title__queue">
                        <div>
							<span id={"update-id-title-" + campaign.id} className="overview-panel__item-header--title__label">
								Campaign:
							</span>
                            <span id={"update-id-" + campaign.id}>
								{campaign.name}
							</span>
                        </div>
                        <div>
                            <button id="cancel-mtu" className="overview-panel__cancel-update" onClick={cancelApprovalPendingCampaign.bind(this, campaign.id)}>
                                Cancel
                            </button>
                        </div>
                    </div>
					<div className="overview-panel__item-header--update">
						<div className="overview-panel__item-header--update__name">
							<span id={"update-id-title-" + campaign.id} className="overview-panel__item-header__label">
								Update&nbsp;name:
							</span>
							<span id={"update-id-" + campaign.id}>
								{campaign.update.name}
							</span>
						</div>
						<div className="overview-panel__item-header--update__description">
							<span id={"update-id-title-" + campaign.id} className={'overview-panel__item-header__label'}>
								Update&nbsp;description:
							</span>
							<span id={"update-id-" + campaign.id}>
								{campaign.update.description}
							</span>
						</div>
					</div>
                    <div className="overview-panel__item-header--update">
						{metadata &&
						<div className="overview-panel__item-header--update__name">
							<span id={"update-id-title-" + campaign.id} className="overview-panel__item-header__label">
								Distribution Settings:
							</span>
							<span id={"update-id-" + campaign.id}>
								Require OTA client's approval before installation
							</span>
						</div>
						}
						{(metadata && metadata.find(el=>el.type === 'DESCRIPTION')) &&
						<div className="overview-panel__item-header--update__name">
							<span id={"update-id-title-" + campaign.id} className="overview-panel__item-header__label">
								Notification Text:
							</span>
							<span id={"update-id-" + campaign.id}>
								{metadata.find(el=>el.type === 'DESCRIPTION').value}
							</span>
						</div>
						}
					</div>
					<div className="overview-panel__item-header--update">
                        {(metadata && metadata.find(el => el.type === 'ESTIMATED_PREPARATION_DURATION')) &&
                        <div className="overview-panel__item-header--update__name">
							<span id={"update-id-title-" + campaign.id} className="overview-panel__item-header__label">
								Estimated time to prepare this update
							</span>
                            <span id={"update-id-" + campaign.id}>
								{moment.utc(parseInt(metadata.find(el => el.type === 'ESTIMATED_PREPARATION_DURATION').value) * 1000).format('HH:mm:ss')}
							</span>
                        </div>
                        }
                        {(metadata && metadata.find(el => el.type === 'ESTIMATED_INSTALLATION_DURATION')) &&
                        <div className="overview-panel__item-header--update__description">
							<span id={"update-id-title-" + campaign.id}
                                  className={'overview-panel__item-header__label'}>
								Estimated time to install this update :
							</span>
                            <span id={"update-id-" + campaign.id}>
								{moment.utc(parseInt(metadata.find(el => el.type === 'ESTIMATED_INSTALLATION_DURATION').value) * 1000).format('HH:mm:ss')}
							</span>
                        </div>
                        }
					</div>
				</div>
			</li>
		);
	}
}

export default MtuListItem;