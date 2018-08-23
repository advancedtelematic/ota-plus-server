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
        const { updateId, error, queue } = this.props;
        const queueInfo = (
            <div className="queue-modal__operation-info-extended">
                <div className="queue-modal__operation-info-ext-block">
                    <div className="queue-modal__operation-50">
                        <span className="queue-modal__operation-wide">
                            <img src="/assets/img/icons/orange_exclamation.svg" alt="Icon" />
                            Download start:
                        </span>
                        <span id="download-start-time">
                            Pending
                        </span> 
                    </div>
                    <div className="queue-modal__operation-50">
                        <span className="queue-modal__operation-wide queue-modal__operation-wide---medium">
                            <img src="/assets/img/icons/orange_exclamation.svg" alt="Icon" />
                            Download completed:
                        </span>
                        <span id="download-completed-time">
                            Pending
                        </span> 
                    </div>
                </div>
                <div className="queue-modal__operation-info-ext-block">
                    <div className="queue-modal__operation-50">
                        <span className="queue-modal__operation-wide">
                            <img src="/assets/img/icons/orange_exclamation.svg" alt="Icon" />
                            Installation start:
                        </span>
                        <span id="installation-start-time">
                            Pending
                        </span> 
                    </div>
                    <div className="queue-modal__operation-50">
                        <span className="queue-modal__operation-wide queue-modal__operation-wide---medium">
                            <img src="/assets/img/icons/orange_exclamation.svg" alt="Icon" />
                            Installation completed:
                        </span>
                        <span id="installation-completed-time">
                            Pending
                        </span> 
                    </div>
                </div>
                <div className="queue-modal__operation-info-ext-block">
                    <div className="queue-modal__operation-100">
                        <span className="queue-modal__operation-wide queue-modal__operation-wide--long">
                            <img src="/assets/img/icons/orange_exclamation.svg" alt="Icon" />
                            Installation report available:
                        </span>
                        <span id="installation-report-time">
                            Pending
                        </span> 
                    </div>
                </div>
                <div className="queue-modal__operation-info-failure">
                    Failure reason: device not connected
                </div>
            </div>
        );
        const historyInfo = (
            <div className="queue-modal__operation-info-extended">
                <div className="queue-modal__operation-info-ext-block">
                    <div className="queue-modal__operation-50">
                        <span className="queue-modal__operation-wide">
                            <img src="/assets/img/icons/green_tick.svg" alt="Icon" />
                            Download start:
                        </span>
                        <span id="download-start-time">
                            00:30:45 12/12/17
                        </span> 
                    </div>
                    <div className="queue-modal__operation-50">
                        <span className="queue-modal__operation-wide queue-modal__operation-wide---medium">
                            <img src="/assets/img/icons/green_tick.svg" alt="Icon" />
                            Download completed:
                        </span>
                        <span id="download-completed-time">
                            00:40:30 12/12/17
                        </span> 
                    </div>
                </div>
                <div className="queue-modal__operation-info-ext-block">
                    <div className="queue-modal__operation-50">
                        <span className="queue-modal__operation-wide">
                            <img src="/assets/img/icons/green_tick.svg" alt="Icon" />
                            Installation start:
                        </span>
                        <span id="installation-start-time">
                            00:30:45 12/12/17
                        </span> 
                    </div>
                    <div className="queue-modal__operation-50">
                        <span className="queue-modal__operation-wide queue-modal__operation-wide--medium">
                            <img src="/assets/img/icons/green_tick.svg" alt="Icon" />
                            Installation completed:
                        </span>
                        <span id="installation-completed-time">
                            00:30:45 12/12/17
                        </span> 
                    </div>
                </div>
                <div className="queue-modal__operation-info-ext-block">
                    <div className="queue-modal__operation-100">
                        <span className="queue-modal__operation-wide queue-modal__operation-wide--long">
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
        );
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
                        queue ?
                            queueInfo
                        :
                            historyInfo
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