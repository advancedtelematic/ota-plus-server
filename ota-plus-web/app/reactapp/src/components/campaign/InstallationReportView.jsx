import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import GroupsListItem from './GroupsListItem';
import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalRectSeries,
} from 'react-vis';

@inject("stores")
@observer
class InstallationReportView extends Component {
    render() {
        const { campaignsStore } = this.props.stores;
        const { campaign } = campaignsStore;
        const groups = [
            {
                name: "Test group 1",
                devices: 2,
                color: "#d0021b"
            },
            {
                name: "Test group 2",
                devices: 3,
                color: "#d0021b"
            },
            {
                name: "Test group 3",
                devices: 3,
                color: "#d0021b"
            },
            {
                name: "Test group 4",
                devices: 3,
                color: "#d0021b"
            },
            {
                name: "Test group 5",
                devices: 16,
                color: "#d0021b"
            },
        ];
        const { devices } = _.max(groups, _.property('devices'));
        let xtickValues = [];
        for(let i = 0; i <= devices; i++) {
            if(i % 2 === 0) {
                xtickValues.push(i);
            }
        }
        let ytickValues = [];
        for(let i = 0; i < groups.length; i++) {
            ytickValues.push(i);
        }
        return (
            <div className="groups" style={{padding: "20px 25px", background: "#fff"}}>
                <div className="groups__chart">
                    <FlexibleWidthXYPlot
                      height={75 * groups.length}
                      margin={{left: 75, right: 150}}
                      yType="ordinal">
                      <VerticalGridLines />
                      <XAxis tickTotal={devices} tickValues={xtickValues} tickFormat={v => v < 10 && v !== 0 ? ("0" + v) : v} />
                      <YAxis orientation="left" tickTotal={groups.length} tickValues={ytickValues} tickFormat={v => groups[v].name} />
                      {_.map(groups, (group, index) => {
                        return (
                           <HorizontalRectSeries
                                key={group.name}
                                animation
                                data={[
                                  {y0: index, y: index, x0: 0, x: group.devices},
                                ]}
                                color={group.color}
                                className="rect-series"
                                style={{transform: "translate(0px, -10px)"}}
                            /> 
                        );
                      })}
                    </FlexibleWidthXYPlot>
                </div>
                <div className="groups__actions">
                    {_.map(groups, (group, index) => {
                        return (
                            <div key={group.name} className="groups__action-wrapper" style={{height: 'calc(75px - ' + 50 / groups.length + 'px)'}}>
                                <div className={"groups__action-bg " + (index % 2 !== 0 ? 'groups__action-bg--odd' : '')}></div>
                                <div className="groups__action">
                                    Action1
                                </div>
                                <div className="groups__action">
                                    Action2
                                </div>
                            </div>
                        );                        
                    })}
                </div>
                <div className="groups__legend">
                    <span className="groups__legend-color"></span>
                    Devices
                </div>
            </div>
        );
    }
}

InstallationReportView.propTypes = {
    stores: PropTypes.object,
}

export default InstallationReportView;