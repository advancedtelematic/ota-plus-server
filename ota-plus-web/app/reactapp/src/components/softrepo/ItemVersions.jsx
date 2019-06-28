/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col } from 'antd';
import _ from 'lodash';
import StatsBlock from '../software/stats/StatsBlock';

const ItemVersions = ({ groupItem }) => (
  <Row
    className="row versions-details"
    onClick={(e) => {
      e.stopPropagation();
    }}
  >
    {(groupItem.warnings && groupItem.warnings.length > 0) || (groupItem.errors && groupItem.errors.length > 0) ? (
      <Col span={24}>
        <div className="warnings">
          {_.map(groupItem.warnings, (warning, key) => (
            <p>
              <i key={key} className="fa warning" aria-hidden="true" />
              {warning}
            </p>
          ))}
          {_.map(groupItem.errors, (error, key) => (
            <p>
              <i key={key} className="fa fa-error" aria-hidden="true" />
              {error}
            </p>
          ))}
        </div>
      </Col>
    ) : (
      ''
    )}
    <Col span={24} className="director-details">
      <Row className="row">
        <Col span={8}>
          <p>Distribution by devices</p>
          {groupItem.versions ? (
            <StatsBlock
              type="devices"
              size={{ width: '120', height: '120' }}
              pack={groupItem}
            />
          ) : ''}
        </Col>
        <Col span={8}>
          <p>Distribution by group</p>
          {groupItem.stats && groupItem.stats.groups ? (
            <StatsBlock
              type="groups"
              size={{ width: '120', height: '120' }}
              pack={groupItem}
            />
          ) : ''}
        </Col>
        <Col span={8}>
          <p>Failure rate</p>
          {groupItem.stats && groupItem.stats.installationResults ? (
            <StatsBlock
              type="results"
              size={{ width: '120', height: '120' }}
              pack={groupItem}
            />
          ) : ''}
        </Col>
      </Row>
    </Col>
    <Col span={24}>
      <ul className="versions">
        {groupItem.versions && Object.keys(groupItem.versions).map((version, versionKey) => {
          const versionItem = groupItem.versions[version];
          return (
            <li key={versionKey}>
              <Row className="row">
                <Col span={12}>
                  <div className="left-box">
                    <div className="version-info">
                      <span className="light">
                        {`Version: ${version}`}
                      </span>
                      <span className="light">
                        {`Created at: ${versionItem.created}`}
                      </span>
                      <span className="light">
                        {`Updated at: ${versionItem.updated}`}
                      </span>
                      <span className="light">
                        {`Hash: ${versionItem.hash}`}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="right-box">
                    <span className="light">
                      {`Length: ${versionItem.length}`}
                    </span>
                    <span className="light">
                      {`Installed on ${versionItem.installedOnEcus} ECU(s)`}
                    </span>
                    <span className="light">
                      {'ECU types: '}
                      {_.map(versionItem.id, (id, key) => (
                        <span key={key} className="app-label">
                          {id}
                        </span>
                      ))}
                    </span>
                  </div>
                </Col>
              </Row>
            </li>
          );
        })}
      </ul>
    </Col>
  </Row>
);

ItemVersions.propTypes = {
  groupItem: PropTypes.shape({})
};

export default ItemVersions;
