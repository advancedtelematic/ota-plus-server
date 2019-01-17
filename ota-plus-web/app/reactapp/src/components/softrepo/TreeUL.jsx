/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';
import { VelocityTransitionGroup } from 'velocity-react';
import { keys } from './data';

@observer
class TreeUl extends Component {
  @observable showUserInfo = false;
  @observable userInfo = {};

  static propTypes = {
    data: PropTypes.object,
    shown: PropTypes.bool.isRequired,
    openTreeNode: PropTypes.func.isRequired,
    level: PropTypes.number,
    filterPackagesAndCampaigns: PropTypes.func.isRequired,
  };

  getUserInfo(object, e) {
    const info = e.target.parentNode.nextSibling;
    if (this.userInfo.email && object.email === this.userInfo.email) {
      this.showUserInfo = !this.showUserInfo;
      info.classList.add('hide');
    } else {
      this.showUserInfo = true;
      info.classList.remove('hide');
    }
    this.userInfo = {
      ...object,
      element: e.target,
    };
  }

  deselectRoles = () => {
    const selectedRoles = document.querySelectorAll('div[title].expanded');

    selectedRoles.forEach(role => {
      role.classList.remove('expanded');
      role.querySelector('span.expanded').classList.remove('expanded');
      role.querySelector('div.info').classList.add('hide');
    });
  };

  showInfo = e => {
    const { filterPackagesAndCampaigns } = this.props;
    e.stopPropagation();
    this.deselectRoles(e);

    e.target.nextSibling.classList.toggle('hide');
    e.target.classList.toggle('expanded');
    e.target.parentNode.classList.toggle('expanded');

    filterPackagesAndCampaigns(e);
  };

  render() {
    const { data, openTreeNode, level = 0, filterPackagesAndCampaigns, shown } = this.props;
    let totalCount = 0;
    return (
      //ToDO: restore the VelocityTransitionGroup, insted of Ul
      <ul className={shown ? `tree shown level-${level}` : `hide level-${level}`}>
        {_.map(data, (items, key) => (
          <li key={key}>
            <div title={key} onClick={this.showInfo}>
              {Object.keys(items).length ? <i className='fa fa-angle-right' aria-hidden='true' onClick={openTreeNode} /> : null}
              <span>{key}</span>
              <div
                className='info hide'
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <div className='owners'>
                  {_.map(items.keys, (itemKey, i) => {
                    const person = keys.keys[itemKey].owner;
                    return (
                      <i
                        title={itemKey}
                        key={i}
                        className={`fa fa-owner ${this.userInfo.element && this.showUserInfo && this.userInfo.element.title === itemKey ? 'selected-user' : ''}`}
                        aria-hidden='true'
                        onClick={this.getUserInfo.bind(this, person)}
                      />
                    );
                  })}
                </div>
                <div className='user-info hide'>
                  <div className='left-column'>
                    <ul>
                      <li>Name:</li>
                      <li>Position:</li>
                      <li>Company:</li>
                      <li>Location:</li>
                      <li>Email:</li>
                      <li>Telephone:</li>
                      <li>Group:</li>
                    </ul>
                  </div>
                  <div className='right-column'>
                    <ul>
                      <li>{this.userInfo.name}</li>
                      <li>{this.userInfo.position}</li>
                      <li>{this.userInfo.company}</li>
                      <li>{this.userInfo.location}</li>
                      <li>{this.userInfo.email}</li>
                      <li>{this.userInfo.phone}</li>
                      <li>{this.userInfo.group}</li>
                    </ul>
                  </div>
                </div>
                {_.map(items.thresholds, obj => {
                  totalCount += obj;
                })}
                {items.thresholds && (
                  <div className='thresholds'>
                    <div>
                      <div className='left-column'>
                        <span className='total'>{totalCount}</span>
                      </div>
                      <div className='right-column'>
                        {_.map(items.thresholds, (obj, i) => (
                          <div key={i} className='right-column'>
                            {` ${obj} ${i}`}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className='expires'>
                      <div className='left-column'>Expire date:</div>
                      <div className='right-column'>{items.expires}</div>
                    </div>
                  </div>
                )}
                {((items.warnings && items.warnings.length > 0) || (items.errors && items.errors.length > 0)) && (
                  <div className='warnings'>
                    {_.map(items.warnings, (warning, itemKey) => (
                      <div key={itemKey}>
                        <div className='left-column'>
                          <i className='fa warning' aria-hidden='true' />
                        </div>
                        <div className='right-column'>{warning}</div>
                      </div>
                    ))}
                    {_.map(items.errors, (error, itemKey) => (
                      <div key={itemKey}>
                        <div className='left-column'>
                          <i className='fa fa-error' aria-hidden='true' />
                        </div>
                        <div className='right-column'>{error}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <TreeUl data={items.authorises} shown={false} level={level + 1} openTreeNode={openTreeNode} filterPackagesAndCampaigns={filterPackagesAndCampaigns} />
          </li>
        ))}
      </ul>
    );
  }
}

export default TreeUl;
