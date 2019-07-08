/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';

const headerHeight = 28;
const noSearchResults = 'No search results';

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
    this.listRef = React.createRef();
  }

  componentDidMount() {
    if (this.listRef.current) {
      this.listRef.current.addEventListener('scroll', this.listScroll);
      this.listScroll();
    }
  }

  componentWillReceiveProps() {
    const that = this;
    setTimeout(() => {
      that.listScroll();
    }, 50);
  }

  componentWillUnmount() {
    if (this.listRef.current) {
      this.listRef.current.removeEventListener('scroll', this.listScroll);
    }
  }

  generateHeadersPositions = () => {
    const headers = this.listRef.current.getElementsByClassName('header');
    const wrapperPosition = this.listRef.current.getBoundingClientRect();
    const positions = [];
    _.each(
      headers,
      (header) => {
        const position = header.getBoundingClientRect().top - wrapperPosition.top + this.listRef.current.scrollTop;
        positions.push(position);
      },
      this,
    );
    return positions;
  };

  generateItemsPositions = () => {
    const items = this.listRef.current.getElementsByClassName('item');
    const wrapperPosition = this.listRef.current.getBoundingClientRect();
    const positions = [];
    _.each(
      items,
      (item) => {
        const position = item.getBoundingClientRect().top - wrapperPosition.top + this.listRef.current.scrollTop;
        positions.push(position);
      },
      this,
    );
    return positions;
  };

  listScroll = () => {
    if (this.listRef.current) {
      const headersPositions = this.generateHeadersPositions();
      const itemsPositions = this.generateItemsPositions();
      let { scrollTop } = this.listRef.current;
      const listHeight = this.listRef.current.getBoundingClientRect().height;
      let newFakeHeaderText = this.fakeHeaderText;
      let firstShownIndex = null;
      let lastShownIndex = null;
      _.each(
        headersPositions,
        (position, index) => {
          if (scrollTop >= position) {
            const { hardware } = this.props;
            newFakeHeaderText = hardware[index].name;
            return true;
          } if (scrollTop >= position - headerHeight) {
            scrollTop -= scrollTop - (position - headerHeight);
            return true;
          }
          return true;
        },
        this,
      );
      _.each(
        itemsPositions,
        (position, index) => {
          if (firstShownIndex === null && scrollTop <= position) {
            firstShownIndex = index;
          } else if (lastShownIndex === null && scrollTop + listHeight <= position) {
            lastShownIndex = index;
          }
        },
        this,
      );
      this.firstShownIndex = firstShownIndex;
      this.lastShownIndex = lastShownIndex !== null ? lastShownIndex : itemsPositions.length - 1;
      this.fakeHeaderText = newFakeHeaderText.toLowerCase();
      this.fakeHeaderTopPosition = scrollTop;
    }
  };


  render() {
    const { hardware } = this.props;
    _.map(hardware, (obj) => {
      if (Object.prototype.hasOwnProperty.call(obj, 'showId') && !obj.showId) {
        /* eslint-disable no-param-reassign */
        delete obj.showId;
        delete obj.id;
        /* eslint-enable no-param-reassign */
      }
    });
    const that = this;
    let indexOne = 0;
    const result = hardware.length ? (
      <ul className="ios-list" ref={this.listRef}>
        {_.map(hardware, (hwItem, index) => (
          <li key={index}>
            <div className="fake-header" style={{ top: this.fakeHeaderTopPosition }}>
              {that.fakeHeaderText}
            </div>
            <div className="header">{hwItem.name.toLowerCase()}</div>
            <div>
              <table className="table">
                <tbody>
                  {_.map(hwItem, (value, property) => {
                    indexOne += 1;
                    if (property !== 'children'
                      && property !== 'name'
                      && property !== 'capabilities'
                      && property !== 'configuration') {
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
                    return null;
                  })}
                </tbody>
              </table>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <div className="wrapper-center" style={{ height: '100%' }}>
        {noSearchResults}
      </div>
    );
    return result;
  }
}

ReportedList.propTypes = {
  hardware: PropTypes.shape({}).isRequired,
};

export default ReportedList;
