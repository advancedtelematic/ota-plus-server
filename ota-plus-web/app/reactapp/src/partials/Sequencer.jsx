/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, toJS, extendObservable } from 'mobx';
import _ from 'lodash';
import $ from 'jquery';
import SequencerItem from './SequencerItem';
import SequencerProgress from './SequencerProgress';

/*
 * Selectors used in this component
 *
 */
const FLEX_ROW = 'c-sequencer__flexrow';
const EMPTY_NODE = 'c-sequencer__empty-node';
const EMPTY_NODE_HIGHLIGHTED = 'c-sequencer__empty-node--highlighted';

/*
 * Default phases timeouts (in seconds)
 *
 */
const INIT_PROGRESS_TIME = 4;
const PHASE_PROGRESS_TIME = 4;
const TERMINATION_PROGRESS_TIME = 4;

@inject('stores')
@observer
class Sequencer extends Component {
  @observable destinationElement = null;
  @observable selectedElement = null;
  @observable campaignUpdates = [];
  @observable updateMatrix = [];

  static propTypes = {
    stores: PropTypes.object,
    wizardIdentifier: PropTypes.string,
    entity: PropTypes.string,
    data: PropTypes.string,
    readOnly: PropTypes.bool,
  };

  componentWillMount() {
    const { wizardIdentifier } = this.props;
    const matrixFromStorage = JSON.parse(localStorage.getItem(`matrix-${wizardIdentifier}`));
    if (_.isEmpty(matrixFromStorage)) {
      this._createCampaignUpdates();
      this._createMatrix();
    } else {
      this._createCampaignUpdates(matrixFromStorage[0]);
      this.updateMatrix = matrixFromStorage;
    }
    if (this.campaignUpdates.length >= 2) {
      this.showFullScreen();
    }
  }

  componentWillUnmount() {
    const { entity, wizardIdentifier } = this.props;

    if (entity === 'campaign') {
      localStorage.setItem(`matrix-${wizardIdentifier}`, JSON.stringify(this.updateMatrix));
    }
  }

  selectAction = (actionType, value) => {
    _.each(this.campaignUpdates, version => {
      if (version.name === value.name) {
        extendObservable(version, { selectedAction: actionType });
        extendObservable(value, { selectedAction: actionType });
      }
    });
  };

