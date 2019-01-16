/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, toJS } from 'mobx';
import _ from 'lodash';
import { Row, Col } from 'antd';
import { VelocityTransitionGroup } from 'velocity-react';
import { keys } from './data';

@observer
class List extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };
  @observable selectedElement = null;
  @observable selectedOwner = null;
  showInfo = (e, item) => {
    this.selectedElement = item === this.selectedElement ? null : item;
  };

  showUserInfo = e => {
    const alreadySelectedElements = document.querySelectorAll('i.selected-user');
    const parent = e.target.parentNode.parentNode.nextSibling;
    if (this.selectedOwner === e.target) {
      parent.classList.remove('hide');
    } else {
      parent.classList.add('hide');
    }
    alreadySelectedElements.forEach(el => {
      el.classList.remove('selected-user');
    });
    parent.classList.toggle('hide');
    if (parent.classList[0] === 'hide') {
      e.target.classList.remove('selected-user');
    } else {
      e.target.classList.add('selected-user');
    }
    this.selectedOwner = e.target;
  };

  render() {
    const { data } = this.props;
    const list = Object.keys(data.groups).map((group, groupKey) => (
      <li key={Math.floor(Math.random() * 3000 + groupKey)}>
        <span className='title'>{group}</span>
        <ul className='second-level'>
          {Object.keys(data.groups[group]).map((item, itemKey) => {
            const groupItem = data.groups[group][item];
            const totalProgressCount = +groupItem.processed + +groupItem.notProcessed;
            const packages = [];
            let person = '';

            groupItem.packages.forEach(packageItem => {
              packages.push(packageItem.replace(/[&\/\\#,+()$~%_.'":*?<>{}]/g, ''));
            });
            return (
              <li
                key={Math.floor(Math.random() * 10000 + itemKey)}
                className={this.selectedElement === item ? 'expanded' : ''}
                onClick={e => {
                  this.showInfo(e, item);
                }}
                data-packages={packages}
              >
                <span>{item}</span>
                <div
                  className={`info ${this.selectedElement === item ? '' : 'hide'}`}
                  onClick={e => {
                    e.stopPropagation();
                  }}
                >
                    <div span={24} className='user-info'>
                      <div className='owners'>
                        {_.map(groupItem.keys, (key, i) => {
                          person = keys.keys[key].owner;
                          return <i key={i} className='fa fa-owner' aria-hidden='true' onClick={this.showUserInfo.bind(this)} />;
                        })}
                      </div>
                    </div>
                    <Row className='list hide'>
                        <Col span={4}>
                          <ul>
                            <li>Name:</li>
                            <li>Position:</li>
                            <li>Company:</li>
                            <li>Location:</li>
                            <li>Email:</li>
                            <li>Telephone:</li>
                            <li>Group:</li>
                          </ul>
                        </Col>
                        <Col span={10}>
                          <ul>
                            <li>{person.name}</li>
                            <li>{person.position}</li>
                            <li>{person.company}</li>
                            <li>{person.location}</li>
                            <li>{person.email}</li>
                            <li>{person.phone}</li>
                            <li>{person.group}</li>
                          </ul>
                        </Col>
                    </Row>
                  {(groupItem.warnings && groupItem.warnings.length > 0) || (groupItem.errors && groupItem.errors.length > 0) ? (
                    <div className='warnings'>
                      {_.map(groupItem.warnings, (warning, key) => (
                        <p key={key}>
                          <i className='fa warning' aria-hidden='true' />
                          {warning}
                        </p>
                      ))}
                      {_.map(groupItem.errors, (error, key) => (
                        <p key={key}>
                          <i className='fa fa-error' aria-hidden='true' />
                          {error}
                        </p>
                      ))}
                    </div>
                  ) : (
                    ''
                  )}
                  <div className='total-progress'>
                    <Row className='headers row'>
                      <Col span={10}>
                        {groupItem.processed} <p>Processed</p>
                      </Col>
                      <Col span={10}>
                        {groupItem.affected} <p>Affected</p>
                      </Col>
                    </Row>
                    <div className='bar'>
                      <div
                        className='failure'
                        style={{
                          width: `${Math.floor((+groupItem.failure / totalProgressCount) * 100)}%`,
                          backgroundColor: '#C41C33',
                        }}
                      />
                      <div
                        className='success'
                        style={{
                          width: `${Math.floor((+groupItem.success / totalProgressCount) * 100)}%`,
                          backgroundColor: '#44CA9D',
                        }}
                      />
                      <div
                        className='queued'
                        style={{
                          width: `${Math.floor((+groupItem.queued / totalProgressCount) * 100)}%`,
                          backgroundColor: '#FA9D00',
                        }}
                      />
                      <div
                        className='not-impacted'
                        style={{
                          width: `${Math.floor((+groupItem.notImpacted / totalProgressCount) * 100)}%`,
                          backgroundColor: '#898B91',
                        }}
                      />
                      <div
                        className='not-proceed'
                        style={{
                          width: `${Math.floor((+groupItem.notProcessed / totalProgressCount) * 100)}%`,
                          backgroundColor: '#E7E7E8',
                        }}
                      />
                    </div>
                    <Row className='labels row'>
                      <Col span={12}>
                        <p>
                          <span className='label' style={{ backgroundColor: '#C41C33' }} />
                          Failure: {groupItem.failure}
                        </p>
                        <p>
                          <span className='label' style={{ backgroundColor: '#44CA9D' }} />
                          Successed: {groupItem.success}
                        </p>
                        <p>
                          <span className='label' style={{ backgroundColor: '#FA9D00' }} />
                          Queued: {groupItem.queued}
                        </p>
                      </Col>
                      <Col span={12}>
                        <p>
                          <span
                            className='label'
                            style={{
                              backgroundColor: '#898B91',
                              border: '1px solid #ccc',
                            }}
                          />
                          Not impacted: {groupItem.notImpacted}
                        </p>
                        <p>
                          <span
                            className='label'
                            style={{
                              backgroundColor: '#E7E7E8',
                              border: '1px solid #ccc',
                            }}
                          />
                          Not processed: {groupItem.notProcessed}
                        </p>
                      </Col>
                    </Row>
                  </div>
                  <Row className='version row'>
                    <Col span={12}>
                      <p>Launched: {groupItem.launched}</p>
                      <p>Started: {groupItem.started}</p>
                      <p>End: {groupItem.end}</p>
                    </Col>
                    <Col span={12}>
                      <div>
                        Dynamic:
                        <div className={`switch ${groupItem.dynamic ? 'switchOn' : ''}`} id='switch'>
                          <div className='switch-status' />
                        </div>
                      </div>
                      <div>
                        Autostop:
                        <div className={`switch ${groupItem.autostop ? 'switchOn' : ''}`} id='switch'>
                          <div className='switch-status' />
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className='ecus'>
                    <h5>ECUs</h5>
                    {_.map(groupItem.ecus, (ecu, key) => (
                      <p key={key}>{ecu}</p>
                    ))}
                  </div>
                  <div className='groups'>
                    {_.map(groupItem.groups, (group, key) => (
                      <div key={key} className='row display-flex'>
                        <div className='name'>
                          <div className='element-box group'>
                            <div className='icon fa-groups' />
                            <div className='desc'>
                              <div className='title' title={key}>
                                {key}
                              </div>
                              <div className='subtitle'>{group.total}</div>
                            </div>
                          </div>
                        </div>
                        <div className='stats'>
                          <div className='devices-progress'>
                            <div className='progress'>
                              <div className='progress-bar' role='progressbar' style={{ width: `${group.processed}%` }} />
                            </div>
                            <span className='value'>{`${group.processed}%`}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </li>
    ));

    return <div>{!_.isEmpty(toJS(data.groups)) ? list : <p className='absolute-align'>No associated campaigns</p>}</div>;
  }
}

export default List;
