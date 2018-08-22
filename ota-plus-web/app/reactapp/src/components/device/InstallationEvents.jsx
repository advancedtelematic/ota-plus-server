import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { VelocityTransitionGroup } from 'velocity-react';

@observer
class InstallationEvents extends Component {
    @observable showMore = false;
    
    toggleMore = (e) => {
        e.preventDefault();
        this.showMore = !this.showMore;
    }
    render() {
        const { updateId, error } = this.props;
        return (
            <div className="queue-modal__operation-info-block queue-modal__operation-info-block--more">
                <VelocityTransitionGroup 
                    enter={{
                        animation: "slideDown",
                    }}
                    leave={{
                        animation: "slideUp",
                        duration: 400
                    }}
                >
                    {this.showMore ?
                        <div className="queue-modal__operation-info-extended">
                            <div className="queue-modal__operation-info-ext-block">
                                <div>
                                    <span>
                                        <img src="/assets/img/icons/green_tick.svg" alt="Icon" />
                                        Download start:
                                    </span>
                                    <span id="download-start-time">
                                        00:30:45 12/12/17
                                    </span> 
                                </div>
                                <div>
                                    <span>
                                        <img src="/assets/img/icons/green_tick.svg" alt="Icon" />
                                        Download completed:
                                    </span>
                                    <span id="download-completed-time">
                                        00:40:30 12/12/17
                                    </span> 
                                </div>
                            </div>
                            <div className="queue-modal__operation-info-ext-block">
                                <div>
                                    <span>
                                        <img src="/assets/img/icons/green_tick.svg" alt="Icon" />
                                        Installation start:
                                    </span>
                                    <span id="installation-start-time">
                                        00:30:45 12/12/17
                                    </span> 
                                </div>
                                <div>
                                    <span>
                                        <img src="/assets/img/icons/green_tick.svg" alt="Icon" />
                                        Installation completed:
                                    </span>
                                    <span id="installation-completed-time">
                                        00:30:45 12/12/17
                                    </span> 
                                </div>
                            </div>
                            <div className="queue-modal__operation-info-ext-block">
                                <div>
                                    <span>
                                        <img src="/assets/img/icons/green_tick.svg" alt="Icon" />
                                        Installation report available:
                                    </span>
                                    <span id="installation-report-time">
                                        00:30:45 12/12/17
                                    </span> 
                                </div>
                            </div>
                            {error ?
                                <div className="queue-modal__operation-info-failure">
                                    Failure reason: {error.resultText}
                                </div>
                            :
                                null
                            }
                        </div>
                    :
                        null
                    }
                </VelocityTransitionGroup>
                <a href="#" className="add-button" id={"toggle-more-button-" + updateId} onClick={this.toggleMore}>
                    <span>
                        {this.showMore ?
                            <i className="fa fa-angle-up" />
                        :
                            <i className="fa fa-angle-down" />
                        }
                    </span>
                    <span>
                        {this.showMore ?
                            "Show less"
                        :
                            "Show more"
                        }
                        
                    </span>
                </a>
            </div>
        );
    }
}

export default InstallationEvents;