import React, { Component, PropTypes, PureComponent } from 'react';
import Header from '../partials/Header';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import CSSTransitionGroup from 'react-addons-css-transition-group';

const data = {
    animals: {
        children: {
            birds: {},
            mammals: {
                children: {
                    elephant: {},
                    mouse: {}
                }
            },
            reptiles: {}
        },
    },
    plants: {
        children: {
            flowers: {
                children: {
                    rose: {},
                    tulip: {
                        children: {
                            l1: {},
                            l2: {
                                children: {
                                    l21: {},
                                    l22: {},
                                    l23: {},
                                }
                            },
                            l3: {},
                            l4: {},
                            l5: {
                                children: {
                                    l51: {},
                                    l52: {
                                        children: {
                                            l521: {},
                                            l522: {},
                                            l523: {},
                                            l524: {},
                                        }
                                    },
                                }
                            },
                            l6: {},
                            l7: {},
                            l8: {},
                        }
                    }
                }
            },
            trees: {}
        }
    },
    girls: {
        children: {
            one: {
                children: {
                    sexy: {}
                }
            },
            two: {
                children: {
                    silly: {}
                }
            },
            three: {
                children: {
                    mad: {}
                }
            }
        },
    },
    boys: {
        children: {
            amazing: {},
        },
    },
    cars: {
        children: {
            audi: {},
            bmw: {},
            mercedes: {},
            honda: {},
            porsche: {},
        },
    },
    emotions: {
        children: {
            zaebis: {
                children: {
                    good: {
                        children: {
                            verygood: {
                                children: {
                                    pleasurable: {}
                                }
                            }
                        }
                    }
                }
            },
            all: {},
            ot: {},
            them: {},
        },
    },
    dogs: {
        children: {
            dog: {}
        }
    },
    cats: {},
    hen: {},
    hencock: {}
}

@observer
export default class KeysAndPackages extends Component {
    @observable history = [];
    @observable treeCanvasWidth = 0;
    @observable packagesCanvasWidth = 0;
    @observable canvasHeight = 974;
    @observable mainLineLength = 0;
    @observable rightLineLength = 35;
    @observable lastClickedElementTitle = '';
    @observable selectedDataType = '';
    @observable clickNumber = 0;
    @observable clickCountObj = {};
    @observable multipleExpand = false;

    constructor(props) {
        super(props);
        this.showPackageChildren = this.showPackageChildren.bind(this);
        this.drawLines =  this.drawLines.bind(this);
        this.selectPackageWithKeys = this.selectPackageWithKeys.bind(this);
        this.resize =  this.resize.bind(this);
        this.resizeCanvas =  this.resizeCanvas.bind(this);
        this.removeSelectedClasses = this.removeSelectedClasses.bind(this);
        this.scroll =  this.scroll.bind(this);
        this.drawLinesFromAllChilds = this.drawLinesFromAllChilds.bind(this);
        this.handleClickType = this.handleClickType.bind(this);
        this.openTreeNode = this.openTreeNode.bind(this);
        this.drawLineBetweenPackagesAndCampaigns = this.drawLineBetweenPackagesAndCampaigns.bind(this);
        this.drawLineFromCampaign = this.drawLineFromCampaign.bind(this);
    }

