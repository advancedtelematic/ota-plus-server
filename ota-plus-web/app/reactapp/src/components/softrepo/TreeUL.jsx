import React, { Component, PropTypes, PureComponent } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import {keys} from './data.js';


@observer
export default class TreeUl extends PureComponent {
    @observable showUserInfo = false;
    @observable userInfo = {};
    constructor(props) {
        super(props);
    }

    resetContext(e) {
        if (e.target.nextSibling.classList[1]) {
            this.props.removeClasses();
        }
        let alreadyOpenedTreeNodes = document.querySelectorAll('div[title] .info:not(.hide)');
        if (alreadyOpenedTreeNodes.length > 1) {
            if (e.target.nextSibling === alreadyOpenedTreeNodes[0]) {
                alreadyOpenedTreeNodes[1].classList.add('hide');
            } else {
                alreadyOpenedTreeNodes[0].classList.add('hide');
            }
        }
    }

    showInfo(e) {
        e.stopPropagation();
        e.target.nextSibling.classList.toggle('hide');
        e.target.classList.toggle('expanded');
        e.target.parentNode.classList.toggle('expanded');
    }

    getUserInfo(object,e) {
        e.target.parentNode.nextSibling.classList.toggle('hide');
        if (this.userInfo.email && object.email === this.userInfo.email) {
            this.showUserInfo = !this.showUserInfo;
        } else {
            this.showUserInfo = true;
        }
        this.userInfo = {
            ...object,
            element: e.target
        };
        this.props.drawLinesFromKeys(e.target.parentNode.parentNode.previousSibling)
    }

    render() {
        const { data, drawLinesFromKeys, openTreeNode, getCanvasContext, removeClasses, deselectAll, level = 0 } = this.props;
        let totalCount = 0;
        return (
            <CSSTransitionGroup
                transitionName="slide"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
                component={"ul"}
                className={this.props.shown ? `tree shown level-${level}`  : `hidden level-${level}`}
            >
                {_.map(data, (items, key) => {
                    return (
                        <li key={key}>
                            <div title={key.replace(/[&\/\\#,+()$~%_.' ":*?<>{}]/g, '')} onClick={e => {
                                deselectAll(e);
                                this.showInfo(e);
                                drawLinesFromKeys(e, true);
                                this.resetContext(e);
                            }}>
                                {Object.keys(items).length
                                    ? <i className="fa fa-angle-right" aria-hidden="true" onClick={openTreeNode}/>
                                    : null}
                                <span>
                                    {key}
                                </span>
                                <div className="info hide" onClick={e => {e.stopPropagation()}}>
                                    <div className="owners">
                                        {_.map(items.keys, (key, i) => {
                                            const person = keys.keys[key].owner;
                                            return <i title={key} className={`fa fa-owner ${this.userInfo.element && this.showUserInfo  && this.userInfo.element.title === key ? 'selected-user' : ''}`} aria-hidden="true" onClick={this.getUserInfo.bind(this,person)}/>
                                        })}
                                    </div>
                                    <div className="user-info hide">
                                        <div className="left-column">
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
                                        <div className="right-column">
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
                                    {items.thresholds ?
                                        <div className="thresholds">
                                            <div>
                                                <div className="left-column"><span className="total">{totalCount}</span></div>
                                                <div className="right-column">
                                                    {_.map(items.thresholds, (obj, i) => {
                                                        return (
                                                            <div className="right-column">
                                                                {' '+ obj + ' ' + i}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                            <div className="expires">
                                                <div className="left-column">
                                                    Expire date:
                                                </div>
                                                <div className="right-column">{items.expires}</div>
                                            </div>
                                        </div>
                                        : ''}
                                    {items.warnings && items.warnings.length > 0
                                    || items.errors && items.errors.length > 0 ?
                                        <div className="warnings">
                                            {_.map(items.warnings, (warning, key) => {
                                                return (
                                                    <p key={key}>
                                                        <div className="left-column">
                                                            <i className="fa warning" aria-hidden="true"/>
                                                        </div>
                                                        <div className="right-column">
                                                            {warning}
                                                        </div>
                                                    </p>
                                                )
                                            })}
                                            {_.map(items.errors, (error, key) => {
                                                return (
                                                    <p>
                                                        <div className="left-column">
                                                            <i className="fa fa-error" aria-hidden="true"/>
                                                        </div>
                                                        <div className="right-column">
                                                            {error}
                                                        </div>
                                                    </p>
                                                )
                                            })}
                                        </div>
                                        : ''}
                                </div>
                            </div>
                            <TreeUl
                                data={items.authorises}
                                shown={false}
                                level={level + 1}
                                openTreeNode={openTreeNode}
                                drawLinesFromKeys={drawLinesFromKeys}
                                getCanvasContext={getCanvasContext}
                                removeClasses={removeClasses}
                                deselectAll={deselectAll}
                            />
                        </li>
                    );
                })}
            </CSSTransitionGroup>
        );
    }
}