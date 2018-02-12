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
        this.handleWindowClose = this.handleWindowClose.bind(this);
        this.deselectSlot = this.deselectSlot.bind(this);
    }
    componentWillMount() {
        let matrixFromStorage = JSON.parse(localStorage.getItem(`matrix-${this.props.wizardIdentifier}`));
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

    handleWindowClose(e) {
        e.preventDefault();
        localStorage.removeItem(`matrix-${this.props.wizardIdentifier}`);
    }

    componentDidMount() {
        window.addEventListener("beforeunload",this.handleWindowClose);
    }

    componentWillUnmount() {
        localStorage.setItem(`matrix-${this.props.wizardIdentifier}`, JSON.stringify(this.updateMatrix));
        window.removeEventListener('onbeforeunload',this.handleWindowClose);
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

    moveElement(item, e) {
        if (e.target.className.indexOf('highlighted') !== -1) {
            this.destinationElement = item;
            this.handleMove();
            this.resetHighlightedSpaces();
            this.selectedElement = null;
            this.destinationElement = null;
        }
    }

    highlightAvailableSpaces(selectedElementRow) {
        let nextRow  = $(`.row-${selectedElementRow+1}`);
        let prevRow  = $(`.row-${selectedElementRow-1}`);

        nextRow[0] ? nextRow[0].classList.remove('hide') : null;
        prevRow[0] ? prevRow[0].classList.remove('hide') : null;

        let nextRowNode = nextRow.children.length ?  _.first(nextRow.children('.empty-node')) : null;
        let prevRowNode = prevRow.children.length ? _.first(prevRow.children('.empty-node')) : null;

        nextRowNode ? nextRowNode.classList.add('highlighted') : null;
        prevRowNode ? prevRowNode.classList.add('highlighted') : null;
    }

    resetHighlightedSpaces() {
        let emptyNodes  = $('.empty-node');

        _.each(emptyNodes, (val) => {
            val.classList.remove('highlighted')
        });
    }

    selectSlot(item, e) {
        if (e) e.preventDefault();
        this.selectedElement = item;
        if (item.value.name) {
            this.resetHighlightedSpaces();
            this.highlightAvailableSpaces(item.row);
        }
    }

    deselectSlot() {
        this.selectedElement = null;
        this.resetHighlightedSpaces();
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
                            {updatesMatrix[rowIndex] && updatesMatrix[rowIndex].length>0
                            ?
                                _.map(updatesMatrix[rowIndex], (value, columnIndex) => {
                                    if (!_.isEmpty(value)) {
                                        return (
                                            <Item
                                                value={value}
                                                selectSlot={this.selectSlot}
                                                selectedElement={this.selectedElement}
                                                deselectSlot={this.deselectSlot}
                                                moveElement={this.moveElement}
                                                row={rowIndex}
                                                column={columnIndex}
                                                key={columnIndex}
                                            />
                                        )
                                    } else {
                                        return <div className="empty-node"
                                                    onClick={!_.isNull(this.selectedElement) ? this.moveElement.bind(this, {column: columnIndex, row: rowIndex, value}) : null}
                                                    key={columnIndex}/>
                                    }
                                })
                            :   _.map(updatesArray, (value, columnIndex) => {
                                    return <div className="empty-node"
                                                onClick={!_.isNull(this.selectedElement) ? this.moveElement.bind(this, {column: columnIndex, row: rowIndex, value}) : null}
                                                key={rowIndex}/>
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