/** @format */

import React, { Component, PropTypes, PureComponent } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { keys } from './data.js';

@observer
export default class TreeUl extends PureComponent {
  @observable showUserInfo = false;
  @observable userInfo = {};
  constructor(props) {
    super(props);
    this.deselectRoles = this.deselectRoles.bind(this);
    this.showInfo = this.showInfo.bind(this);
  }

  deselectRoles() {
    const selectedRoles = document.querySelectorAll('div[title].expanded');

    selectedRoles.forEach(role => {
      role.classList.remove('expanded');
      role.querySelector('span.expanded').classList.remove('expanded');
      role.querySelector('div.info').classList.add('hide');
    });
  }

  showInfo(e) {
    e.stopPropagation();
    this.deselectRoles(e);

    e.target.nextSibling.classList.toggle('hide');
    e.target.classList.toggle('expanded');
    e.target.parentNode.classList.toggle('expanded');

    this.props.filterPackagesAndCampaigns(e);
  }

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

  render() {
    const { data, openTreeNode, level = 0, filterPackagesAndCampaigns } = this.props;
    let totalCount = 0;
    return (
      <CSSTransitionGroup
        transitionName='slide'
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
        component={'ul'}
        className={this.props.shown ? `tree shown level-${level}` : `hidden level-${level}`}
      >
        {_.map(data, (items, key) => {
          const title = key;
          return (
            <li key={key}>
              <div title={title} onClick={this.showInfo}>
                {Object.keys(items).length ? <i className='fa fa-angle-right' aria-hidden='true' onClick={openTreeNode} /> : null}
                <span>{key}</span>
                <div
                  className='info hide'
                  onClick={e => {
                    e.stopPropagation();
                  }}
                >
                  <div className='owners'>
                    {_.map(items.keys, (key, i) => {
                      const person = keys.keys[key].owner;
                      return (
                        <i
                          title={key}
                          key={i}
                          className={`fa fa-owner ${this.userInfo.element && this.showUserInfo && this.userInfo.element.title === key ? 'selected-user' : ''}`}
                          aria-hidden='true'
                          onClick={this.getUserInfo.bind(this, person)}
                        />
                      );
                    })}
                  </div>
                  <div className='user-info hide'>
                    <div className='left-column'>
                      <ul>
                        <li>Name: </li>
                        <li>Position: </li>
                        <li>Company: </li>
                        <li>Location: </li>
                        <li>Email: </li>
                        <li>Telephone: </li>
                        <li>Group: </li>
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
                  {_.map(items.thresholds, (obj, i) => {
                    totalCount += obj;
                  })}
                  {items.thresholds ? (
                    <div className='thresholds'>
                      <div>
                        <div className='left-column'>
                          <span className='total'>{totalCount}</span>
                        </div>
                        <div className='right-column'>
                          {_.map(items.thresholds, (obj, i) => {
                            return (
                              <div key={i} className='right-column'>
                                {' ' + obj + ' ' + i}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className='expires'>
                        <div className='left-column'>Expire date:</div>
                        <div className='right-column'>{items.expires}</div>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                  {(items.warnings && items.warnings.length > 0) || (items.errors && items.errors.length > 0) ? (
                    <div className='warnings'>
                      {_.map(items.warnings, (warning, key) => {
                        return (
                          <p key={key}>
                            <div className='left-column'>
                              <i className='fa warning' aria-hidden='true' />
                            </div>
                            <div className='right-column'>{warning}</div>
                          </p>
                        );
                      })}
                      {_.map(items.errors, (error, key) => {
                        return (
                          <p key={key}>
                            <div className='left-column'>
                              <i className='fa fa-error' aria-hidden='true' />
                            </div>
                            <div className='right-column'>{error}</div>
                          </p>
                        );
                      })}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <TreeUl data={items.authorises} shown={false} level={level + 1} openTreeNode={openTreeNode} filterPackagesAndCampaigns={filterPackagesAndCampaigns} />
            </li>
          );
        })}
      </CSSTransitionGroup>
    );
  }
}
