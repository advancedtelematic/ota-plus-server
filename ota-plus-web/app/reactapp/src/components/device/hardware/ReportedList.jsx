import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable, observe } from 'mobx';
import _ from 'underscore';

const headerHeight = 28;
const noSearchResults = "No search results";

@observer
class ReportedList extends Component {
    @observable firstShownIndex = 0;
    @observable lastShownIndex = 50;
    @observable fakeHeaderText = null;
    @observable fakeHeaderTopPosition = 0;
    @observable expandedPackageName = null;
    @observable tmpIntervalId = null;

    constructor(props) {
        super(props);
        this.generateHeadersPositions = this.generateHeadersPositions.bind(this);
        this.generateItemsPositions = this.generateItemsPositions.bind(this);
        this.listScroll = this.listScroll.bind(this);
    }
    componentDidMount() {
        if(this.refs.list) {
            this.refs.list.addEventListener('scroll', this.listScroll);
            this.listScroll();
        }
    }
    componentWillUnmount() {
        if(this.refs.list) {
            this.refs.list.removeEventListener('scroll', this.listScroll);            
        }
    }
    generateHeadersPositions() {
        const headers = this.refs.list.getElementsByClassName('header');
        const wrapperPosition = this.refs.list.getBoundingClientRect();
        let positions = [];
        _.each(headers, (header) => {
            let position = header.getBoundingClientRect().top - wrapperPosition.top + this.refs.list.scrollTop;
            positions.push(position);
        }, this);
        return positions;
    }
    generateItemsPositions() {
        const items = this.refs.list.getElementsByClassName('item');
        const wrapperPosition = this.refs.list.getBoundingClientRect();
        let positions = [];
        _.each(items, (item) => {
            let position = item.getBoundingClientRect().top - wrapperPosition.top + this.refs.list.scrollTop;
            positions.push(position);
        }, this);
        return positions;
    }
    listScroll() {
        if(this.refs.list) {
            const headersPositions = this.generateHeadersPositions();
            const itemsPositions = this.generateItemsPositions();
            let scrollTop = this.refs.list.scrollTop;
            let listHeight = this.refs.list.getBoundingClientRect().height;
            let newFakeHeaderText = this.fakeHeaderText;
            let firstShownIndex = null;
            let lastShownIndex = null;
            _.each(headersPositions, (position, index) => {
                if(scrollTop >= position) {
                    newFakeHeaderText = this.props.hardware[index].name;
                    return true;
                } else if(scrollTop >= position - headerHeight) {
                    scrollTop -= scrollTop - (position - headerHeight);
                    return true;
                }
            }, this);
            _.each(itemsPositions, (position, index) => {
                if(firstShownIndex === null && scrollTop <= position) {
                    firstShownIndex = index;
                } else if(lastShownIndex === null && scrollTop + listHeight <= position) {
                    lastShownIndex = index;
                }
            }, this);
            this.firstShownIndex = firstShownIndex;
            this.lastShownIndex = lastShownIndex !== null ? lastShownIndex : itemsPositions.length - 1;
            this.fakeHeaderText = newFakeHeaderText.toLowerCase();
            this.fakeHeaderTopPosition = scrollTop;
        }
    }
    componentWillReceiveProps(nextProps) {
        const that = this;
        setTimeout(() => {
            that.listScroll();
        }, 50);
    }
    render() {
        const { hardware } = this.props;
        _.map(hardware, (obj, index) => {
            if(obj.hasOwnProperty('showId') && !obj.showId) {
                delete obj.showId;
                delete obj.id;
            }
        });
        let that = this;
        let indexOne = 0;
        let result = (
            hardware.length ? 
                <ul className="ios-list" ref="list">
                    {_.map(hardware, (hwItem, index) => {
                        return (
                            <li key={index}>
                                <div className="fake-header" style={{top: this.fakeHeaderTopPosition}}>
                                    {that.fakeHeaderText}
                                </div>
                                <div className="header">
                                    {hwItem.name.toLowerCase()}
                                </div>
                                <div>
                                    <table className="table">
                                        <tbody>
                                            {_.map(hwItem, function(value, property) {
                                                indexOne++;
                                                if(property !== 'children' && property !== 'name' && property !== 'capabilities' && property !== 'configuration') {
                                                    return (
                                                        <tr className="item" key={indexOne}>
                                                            <th>
                                                                <div>{property}</div>
                                                            </th>
                                                            <td>
                                                                <div>{value.toString()}</div>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </li>
                        );
                    })}
                </ul>   
            :
                <div className="wrapper-center" style={{height: '100%'}}>
                    {noSearchResults}
                </div>
        );
        return (
            result
        );
    }
}

ReportedList.propTypes = {
    hardware: PropTypes.object.isRequired,
}

export default ReportedList;