  showFullScreen = e => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { campaignsStore } = stores;
    campaignsStore._showFullScreen();
  };

  hideFullScreen = e => {
    if (e) e.preventDefault();
    const { stores } = this.props;
    const { campaignsStore } = stores;
    campaignsStore._hideFullScreen();
  };

  _createCampaignUpdates = (data = null) => {
    const { data: propsData } = this.props;
    const updates = data || propsData;
    const campaignUpdates = [];
    _.map(updates, element => {
      campaignUpdates.push({ ...element });
    });
    this.campaignUpdates = campaignUpdates;
  };

  _createMatrix = () => {
    const { campaignUpdates } = this;
    let alreadyCreated = false;

    const updatesMatrix = new Array(campaignUpdates.length);
    let columnNumber = 0;

    if (columnNumber === campaignUpdates.length) {
      columnNumber = 0;
    }

    if (campaignUpdates.length >= 2) {
      for (let i = 0; i < campaignUpdates.length; i++) {
        updatesMatrix[i] = [];

        if (i === 0 && !alreadyCreated) {
          alreadyCreated = true;

          _.map(campaignUpdates, packageItem => {
            updatesMatrix[i].push(packageItem);
          });

          columnNumber++;
        } else {
          for (let k = 0; k < campaignUpdates.length; k++) {
            updatesMatrix[i][k] = [];
          }
        }
      }
    } else {
      updatesMatrix[0] = [_.first(campaignUpdates)];
    }
    this.campaignUpdates = campaignUpdates;
    this.updateMatrix = updatesMatrix;
  };

  moveElement = (item, e) => {
    if (e.target.className.indexOf(EMPTY_NODE_HIGHLIGHTED) !== -1) {
      this.destinationElement = item;
      this.handleMove();
      this.resetHighlightedSpaces();
      this.selectedElement = null;
      this.destinationElement = null;
    }
  };

  highlightAvailableSpaces = selectedElementRow => {
    const nextRow = $(`.${  FLEX_ROW  }--${  selectedElementRow + 1}`);
    const prevRow = $(`.${  FLEX_ROW  }--${  selectedElementRow - 1}`);

    const nextRowNode = nextRow.children.length ? _.first(nextRow.children(`.${  EMPTY_NODE}`)) : null;
    const prevRowNode = prevRow.children.length ? _.first(prevRow.children(`.${  EMPTY_NODE}`)) : null;

    if (nextRowNode) nextRowNode.classList.add(EMPTY_NODE_HIGHLIGHTED);
    if (prevRowNode) prevRowNode.classList.add(EMPTY_NODE_HIGHLIGHTED);
  };

  resetHighlightedSpaces = () => {
    const emptyNodes = $(`.${  EMPTY_NODE}`);

    _.each(emptyNodes, val => {
      val.classList.remove(EMPTY_NODE_HIGHLIGHTED);
    });
  };

  selectSlot = (item, e) => {
    if (e) e.preventDefault();
    this.selectedElement = item;
    if (item.value.name) {
      this.resetHighlightedSpaces();
      this.highlightAvailableSpaces(item.row);
    }
  };

  deselectSlot = () => {
    this.selectedElement = null;
    this.resetHighlightedSpaces();
  };

  handleMove = () => {
    const updatesMatrix = toJS(this.updateMatrix);

    const source = { ...this.selectedElement };
    const destination = { ...this.destinationElement };
    const initialTargetColumn = destination.column;
    const initialTargetRow = destination.row;
    const initialSourceColumn = source.column;
    const initialSourceRow = source.row;
    let targetColumn = initialTargetColumn;
    const targetRow = initialTargetRow;
    for (let i = 0; i < updatesMatrix.length; i++) {
      if (_.isEmpty(updatesMatrix[targetRow][i])) {
        targetColumn = i;
        break;
      }
    }
    this.updateMatrix[initialSourceRow][initialSourceColumn] = [];
    this.updateMatrix[targetRow][targetColumn] = source.value;
  };

  render() {
    const { readOnly } = this.props;
    const updatesMatrix = this.updateMatrix;
    const updatesArray = this.campaignUpdates;
    const numberOfPhases = updatesArray.length;
    const initPhase = (
      <div className='c-sequencer__wrapper'>
        <div className='c-sequencer__init'>Phase 1</div>
        <div className='c-sequencer__flexrow c-sequencer__flexrow--default-phase'>
          <div
            className='c-sequencer__starter-point'
            onClick={!_.isNull(this.selectedElement) && this.selectedElement.row > 0 ? this.moveElement.bind(this, { column: -1, row: -1, value: {} }) : null}
          >
            <div className='c-sequencer__text'>Init</div>
            {readOnly ? <SequencerProgress delay={0} duration={INIT_PROGRESS_TIME} className="c-sequencer__progress c-sequencer__progress--default-phase" /> : null}
          </div>
          <div className='c-sequencer__init' style={{ visibility: 'hidden' }}>
            Phase 1
          </div>
        </div>
      </div>
    );
    const terminationPhase = (
      <div className='c-sequencer__wrapper'>
        <div className='c-sequencer__termination'>Phase {numberOfPhases + 2}</div>
        <div className='c-sequencer__flexrow c-sequencer__flexrow--default-phase'>
          <div className='c-sequencer__end-point' onClick={!_.isNull(this.selectedElement) && this.selectedElement.row > 0 ? this.moveElement.bind(this, { column: -1, row: -1, value: {} }) : null}>
            <div className='c-sequencer__text'>Termination</div>
            {readOnly ? (
              <SequencerProgress
                delay={INIT_PROGRESS_TIME + PHASE_PROGRESS_TIME * numberOfPhases}
                duration={TERMINATION_PROGRESS_TIME}
                className="c-sequencer__progress c-sequencer__progress--default-phase"
              />
            ) : null}
          </div>
          <div className='c-sequencer__termination' style={{ visibility: 'hidden' }}>
            Phase {updatesArray.length + 2}
          </div>
        </div>
      </div>
    );
    return (
      <div className='c-sequencer'>
        {initPhase}
        {_.map(updatesArray, (val, rowIndex) => {
          const rowIsEmpty = _.find(updatesMatrix[rowIndex], obj => !_.isEmpty(obj));
          return (
            <div className={`c-sequencer__wrapper ${rowIsEmpty || this.selectedElement ? 'c-sequencer__wrapper--show' : 'c-sequencer__wrapper--hide'}`}>
              <span className='c-sequencer__phase'>Phase {rowIndex + 2}</span>
              <div className={`c-sequencer__flexrow c-sequencer__flexrow--${rowIndex} ${rowIsEmpty || this.selectedElement ? '' : 'c-sequencer__flexrow--hide'}`} key={rowIndex}>
                {updatesMatrix[rowIndex] && updatesMatrix[rowIndex].length > 0
                  ? _.map(updatesMatrix[rowIndex], (value, columnIndex) => {
                      if (!_.isEmpty(value)) {
                        return (
                          <SequencerItem
                            value={value}
                            delay={INIT_PROGRESS_TIME * (rowIndex + 1)}
                            duration={PHASE_PROGRESS_TIME}
                            selectSlot={this.selectSlot}
                            selectedElement={this.selectedElement}
                            deselectSlot={this.deselectSlot}
                            selectAction={this.selectAction}
                            row={rowIndex}
                            column={columnIndex}
                            key={`${rowIndex  }-${  columnIndex}`}
                            readOnly={readOnly}
                          />
                        );
                      } 
                        return (
                          <div
                            className='c-sequencer__empty-node'
                            onClick={!_.isNull(this.selectedElement) ? this.moveElement.bind(this, { column: columnIndex, row: rowIndex, value }) : null}
                            key={`${rowIndex  }-${  columnIndex}`}
                          />
                        );
                      
                    })
                  : _.map(updatesArray, (value, columnIndex) => (
                        <div
                          className='c-sequencer__empty-node'
                          onClick={!_.isNull(this.selectedElement) ? this.moveElement.bind(this, { column: columnIndex, row: rowIndex, value }) : null}
                          key={`${rowIndex  }-${  columnIndex}`}
                        />
                      ))}
              </div>
            </div>
          );
        })}
        {terminationPhase}
      </div>
    );
  }
}

export default Sequencer;
