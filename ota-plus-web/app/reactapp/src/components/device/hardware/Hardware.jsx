import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import HardwareList from './List';
import HardwareOverlay from './Overlay';
import { FadeAnimation } from '../../../utils';
import _ from 'underscore';

@observer
class Hardware extends Component {
    @observable detailsIdShown = null;
    @observable shownIds = [];

    constructor(props) {
        super(props);
        this.findNode = this.findNode.bind(this);
        this.showDetails = this.showDetails.bind(this);
        this.hideDetails = this.hideDetails.bind(this);
    }
    findNode(id, hardware) {
        let i, currentChild, result;
        if (id == hardware['id-nr']) {
            return hardware;
        } else {
            if (hardware.children != null) {
                for (i = 0; i < hardware.children.length; i += 1) {
                    currentChild = hardware.children[i];
                    result = this.findNode(id, currentChild);
                    if (result !== false) {
                        return result;
                    }
                }
            }
            return false;
        }
    }
    showDetails(e) {
        e.preventDefault();
        e.stopPropagation();
        this.detailsIdShown = e.target.dataset.id
    }
    hideDetails(e) {
        if(e) e.preventDefault();
        this.detailsIdShown = null;
    }
    render() {
        const { hardwareStore } = this.props;
        return (
            <span>
                <div className="hardware-list">
                    <HardwareList 
                        hardware={hardwareStore.hardware}
                        showDetails={this.showDetails}
                        shownIds={this.shownIds}
                        detailsIdShown={this.detailsIdShown}
                    />
                </div>

                {this.detailsIdShown ?
                    <FadeAnimation>
                        <div className="overlay-animation-container">
                            <HardwareOverlay 
                                hardware={this.findNode(this.detailsIdShown, hardwareStore.hardware)}
                                hideDetails={this.hideDetails}
                                shown={this.detailsIdShown ? true : false}
                            />
                        </div>
                    </FadeAnimation>
                : 
                    null
                }
            </span>
        );
    }
}

Hardware.propTypes = {
    hardwareStore: PropTypes.object.isRequired
}

export default Hardware;