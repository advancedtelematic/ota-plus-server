import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Form } from 'formsy-react';
import { SubHeader, SearchBar } from '../../partials';

@observer
class Subheader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
		return (
            <div className="dashboard-subheader">
                <div className="system">
                    <div className="title">
                        System status
                    </div>                      
                    <div className="status">
                        0 errors, 0 warnings
                    </div>
                    <div className="triangle">
                    </div>
                </div>
                <div className="sub-systems">
                    <div className="item">
                        <div className="title">
                            Device registry
                        </div>
                        <div className="icon">
                            <img src="/assets/img/icons/green_tick.png" alt="Icon" />
                        </div>
                        <div className="status">
                            all services online and running
                        </div>
                    </div>
                    <div className="item">
                        <div className="title">
                            Software repository
                        </div>
                        <div className="icon">
                            <img src="/assets/img/icons/red_cross.png" alt="Icon" />
                        </div>
                        <div className="status">
                            0 errors, 0 warnings
                        </div>
                    </div>
                    <div className="item">
                        <div className="title">
                            Campaigns
                        </div>
                        <div className="icon">
                            <img src="/assets/img/icons/green_tick.png" alt="Icon" />
                        </div>
                        <div className="status">
                            all services online and running
                        </div>
                    </div>
                    <div className="item">
                        <div className="title">
                            Connectors
                        </div>
                        <div className="icon">
                            <img src="/assets/img/icons/green_tick.png" alt="Icon" />
                        </div>
                        <div className="status">
                            all services online and running
                        </div>
                    </div>
                    <div className="item">
                        <div className="title">
                            Device gateway
                        </div>
                        <div className="icon">
                            <img src="/assets/img/icons/red_cross.png" alt="Icon" />
                        </div>
                        <div className="status">
                            0 errors, 0 warnings
                        </div>
                    </div>
                    <div className="item">
                        <div className="title">
                            Auditor
                        </div>
                        <div className="icon">
                            <img src="/assets/img/icons/green_tick.png" alt="Icon" />
                        </div>
                        <div className="status">
                            all services online and running
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Subheader;