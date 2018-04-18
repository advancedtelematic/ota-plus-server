import React, { Component, PropTypes, PureComponent } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { VelocityTransitionGroup } from 'velocity-react';
import {TreeUl, ItemVersions, List} from '../components/softrepo';
import {keys, packages, roles, campaigns} from '../components/softrepo/data.js';

@observer
export default class SoftwareRepository extends Component {
    @observable selectedItemObject = {
        element: '',
    };

    constructor(props) {
        super(props);
        this.showPackageChildren = this.showPackageChildren.bind(this);
        this.drawLines =  this.drawLines.bind(this);
        this.selectPackageWithKeys = this.selectPackageWithKeys.bind(this);
        this.removeSelectedClasses = this.removeSelectedClasses.bind(this);
        this.drawLinesFromAllChilds = this.drawLinesFromAllChilds.bind(this);
        this.handleClickType = this.handleClickType.bind(this);
        this.openTreeNode = this.openTreeNode.bind(this);
        this.drawLineBetweenPackagesAndCampaigns = this.drawLineBetweenPackagesAndCampaigns.bind(this);
        this.drawLineFromCampaign = this.drawLineFromCampaign.bind(this);
        this.showUserInfo = this.showUserInfo.bind(this);
        this.deselectAll = this.deselectAll.bind(this);
    }

    componentDidMount() {
        let treeLevels = document.querySelectorAll('.wrapper-software div[title]+ul');
        let root = document.querySelector('.tree.shown i.fa');
        root.classList.add('fa-angle-down');
        root.classList.remove('fa-angle-right');
        treeLevels.forEach((level, i) => {
            if (i <= 3) {
                const angleIcon = level.querySelector('i.fa.fa-angle-right:first-child');
                if (angleIcon) {
                    if (i === 0) {
                        angleIcon.classList.add('fa-angle-down');
                        angleIcon.classList.remove('fa-angle-right');
                    }
                    level.classList.remove('hidden');
                    level.classList.add('shown');
                }
            }
        });
        let arrowsDown = document.querySelectorAll('.wrapper-software i.fa.fa-angle-down');
        arrowsDown.forEach((arrow,i) => {
            if (i === arrowsDown.length - 1 && arrow.offsetWidth > 0) {
                arrow.classList.add('fa-angle-down');
                arrow.classList.remove('fa-angle-right');
            }
        })
    }

    showUserInfo(e) {
        const alreadySelectedElements = document.querySelectorAll('i.selected-user');
        const parent = e.target.parentNode.parentNode.nextSibling;
        alreadySelectedElements.forEach(el => {
            el.classList.remove('selected-user');
        });
        parent.classList.toggle('hide');
        if (parent.classList[1] === 'hide') {
            e.target.classList.remove('selected-user');
        } else {
            e.target.classList.add('selected-user');
        }
    }