    componentDidMount() {
        this.resizeCanvas();
        window.addEventListener("resize", this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }

    _getCanvasContext(id = 'tree-canvas') {
        const canvas = document.getElementById(id);
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#fa9872';
        ctx.lineCap="round";
        return {
            ctx,
            canvas
        }
    }

    resize() {
        this.resizeCanvas();
        this.scroll();
    }

    scroll() {
        try {
            const { ctx, canvas } = this._getCanvasContext('packages-canvas');
            if (this.selectedDataType === 'package') {
                let element = document.querySelectorAll('li[data-keys].selected');
                element.target = element[0];
                this.selectPackageWithKeys(element)
            } else if (this.selectedDataType === 'campaign') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                this.drawLineFromCampaign(this.lastClickedElementTitle);
            } else {
                let element = document.querySelectorAll(`div[title*=${this.lastClickedElementTitle}`);
                element.target = element[0];
                if (this.multipleExpand) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    this.drawLinesFromAllChilds(element.target);
                } else {
                    this.drawLines(element);
                }
            }
        } catch (e) {
        }
    }

    resizeCanvas() {
        let windowWidth = window.innerWidth;
        let relativeElWidth = document.getElementById('keys').offsetWidth;
        let packagesElWidth = document.getElementById('packages').offsetWidth;
        this.treeCanvasWidth = relativeElWidth;
        this.packagesCanvasWidth = window.innerWidth - relativeElWidth;
        this.mainLineLength = relativeElWidth - this.rightLineLength;
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
        let element = document.querySelectorAll(`div[title=${e.target.title}`)[0];
        this.clickNumber++;
        this.clickCountObj = {
            ...this.clickCountObj,
            [this.clickNumber]: {
                element
            }
        };

        if (this.clickCountObj['2'] && this.clickCountObj['1'].element.title === this.clickCountObj['2'].element.title ) {
            this.selectedDataType = 'key';
            this.multipleExpand = true;
            this.clickNumber = 0;
            this.clickCountObj = {};
            this.drawLinesFromAllChilds(element);
        } else {
            if (this.clickCountObj['2']) {
                this.clickNumber = 0;
                this.clickCountObj = {};
            }
            this.multipleExpand = false;
            this.drawLines(element);
            this.showPackageChildren(element);
        }
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
        if(e.currentTarget && e.currentTarget.parentNode.nextSibling) {
            const { ctx, canvas } = this._getCanvasContext();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.removeSelectedClasses();
            e.stopPropagation();
            e.currentTarget.parentNode.nextSibling.classList.toggle('hidden');
            e.currentTarget.parentNode.nextSibling.classList.toggle('shown');
            e.currentTarget.classList.toggle('fa-angle-down');
            e.currentTarget.classList.toggle('fa-angle-right');
        } else {
            const ulList = this.getParentsUntil(e[0], 'ul.tree');
            ulList.forEach(ul => {
                if (ul.className === 'shown') {
                    ul.parentNode.children[0].children[0].classList.add('fa-angle-down');
                    ul.parentNode.children[0].children[0].classList.remove('fa-angle-right');
                }
            }) ;
        }
    }

    drawLineFromCampaign(e, clear = false) {
        this.removeSelectedClasses('campaigns');
        this.lastClickedElementTitle = e.target || e;
        this.selectedDataType = 'campaign';

        if (!e.target) {
            e.target = e;
        }
        e.target.classList.add('selected');

        const { ctx, canvas } = this._getCanvasContext('packages-canvas');
        const elementCoordinates = e.target.getBoundingClientRect();
        let packages = e.target.dataset.packages.split(',');

        if (clear) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        const treeCanvas = this._getCanvasContext('tree-canvas');
        treeCanvas.ctx.clearRect(0, 0, treeCanvas.canvas.width, treeCanvas.canvas.height)

        this.removeSelectedClasses('packages');

        packages.forEach(packageTitle => {
            let packageItem = document.querySelector(`li[title*=${packageTitle}`);
            let packageCoordinates = packageItem.getBoundingClientRect();

            this.selectPackageWithKeys(packageItem, false, false, false, false);

            ctx.beginPath();
            ctx.moveTo(window.innerWidth - e.target.offsetWidth, elementCoordinates.top - 150 + e.target.offsetHeight / 2);

            let x = window.innerWidth - this.treeCanvasWidth - e.target.offsetWidth;

            if (elementCoordinates.top === packageCoordinates.top) {
                ctx.lineTo(x - 200,elementCoordinates.top - 150 + e.target.offsetHeight / 2);
            } else {
                ctx.lineTo(x - 50,elementCoordinates.top - 150 + e.target.offsetHeight / 2);
                ctx.lineTo(x - 50,packageCoordinates.top - 150 + packageItem.offsetHeight / 2);
                ctx.lineTo(x - 150,packageCoordinates.top - 150 + packageItem.offsetHeight / 2);
            }

            ctx.stroke();
        });
    }

    drawLineBetweenPackagesAndCampaigns(e, clear = true ) {
        if (!e.target) {
            e.target = e;
        }
        const { ctx, canvas } = this._getCanvasContext('packages-canvas');

        if (clear) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        const allCampaigns = document.querySelectorAll(`li[data-packages*=${e.target.title}`);
        const elementCoordinates = e.target.getBoundingClientRect();

        allCampaigns.forEach(campaign => {
            campaign.classList.add('selected');
            const campaignCoordinates = campaign.getBoundingClientRect();
            ctx.beginPath();

            ctx.moveTo(elementCoordinates.left - this.treeCanvasWidth + e.target.offsetWidth, elementCoordinates.top - 150 + e.target.offsetHeight / 2)

            if (elementCoordinates.top === campaignCoordinates.top) {
                ctx.lineTo(elementCoordinates.left - this.treeCanvasWidth + e.target.offsetWidth + 200,elementCoordinates.top - 150 + e.target.offsetHeight / 2);
            } else {
                let x = elementCoordinates.left - this.treeCanvasWidth + e.target.offsetWidth + 50;
                ctx.lineTo(x, elementCoordinates.top - 150 + e.target.offsetHeight / 2);
                ctx.lineTo(x, campaignCoordinates.top - 150 + campaign.offsetHeight / 2)
                ctx.lineTo(x + 150, campaignCoordinates.top - 150 + campaign.offsetHeight / 2)
            }
            ctx.stroke();
        })
    }

    selectPackageWithKeys(e, clear = true, drawLinesToCampaigns = true, removeSelectedClass = true, changeDataType = true) {
        if (!e.target) {
            e.target = e;
        }

        if (changeDataType) {
            this.selectedDataType = 'package';
        }

        if (removeSelectedClass) {
            this.removeSelectedClasses();
        }

        e.target.classList.add('selected');
        const { ctx, canvas } = this._getCanvasContext();
        const elementCoordinates = e.target.getBoundingClientRect();

        let keys = e.target.dataset.keys.split(',');

        if (drawLinesToCampaigns) {
            this.drawLineBetweenPackagesAndCampaigns(e,true);
        }

        if (clear) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        keys.forEach(keyTitle => {
            let key = null;

            if (e.target.dataset.keys) {
                key = document.querySelectorAll(`div[title*=${keyTitle}`);
            } else {
                key = document.querySelectorAll(`li[title*=${keyTitle}`);
            }

            this.showPackageChildren(key);
            const keyCoordinates = key[0].getBoundingClientRect()
            ctx.beginPath();
            ctx.moveTo(elementCoordinates.right, elementCoordinates.top - 150 + e.target.offsetHeight / 2);

            ctx.lineTo(this.mainLineLength,elementCoordinates.top - 150 + e.target.offsetHeight / 2);
            ctx.lineTo(this.mainLineLength,keyCoordinates.top - 150 + key[0].offsetHeight / 2);
            ctx.lineTo(keyCoordinates.left + key[0].offsetWidth ,keyCoordinates.top - 150 + key[0].offsetHeight / 2);

            ctx.stroke();
            ctx.beginPath();
        });
    }

    removeSelectedClasses(section = 'all') {
        let packagesArray = [];
        if (section === 'all') {
            packagesArray = document.querySelectorAll(`li.selected`);
        } else {
            packagesArray = document.querySelectorAll(`.${section} li.selected`);
        }
        packagesArray.forEach(packageItem => {
            packageItem.classList.remove('selected');
        });
    }

    drawLinesFromAllChilds(e) {
        let allChilds = e.target.parentNode.querySelectorAll('div[title]');
        this.lastClickedElementTitle = e.target.title;

        if (this.multipleExpand) {
            const canvas = document.getElementById('tree-canvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        allChilds.forEach(el => {
            el.classList.add('selected');
            this.showPackageChildren([el]);
            this.drawLines(el ,false, false, 'key', false);
        })
    }

    drawLines(e, clear = true, removeClasses = true, selectedDataType = 'key', clearPackagesCanvas = true) {
        if (!e.target) {
            e.target = e;
        }

        this.selectedDataType = selectedDataType;

        let elementsArray = [];
        const { ctx, canvas } = this._getCanvasContext();
        const elementCoordinates = e.target.getBoundingClientRect();
        this.showPackageChildren(e);

        if (removeClasses) {
            this.removeSelectedClasses();
        }

        if (e.target.title.length > 0) {

            if (!this.multipleExpand) {
                this.lastClickedElementTitle = e.target.title;
            }

            elementsArray = document.querySelectorAll(`li[data-keys*=${e.target.title}]`);

            if (clear) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            if (clearPackagesCanvas) {
                const packages = this._getCanvasContext('packages-canvas');
                packages.ctx.clearRect(0, 0, packages.canvas.width, packages.canvas.height)
            }

            elementsArray.forEach(element => {
                this.drawLineBetweenPackagesAndCampaigns(element, false);
                element.classList.add('selected');

                ctx.beginPath();

                ctx.moveTo(elementCoordinates.left + e.target.offsetWidth, elementCoordinates.top - 150 + e.target.offsetHeight / 2);
                ctx.lineTo(this.mainLineLength,elementCoordinates.top - 150 + e.target.offsetHeight / 2);
                let itemOffset = element.getBoundingClientRect().top - 150 + element.offsetHeight / 2;

                ctx.lineTo(this.mainLineLength, itemOffset);
                ctx.lineTo(this.mainLineLength + this.rightLineLength, itemOffset);
                ctx.stroke();
                ctx.beginPath();
            });
        }

    }

    render() {
        return (
            <div className="software-repository" >
                <Header title="Software repository" backButtonShown={true}/>
                <div className="wrapper-full">
                    <div className="container">
                        <div className="row" >
                            <div className="col-xs-3 keys" id="keys">
                                <div className="section-header">Metadata</div>
                                <canvas id="tree-canvas" width={this.treeCanvasWidth} height={this.canvasHeight}/>
                                <div className="wrapper-software" onScroll={this.scroll}>
                                    <TreeUl
                                        data={data}
                                        shown={true}
                                        drawLinesFromKeys={this.handleClickType}
                                        openTreeNode={this.openTreeNode}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-6 packages" id="packages" onScroll={this.scroll}>
                                <div className="section-header">Software</div>
                                <canvas id="packages-canvas" width={this.packagesCanvasWidth} height={this.canvasHeight}/>
                                <ul className="first-level">
                                    <li>
                                        <span className="title">A</span>
                                        <ul className="second-level">
                                            <li title="A1" data-keys={['L3','L4','L5']} onClick={this.selectPackageWithKeys}>A 1</li>
                                            <li title="A2" data-keys={['Birds','L4','L5']} onClick={this.selectPackageWithKeys}>A 2</li>
                                            <li title="A3" data-keys={['L6','L7','L8']} onClick={this.selectPackageWithKeys}>A 3</li>
                                            <li title="A4" data-keys={['L3','L4','Birds']} onClick={this.selectPackageWithKeys}>A 4</li>
                                            <li>A 5</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span className="title">B</span>
                                        <ul className="second-level">
                                            <li title="B1" data-keys={['Animals','Mammals','Elephant']} onClick={this.selectPackageWithKeys}>B 1</li>
                                            <li title="B2" data-keys={['Plants','Mammals','Elephant']} onClick={this.selectPackageWithKeys}>B 2</li>
                                            <li title="B3" data-keys={['Mouse','Flowers','Tulip']} onClick={this.selectPackageWithKeys}>B 3</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span className="title">C</span>
                                        <ul className="second-level">
                                            <li title="C1" data-keys={['Birds','Plants']} onClick={this.selectPackageWithKeys}>C 1</li>
                                            <li title="C2" data-keys={['L1','L21','L22']} onClick={this.selectPackageWithKeys}>C 2</li>
                                            <li title="C3" data-keys={['Reptiles','Flowers','Tulip']} onClick={this.selectPackageWithKeys}>C 3</li>
                                            <li title="C4" data-keys={['Birds','Trees']} onClick={this.selectPackageWithKeys}>C 4</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-xs-3 campaigns" onScroll={this.scroll}>
                                <div className="section-header">Campaigns</div>
                                <ul className="first-level">
                                    <li>
                                        <span className="title">Finished</span>
                                        <ul className="second-level">
                                            <li data-packages={['A1','A4']} onClick={this.drawLineFromCampaign}>Finished Campaign 1</li>
                                            <li data-packages={['A2','A3']} onClick={this.drawLineFromCampaign}>Finished Campaign 2</li>
                                            <li data-packages={['B1','C1']} onClick={this.drawLineFromCampaign}>Finished Campaign 3</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span className="title">In preparation</span>
                                        <ul className="second-level">
                                            <li data-packages={['C1']} onClick={this.drawLineFromCampaign}>In preparation 1</li>
                                            <li data-packages={['C2','C3']} onClick={this.drawLineFromCampaign}>In preparation 2</li>
                                            <li data-packages={['B3']} onClick={this.drawLineFromCampaign}>In preparation 3</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span className="title">Running </span>
                                        <ul className="second-level">
                                            <li data-packages={['B1','A5','A4']} onClick={this.drawLineFromCampaign}>Running 1</li>
                                            <li data-packages={['B2']} onClick={this.drawLineFromCampaign}>Running 2</li>
                                            <li data-packages={['A3']} onClick={this.drawLineFromCampaign}>Running3</li>
                                            <li data-packages={['A3']} onClick={this.drawLineFromCampaign}>Running4</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

@observer
class TreeUl extends PureComponent {
    @observable tmpIntervalId = null;
    constructor(props) {
        super(props);
    }
    render() {
        const { data, shown, drawLinesFromKeys, openTreeNode } = this.props;
        return (
            <CSSTransitionGroup
                transitionName="slide"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
                component={"ul"}
                className={this.props.shown ? "tree shown" : "hidden"}
            >
                {_.map(data, (items, key) => {
                    return (
                        <li key={key}>
                            <div title={key.charAt(0).toUpperCase() + key.slice(1)} onClick={drawLinesFromKeys}>
                                {Object.keys(items).length
                                    ? <i className="fa fa-angle-right" aria-hidden="true" onClick={openTreeNode}/>
                                    : null}
                                {key}
                            </div>
                            <TreeUl
                                data={items.children}
                                shown={false}
                                openTreeNode={openTreeNode}
                                drawLinesFromKeys={drawLinesFromKeys}
                            />
                        </li>
                    );
                })}
            </CSSTransitionGroup>
        );
    }
}