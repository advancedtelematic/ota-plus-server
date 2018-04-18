import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { VelocityTransitionGroup } from 'velocity-react';
import StatsBlock from '../packages/stats/StatsBlock';

export default class ItemVersions extends Component {
    render () {
        const {groupItem} = this.props;
        return (
            <div className='row versions-details' onClick={(e) => {e.stopPropagation()}}>
                {groupItem.warnings && groupItem.warnings.length > 0 || groupItem.errors && groupItem.errors.length > 0 ?
                    <div className="col-xs-12">
                        <div className="warnings">
                            {_.map(groupItem.warnings, (warning, key) => {
                                return <p><i key={key} className="fa warning" aria-hidden="true"/>{warning}</p>
                            })}
                            {_.map(groupItem.errors, (error, key) => {
                                return <p><i key={key} className="fa fa-error" aria-hidden="true"/>{error}</p>
                            })}
                        </div>
                    </div>
                    : ""}
                <div className="director-details col-xs-12">
                    <div className="row">
                        <div className="col-xs-4">
                            <p>Distribution by devices</p>
                            {groupItem.versions ? <StatsBlock type="devices" size={{width: '120', height: '120'}} pack={groupItem}/> : ''}
                        </div>
                        <div className="col-xs-4">
                            <p>Distribution by group</p>
                            {groupItem.stats && groupItem.stats.groups ? <StatsBlock type="groups" size={{width: '120', height: '120'}} pack={groupItem}/> : ''}
                        </div>
                        <div className="col-xs-4">
                            <p>Failure rate</p>
                            {groupItem.stats && groupItem.stats.installationResults ? <StatsBlock type="results" size={{width: '120', height: '120'}} pack={groupItem}/> : ''}
                        </div>
                    </div>
                </div>
                <div className="col-xs-12">
                    <ul className="versions">

                        {groupItem.versions && Object.keys(groupItem.versions).map((version, versionKey) => {
                            const versionItem = groupItem.versions[version];
                            return (

                                <li key={versionKey}>
                                    <div className="row">
                                        <div className="col-xs-6">
                                            <div className="left-box">
                                                <div className="version-info">
                                                    <span className="bold">Version: {version}</span>
                                                    <span className="bold">Created at: {versionItem.created}</span>
                                                    <span className="bold">Updated at: {versionItem.updated}</span>
                                                    <span className="bold">Hash: {versionItem.hash}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-6">
                                            <div className="right-box">
                                                <span className="bold">Length: {versionItem.length}</span>
                                                <span className="bold">Installed on {versionItem.installedOnEcus} ECU(s)</span>
                                                <span className="bold">Hardware ids: {_.map(versionItem.id, (id, key) => {
                                                    return <span key={key} className="app-label">{id}</span>
                                                })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>

                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}