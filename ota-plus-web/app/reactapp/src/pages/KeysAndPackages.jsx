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
    @observable canvasWidth = 0;
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
        this.drawLinesFromKeys =  this.drawLinesFromKeys.bind(this);
        this.selectPackageWithKeys = this.selectPackageWithKeys.bind(this);
        this.resize =  this.resize.bind(this);
        this.resizeCanvas =  this.resizeCanvas.bind(this);
        this.removeSelectedClass = this.removeSelectedClass.bind(this);
        this.scroll =  this.scroll.bind(this);
        this.drawLinesFromAllChilds = this.drawLinesFromAllChilds.bind(this);
        this.handleClickType = this.handleClickType.bind(this);
        this.openTreeNode = this.openTreeNode.bind(this);
    }

    componentDidMount() {
        this.resizeCanvas();
        window.addEventListener("resize", this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }

    resize() {
        this.resizeCanvas();
    }

    scroll() {
       try {
           if (this.selectedDataType === 'package') {
               let element = document.querySelectorAll('li[data-keys].selected');
               element.target = element[0];
               this.selectPackageWithKeys(element)
           } else {
               let element = document.querySelectorAll(`div[title*=${this.lastClickedElementTitle}`);
               element.target = element[0];
               if (this.multipleExpand) {
                   this.drawLinesFromAllChilds(element.target);
               } else {
                   this.drawLinesFromKeys(element);
               }
           }
       } catch (e) {

       }
    }

    resizeCanvas() {
        let windowWidth = window.innerWidth;
        let relativeElWidth = document.getElementById('keys').offsetWidth;
        this.canvasWidth = relativeElWidth;
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
            this.drawLinesFromKeys(element);
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
        const canvas = document.getElementById('tree-canvas');
        const ctx = canvas.getContext('2d');
        if(e.currentTarget && e.currentTarget.parentNode.nextSibling) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.removeSelectedClass();
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

    selectPackageWithKeys(e) {
        this.selectedDataType = 'package';
        this.removeSelectedClass();
        e.target.classList.add('selected');

        const keys = e.target.dataset.keys.split(',');
        const canvas = document.getElementById('tree-canvas');
        const ctx = canvas.getContext('2d');
        const elementCoordinates = e.target.getBoundingClientRect();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();

        keys.forEach(keyTitle => {
            let key = document.querySelectorAll(`div[title*=${keyTitle}`);
            this.showPackageChildren(key);
            const keyCoordinates = key[0].getBoundingClientRect()
            ctx.beginPath();
            ctx.lineCap="round";
            ctx.moveTo(elementCoordinates.right, elementCoordinates.top - 150 + e.target.offsetHeight / 2);

            ctx.lineTo(this.mainLineLength,elementCoordinates.top - 150 + e.target.offsetHeight / 2);
            ctx.lineTo(this.mainLineLength,keyCoordinates.top - 150 + key[0].offsetHeight / 2);
            ctx.lineTo(keyCoordinates.left +key[0].offsetWidth ,keyCoordinates.top - 150 + key[0].offsetHeight / 2);

            ctx.strokeStyle = '#fa9872';
            ctx.stroke();
            ctx.beginPath();
        });

    }

    removeSelectedClass() {
        const packagesArray = document.querySelectorAll('li.selected');
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
            this.drawLinesFromKeys(el ,false, false);
        })
    }

    drawLinesFromKeys(e, clear = true, removeClasses = true) {
        this.selectedDataType = 'key';

        this.showPackageChildren(e);

        if (removeClasses) {
            this.removeSelectedClass();
        }

        if (!e.target) {
            e.target = e;
        }

        if (e.target.title.length > 0) {
            if (!this.multipleExpand) {
                this.lastClickedElementTitle = e.target.title;
            }
            const packagesArray = document.querySelectorAll(`li[data-keys*=${e.target.title}]`);
            const canvas = document.getElementById('tree-canvas');
            const ctx = canvas.getContext('2d');
            const elementCoordinates = e.target.getBoundingClientRect();

            if (clear) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            ctx.beginPath();
            ctx.lineCap="round";

            packagesArray.forEach(packageItem => {

                packageItem.classList.add('selected');

                ctx.beginPath();
                ctx.moveTo(elementCoordinates.left + e.target.offsetWidth, elementCoordinates.top - 150 + e.target.offsetHeight / 2);
                ctx.lineTo(this.mainLineLength,elementCoordinates.top - 150 + e.target.offsetHeight / 2);
                let itemOffset = packageItem.getBoundingClientRect().top - 150 + packageItem.offsetHeight / 2;

                ctx.lineTo(this.mainLineLength, itemOffset);
                ctx.lineTo(this.mainLineLength + this.rightLineLength, itemOffset);
                ctx.strokeStyle = '#fa9872';
                ctx.stroke();
                ctx.beginPath();
            });
        }

    }

    render() {
        return (
            <div className="software-repository" >
                <Header title="Keys and Packages" backButtonShown={true}/>
                <div className="wrapper-full">
                    <div className="container">
                        <div className="row" >
                            <div className="col-xs-5 keys" id="keys">
                                <canvas id="tree-canvas" width={this.canvasWidth} height={this.canvasHeight}/>
                                <div className="wrapper-software" onScroll={this.scroll}>
                                    <TreeUl
                                        data={data}
                                        shown={true}
                                        drawLinesFromKeys={this.handleClickType}
                                        openTreeNode={this.openTreeNode}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-7 packages">
                                <ul className="first-level">
                                    <li>
                                        <span className="title">A</span>
                                        <ul className="second-level">
                                            <li data-keys={['L3','L4','L5']} onClick={this.selectPackageWithKeys}>A 1</li>
                                            <li data-keys={['Birds','L4','L5']} onClick={this.selectPackageWithKeys}>A 2</li>
                                            <li data-keys={['L6','L7','L8']} onClick={this.selectPackageWithKeys}>A 3</li>
                                            <li data-keys={['L3','L4','Birds']} onClick={this.selectPackageWithKeys}>A 4</li>
                                            <li>A 5</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span className="title">B</span>
                                        <ul className="second-level">
                                            <li data-keys={['Animals','Mammals','Elephant']} onClick={this.selectPackageWithKeys}>B 1</li>
                                            <li data-keys={['Plants','Mammals','Elephant']} onClick={this.selectPackageWithKeys}>B 2</li>
                                            <li data-keys={['Mouse','Flowers','Tulip']} onClick={this.selectPackageWithKeys}>B 3</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <span className="title">C</span>
                                        <ul className="second-level">
                                            <li>C 1</li>
                                            <li data-keys={['L1','L21','L22']} onClick={this.selectPackageWithKeys}>C 2</li>
                                            <li data-keys={['Reptiles','Flowers','Tulip']} onClick={this.selectPackageWithKeys}>C 3</li>
                                            <li data-keys={['Birds','Trees']} onClick={this.selectPackageWithKeys}>C 4</li>
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