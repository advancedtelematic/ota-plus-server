import React, { Component, PropTypes, PureComponent } from 'react';
import { observer } from 'mobx-react';
import { observable, toJS } from 'mobx';
import _ from 'underscore';
import { VelocityTransitionGroup } from 'velocity-react';
import {TreeUl, ItemVersions, List} from '../components/softrepo';
import {keys, packages, roles, campaigns} from '../components/softrepo/data.js';

@observer
export default class SoftwareRepository extends Component {
    @observable selectedPackage = null;
    @observable selectedRole = '';
    @observable selectedOwner = '';
    @observable associatedPackages = packages.groups;
    @observable associatedCampaigns = campaigns.groups;

    constructor(props) {
        super(props);
        this.showPackageChildren = this.showPackageChildren.bind(this);
        this.filterPackagesAndCampaigns =  this.filterPackagesAndCampaigns.bind(this);
        this.selectPackage = this.selectPackage.bind(this);
        this.removeSelectedClasses = this.removeSelectedClasses.bind(this);
        this.openTreeNode = this.openTreeNode.bind(this);
        this.showUserInfo = this.showUserInfo.bind(this);
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
        if (this.selectedOwner === e.target) {
            parent.classList.remove('hide');
        } else {
            parent.classList.add('hide');
        }
        alreadySelectedElements.forEach(el => {
            el.classList.remove('selected-user');
        });
        parent.classList.toggle('hide');
        if (parent.classList[1] === 'hide') {
            e.target.classList.remove('selected-user');
        } else {
            e.target.classList.add('selected-user');
        }
        this.selectedOwner = e.target;
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

    selectPackage(itemTitle, e) {
        if (this.selectedPackage !== itemTitle) {
            this.selectedPackage = itemTitle;
        } else {
            this.selectedPackage = '';
        }
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

    filterPackagesAndCampaigns(e) {
        this.selectedRole = e.target.parentNode.title;

        let filteredPackages = {};
        let filteredCampaigns = {};

        _.map(packages.groups, function(obj, key) {
            if (_.some(obj, {role: e.target.parentNode.title})) {
                filteredPackages = {
                    ...filteredPackages,
                    [key]: obj
                }
            }
        });

        _.map(campaigns.groups, function(obj, key) {

            _.map(filteredPackages, (pack) => {
                if (_.some(obj, (item) => _.intersection(item.packages, _.keys(pack)).length > 0)) {
                    filteredCampaigns = {
                        ...filteredCampaigns,
                        [key]: obj
                    }
                }
            });

        });

        this.associatedPackages = filteredPackages;
        this.associatedCampaigns = filteredCampaigns;
    }

    render() {
        const packagesList = Object.keys(this.associatedPackages).map((group, groupKey) => {
            return (
                <li key={Math.floor((Math.random() * 3000) + groupKey)} >
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
                                    className={this.selectedPackage === itemTitle ? 'selected expanded' : ''}
                                    onClick={this.selectPackage.bind(this, itemTitle)}
                                    title={itemTitle}
                                    data-keys={groupItem.keys}
                                    data-role={role}>
                                <span className="item">
                                    {item}
                                </span>
                                    <div className={`user-info ${this.selectedPackage === itemTitle ? '' : 'hide'}`} onClick={e => {e.stopPropagation()}}>
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
                                            this.selectedPackage === itemTitle
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
                                        openTreeNode={this.openTreeNode}
                                        getParentsUntil={this.getParentsUntil}
                                        filterPackagesAndCampaigns={this.filterPackagesAndCampaigns}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-4 packages" id="packages" onScroll={this.scroll}>
                                <div className="section-header">Software</div>
                                <ul className="first-level">
                                    {!_.isEmpty(toJS(this.associatedPackages)) ? packagesList :
                                        <p className="absolute-align">No associated packages</p>
                                    }
                                </ul>
                            </div>
                            <div className="col-xs-4 campaigns" onScroll={this.scroll}>
                                <div className="section-header">Campaigns</div>
                                <ul className="first-level">
                                    <List
                                        data={{groups: this.associatedCampaigns}}
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