    getParentsUntil (elem, parent, selector) {
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function(s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
        }

        var parents = [];

        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if ( parent ) {
                if ( elem.matches( parent ) ) break;
            }
            if ( selector ) {
                if ( elem.matches( selector ) ) {
                    parents.push( elem );
                }
                break;
            }
            parents.push( elem );
        }
        return parents;
    }

    handleClickType(e) {
        if (!e.target) {
            e.target = e;
        }
        let element = document.querySelectorAll(`div[title=${e.target.parentNode.title}`)[0];

        this.drawLinesFromAllChilds(element);
    }

    showPackageChildren(e) {
        if (e[0] && e[0].parentNode) {
            const ulList = this.getParentsUntil(e[0].parentNode);
            ulList.forEach(ul => {
                this.openTreeNode(e[0].parentNode);
                if (ul.className === 'hidden') {
                    ul.classList.remove('hidden');
                    ul.classList.add('shown');
                }
            }) ;
        }
    }

    openTreeNode(e) {
        if (e.target) {
            e.stopPropagation();
        }

        if(e.target && e.target.parentNode.nextSibling) {
            this.removeSelectedClasses();
            e.target.parentNode.nextSibling.classList.toggle('hidden');
            e.target.parentNode.nextSibling.classList.toggle('shown');
            if (e.target.classList[0] === 'fa') {
                e.target.classList.toggle('fa-angle-down');
                e.target.classList.toggle('fa-angle-right');
            }
        } else {
            const ulList = this.getParentsUntil(e, 'ul.tree');
            ulList.forEach(ul => {
                if (ul.className === 'shown' || ul.className === 'hidden') {
                    ul.parentNode.children[0].children[0].classList.add('fa-angle-down');
                    ul.parentNode.children[0].children[0].classList.remove('fa-angle-right');
                }
            }) ;
        }
    }

    drawLineFromCampaign(e) {

        if (!e.target) {
            e.target = e;
        }
        e.target.classList.add('selected');

        let packages = e.target.parentNode.dataset.packages.split(',');

        packages.forEach(packageTitle => {
            let packageItem = document.querySelector(`li[title*=${packageTitle}`);

            this.selectPackageWithKeys(packageItem, false, false, false, false);

        });
    }

    drawLineBetweenPackagesAndCampaigns(e) {
        if (!e.target) {
            e.target = e;
        }

        const allCampaigns = document.querySelectorAll(`li[data-packages*=${e.target.title}`);

        allCampaigns.forEach(campaign => {
            campaign.classList.add('selected');
        })
    }

    selectPackageWithKeys(e, clear = true, drawLinesToCampaigns = true, removeSelectedClass = true, changeDataType = true) {
        if (!e.target) {
            e.target = e;
        }

        if (changeDataType) {
            if (e.target.parentNode.title) {
                e.target = e.target.parentNode;
            }
            if (e.target.title.length !== 0 && e.target !== this.selectedItemObject.element && e.target.title !== this.selectedItemObject.element.title) {
                this.selectedItemObject = {
                    element: e.target,
                }
            }
        }

        if (removeSelectedClass) {
            this.removeSelectedClasses();
        }

        e.target.classList.add('selected');

        let roles = e.target.dataset.role.split(',');

        if (drawLinesToCampaigns) {
            this.drawLineBetweenPackagesAndCampaigns(e,true);
        }

        roles.forEach(role => {
            let key = [];

            if (e.target.dataset.role) {
                const element = document.querySelectorAll(`div[title*="${role}"`);
                key.push(element[0]);
            }

            key[0].classList.add('selected');
        });
    }

    deselectAll(event) {
        const selectedElements = document.querySelectorAll('div.info');
        const version = document.querySelectorAll('.versions-details');
        const selectedSpans = document.querySelectorAll('span.selected');
        const selectedLis = document.querySelectorAll('li.selected');
        const selectedTreeNodes = document.querySelectorAll('div[title].selected');
        const selectedOwners = document.querySelectorAll('i.selected-user');
        const visibleUserInfo = document.querySelectorAll('.packages div.user-info:not(.hide), .packages div.user-info+div.info:not(.hide)');
        const expandedElements = document.querySelectorAll('.expanded');
        visibleUserInfo.forEach(el => {
            el.classList.toggle('hide');
        });
        selectedOwners.forEach(el => {
            el.classList.toggle('selected-user');
        });
        selectedTreeNodes.forEach(el => {
            el.classList.remove('selected');
        });
        selectedLis.forEach(el => {
            el.classList.toggle('selected');
        });
        selectedSpans.forEach(el => {
            el.classList.toggle('selected');
            el.classList.toggle('expanded');
        });
        version.forEach(el => {
            el.classList.add('hide');
        });
        selectedElements.forEach(el => {
            if (!el.classList[1] && event.target.nextSibling !== el) {
                el.parentNode.classList.remove('selected');
                el.classList.toggle('hide');
                event.target.classList.remove('hide');
            }
        });
        expandedElements.forEach(el => {
            el.classList.remove('expanded');
        })
    }

    removeSelectedClasses(section = 'all') {
        let packagesArray = [];
        if (section === 'all') {
            packagesArray = document.querySelectorAll(`li.selected`);
        } else {
            packagesArray = document.querySelectorAll(`.${section} span.selected`);
        }
        packagesArray.forEach(packageItem => {
            packageItem.classList.remove('selected');
        });
    }

    drawLinesFromAllChilds(e) {
        let allChilds = e.parentNode.querySelectorAll('div[title]');

        allChilds.forEach(el => {
            el.classList.add('selected');
            this.showPackageChildren([el]);
            this.drawLines(el ,false, false, 'key', false);
        })
    }

    drawLines(e, clear = true, removeClasses = true) {
        if (!e.target) {
            e.target = e;
        }

        this.showPackageChildren(e);

        if (removeClasses) {
            this.removeSelectedClasses();
        }

        if (e.target.title.length > 0) {

            const associatedPackages = document.querySelectorAll(`li[data-role*="${e.target.title}"]`);

            associatedPackages.forEach(element => {
                this.drawLineBetweenPackagesAndCampaigns(element, false);
                element.classList.add('selected');
            });
        }

    }

    render() {
        const packagesList = Object.keys(packages.groups).map((group, groupKey) => {
            return (
                <li key={Math.floor((Math.random() * 300) + groupKey)}>
                    <span className="title">{group}</span>
                    <ul className="second-level">
                        {Object.keys(packages.groups[group]).map((item, itemKey) => {
                            const groupItem = packages.groups[group][item];
                            const itemTitle = item.replace(/[&\/\\#,+()$~%_.'":*?<>{}]/g, '');
                            const role = groupItem.role.replace(/[&\/\\#,+()$~%_.' ":*?<>{}]/g, '');
                            let person = null;
                            return (
                                <li
                                    key={Math.floor((Math.random() * 10000) + itemKey)}
                                    className={this.selectedItemObject.element.title === itemTitle ? 'selected expanded' : ''}
                                    onClick={(e) => {
                                        this.deselectAll(e);
                                        if (this.selectedItemObject.element && this.selectedItemObject.element.title === itemTitle) {
                                            this.selectedItemObject.element = '';
                                            this.resetContext(e);
                                        } else {
                                            this.selectPackageWithKeys(e);
                                        }
                                    }}
                                    title={itemTitle}
                                    data-keys={groupItem.keys}
                                    data-role={role}>
                                    <span className="item">
                                        {item}
                                    </span>
                                    <div className={`user-info ${this.selectedItemObject.element.title === itemTitle ? '' : 'hide'}`} onClick={e => {e.stopPropagation()}}>
                                        <div className="owners">
                                            {_.map(groupItem.keys, (key, i) => {
                                                person = keys.keys[key].owner;
                                                return <i title={key} key={i} className="fa fa-owner" aria-hidden="true" onClick={this.showUserInfo.bind(this)}/>
                                            })}
                                        </div>
                                    </div>
                                    <div className="info hide row" onClick={e => {e.stopPropagation()}}>
                                        <div className="col-md-2">
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
                                        <div className="col-md-5">
                                            <ul>
                                                <li>{person.name}</li>
                                                <li>{person.position}</li>
                                                <li>{person.company}</li>
                                                <li>{person.location}</li>
                                                <li>{person.email}</li>
                                                <li>{person.phone}</li>
                                                <li>{person.group}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
                                        {
                                            this.selectedItemObject.element.title === itemTitle
                                            ?
                                            <ItemVersions groupItem={groupItem} />
                                            : null
                                        }
                                    </VelocityTransitionGroup>
                                </li>
                            )
                        })}
                    </ul>
                </li>
            )
        });
        return (
            <div className="software-repository" >
                <div className="wrapper-full">
                    <div className="container">
                        <div className="row" >
                            <div className="keys" id="keys">
                                <div className="background-wrapper"/>
                                <div className="section-header">Roles</div>
                                <div className="wrapper-software" onScroll={this.scroll}>
                                    <TreeUl
                                        data={roles}
                                        shown={true}
                                        drawLinesFromKeys={this.handleClickType}
                                        openTreeNode={this.openTreeNode}
                                        getCanvasContext={this._getCanvasContext}
                                        removeClasses={this.removeSelectedClasses}
                                        deselectAll={this.deselectAll}
                                        getParentsUntil={this.getParentsUntil}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-4 packages" id="packages" onScroll={this.scroll}>
                                <div className="section-header">Software</div>
                                <ul className="first-level">
                                    {packagesList}
                                </ul>
                            </div>
                            <div className="col-xs-4 campaigns" onScroll={this.scroll}>
                                <div className="section-header">Campaigns</div>
                                <ul className="first-level">
                                    <List
                                        data={campaigns}
                                        clickHandler={this.drawLineFromCampaign}
                                        dataType="campaigns"
                                        removeClasses={this.removeSelectedClasses}
                                        getCanvasContext={this._getCanvasContext}
                                        deselectAll={this.deselectAll}
                                    />
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}