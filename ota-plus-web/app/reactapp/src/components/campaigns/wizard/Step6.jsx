import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable, toJS } from 'mobx';
import _ from 'underscore';
import $ from 'jquery';
import {Item} from './step6';

@observer
class WizardStep6 extends Component {

    @observable destinationElement = null;
    @observable selectedElement = null;
    @observable campaignUpdates= [];
    @observable updateMatrix = [];

    constructor(props) {
        super(props);
        this._createCampaignUpdates = this._createCampaignUpdates.bind(this);
        this._createMatrix = this._createMatrix.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.highlightAvailableSpaces = this.highlightAvailableSpaces.bind(this);
        this.resetHighlightedSpaces = this.resetHighlightedSpaces.bind(this);
        this.selectSlot = this.selectSlot.bind(this);
        this.moveElement = this.moveElement.bind(this);
    }
    componentWillMount() {
        let matrixFromStorage = JSON.parse(localStorage.getItem('matrix'));
        if (_.isEmpty(matrixFromStorage)) {
            this._createCampaignUpdates();
            this._createMatrix();
        } else {
            this._createCampaignUpdates();
            this.updateMatrix = matrixFromStorage;
        }
        if(this.campaignUpdates.length > 2) {
            this.props.showFullScreen();
        }
    }

    componentWillUnmount() {
        localStorage.setItem('matrix', JSON.stringify(this.updateMatrix));
    }

    _createCampaignUpdates() {
        let updates = Array.reverse(this.props.wizardData[2].versions);
        let campaignUpdates = [];
        _.mapObject(updates, (element, key) => {
            campaignUpdates.push({...element, name: key});
        });

        this.campaignUpdates = campaignUpdates;
    }

    _createMatrix() {
        let updates = Array.reverse(this.props.wizardData[2].versions);
        let campaignUpdates = this.campaignUpdates;
        let alreadyCreated = false;

        const updatesMatrix = new Array(campaignUpdates.length);
        let columnNumber = 0;

        if (columnNumber === campaignUpdates.length) {
            columnNumber = 0;
        }

        if (campaignUpdates.length >= 2) {

            for (let i = 0; i < campaignUpdates.length; i++ ) {

                updatesMatrix[i] = [];

                if (i === 0 && !alreadyCreated ) {
                    alreadyCreated = true;

                    _.map(campaignUpdates, (packageItem) => {
                        updatesMatrix[i].push(packageItem)
                    });

                    columnNumber++;
                } else {
                    for (let k = 0; k < campaignUpdates.length; k++) {
                        updatesMatrix[i][k] = [];
                    }
                }
            }
        } else {
            updatesMatrix[0] = [
                _.first(campaignUpdates)
            ]
        }
        this.campaignUpdates = campaignUpdates;
        this.updateMatrix = updatesMatrix;
    }

    moveElement(item) {
        this.destinationElement = item;
        if(!_.isEqual(this.selectedElement, this.destinationElement)) {
            this.handleMove();
        }
        this.resetHighlightedSpaces();
        this.selectedElement = null;
        this.destinationElement = null;
    }

    highlightAvailableSpaces() {
        let successNodes = $('.exit-nodes .success');
        let starterPoint = $('#starter-point');
        _.each(successNodes, (node) => {
            node.classList.add("active");
        });
        if(this.selectedElement.row > 0) {
            starterPoint[0].classList.add("active");
        }
    }

    resetHighlightedSpaces() {
        let successNodes = $('.exit-nodes .success');
        let starterPoint = $('#starter-point');
        _.each(successNodes, (node) => {
            node.classList.remove("active");
        });
        starterPoint[0].classList.remove("active");
    }

    selectSlot(item, e) {
        if (e) e.preventDefault();
        this.selectedElement = item;
        if (item.value.name) {
            this.resetHighlightedSpaces();
            this.highlightAvailableSpaces();
        }
    }

    handleMove() {
        const updatesMatrix = toJS(this.updateMatrix);

        let source = {...this.selectedElement};
        let destination = {...this.destinationElement};
        let initialTargetColumn = destination.column;
        let initialTargetRow = destination.row;
        let initialSourceColumn = source.column;
        let initialSourceRow = source.row;
        let targetColumn = initialTargetColumn;
        let targetRow = initialTargetRow;
        targetRow += 1;
        for (let i = 0; i < updatesMatrix.length; i++) {
            if(_.isEmpty(updatesMatrix[targetRow][i])) {
                targetColumn = i;
                break;
            }
        }
        this.updateMatrix[initialSourceRow][initialSourceColumn] = [];
        this.updateMatrix[targetRow][targetColumn] = source.value;
    }

    render() {
        const { showFullScreen, hideFullScreen, fullScreenMode } = this.props;
        const updatesMatrix = this.updateMatrix;
        const updatesArray = this.campaignUpdates;
        return (
            <div className="sequencer">
                {fullScreenMode ?
                    <div className="hide-fullscreen">
                        <a href="#" onClick={hideFullScreen.bind(this)}>
                            <img src="/assets/img/icons/black/minimize.svg" alt="Icon" />
                        </a>
                    </div>
                :
                    <div className="show-fullscreen">
                        <a href="#" onClick={showFullScreen.bind(this)}>
                            <img src="/assets/img/icons/black/maximize.svg" alt="Icon" />
                        </a>
                    </div>
                }
                <div className="minimize"/>
                <div className="init">Init</div>
                <div className="termination">Termination</div>
                <div id="starter-point"
                     onClick={!_.isNull(this.selectedElement) && this.selectedElement.row > 0 ? this.moveElement.bind(this, {column : -1, row: -1, value: {}}) : null}
                />
                <div id="end-point"/>
                {_.map(updatesArray, (val, rowIndex) => {
                    return (
                        <div className={`flexrow row-${rowIndex} `} key={rowIndex}>
                            <span className="phase">Phase {rowIndex + 1}</span>
                            {updatesMatrix[rowIndex].length>0
                            ?
                                _.map(updatesMatrix[rowIndex], (value, columnIndex) => {
                                    if (!_.isEmpty(value)) {
                                        return (
                                            <Item
                                                value={value}
                                                selectSlot={this.selectSlot}
                                                selectedElement={this.selectedElement}
                                                moveElement={this.moveElement}
                                                row={rowIndex}
                                                column={columnIndex}
                                                key={columnIndex}
                                            />
                                        )
                                    } else {
                                        return <div className="empty-node" key={columnIndex}/>
                                    }
                                })
                            :   _.map(updatesArray, () => {
                                    return <div className="empty-node" key={rowIndex}/>
                                })
                            }
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default WizardStep6;