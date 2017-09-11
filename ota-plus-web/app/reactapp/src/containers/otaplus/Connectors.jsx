import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { ConnectorsLeftList } from '../../components/connectors';
import { ConnectorsRightList } from '../../components/connectors';
import { ConnectorsCenter } from '../../components/connectors';

const circleRadius = 20;
const circleOffset = 50;

@observer
class Connectors extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        var canvasOne = document.getElementById('item-canvas-one');
        var canvasTwo = document.getElementById('item-canvas-two');
        var canvasThree = document.getElementById('item-canvas-three');
        var canvasFour = document.getElementById('item-canvas-four');
        var canvasFive = document.getElementById('item-canvas-five');
        var canvasSix = document.getElementById('item-canvas-six');
        var canvasCenter = document.getElementById('item-canvas-center');

        let height = canvasOne.height;
        let width = canvasOne.width;

        let centerCanvasWidth = canvasCenter.offsetWidth;
        let centerCanvasHeight = canvasCenter.offsetHeight;

        var contextOne = canvasOne.getContext('2d');
        var contextTwo = canvasTwo.getContext('2d');
        var contextThree = canvasThree.getContext('2d');
        var contextFour = canvasFour.getContext('2d');
        var contextFive = canvasFive.getContext('2d');
        var contextSix = canvasSix.getContext('2d');
        var contextCenter = canvasCenter.getContext('2d');

        var leftCircle = {
        	x: width - circleOffset,
        	y: height / 2,
        	radius: circleRadius,
        	sAngle: -0.5 * Math.PI,
        	eAngle: -1.5 * Math.PI
        };

        var rightCircle = {
        	x: circleOffset,
        	y: height / 2,
        	radius: circleRadius,
        	sAngle: 0.5 * Math.PI,
        	eAngle: 1.5 * Math.PI
        };

        var leftLine = {
        	x: width,
        	y: height / 2,
        	moveToX: width - circleOffset + circleRadius,
        	moveToY: height / 2,
        };

        var rightLine = {
        	x: 0,
        	y: height / 2,
        	moveToX: circleOffset - circleRadius,
        	moveToY: height / 2,
        };

        let leftItems = document.querySelectorAll('.left-box .item');
        let rightItems = document.querySelectorAll('.right-box .item');
        let leftItemCenters = [];
        let rightItemCenters = [];

        _.each(leftItems, (item, index) => {
        	let height = item.offsetHeight;
        	let topOffset = item.offsetTop;
        	let leftOffset = item.offsetLeft;
        	leftItemCenters.push({
        		top: topOffset + height / 2,
    		});
        });

        _.each(rightItems, (item, index) => {
        	let height = item.offsetHeight;
        	let topOffset = item.offsetTop;
        	rightItemCenters.push({
        		top: topOffset + height / 2,
        	});
        });

        this.drawCircle(leftCircle, contextOne);
        this.drawLine(leftLine, contextOne);
        this.drawCircle(leftCircle, contextTwo);
        this.drawLine(leftLine, contextTwo);
        this.drawCircle(leftCircle, contextThree);
        this.drawLine(leftLine, contextThree);
        this.drawCircle(rightCircle, contextFour);
        this.drawLine(rightLine, contextFour);
        this.drawCircle(rightCircle, contextFive);
        this.drawLine(rightLine, contextFive);
        this.drawCircle(rightCircle, contextSix);
        this.drawLine(rightLine, contextSix);

        _.each(leftItemCenters, (center, index) => {
        	let connectLine = {
        		x: 0,
        		y: center.top,
        		moveToX: centerCanvasWidth / 2,
        		moveToY: centerCanvasHeight / 2
        	};
        	this.drawConnectLine(connectLine, contextCenter);
        });

        _.each(rightItemCenters, (center, index) => {
        	let connectLine = {
        		x: centerCanvasWidth,
        		y: center.top,
        		moveToX: centerCanvasWidth / 2,
        		moveToY: centerCanvasHeight / 2
        	};
        	this.drawConnectLine(connectLine, contextCenter);
        });

    }
    drawCircle(circle, context) {
    	context.beginPath();
    	context.arc(circle.x, circle.y, circle.radius, circle.sAngle, circle.eAngle);
    	context.closePath();
        context.stroke();
    }
    drawLine(line, context) {
    	context.beginPath();
		context.moveTo(line.x, line.y);
		context.lineTo(line.moveToX, line.moveToY);
		context.stroke();
    }
    drawConnectLine(line, context) {
    	context.beginPath();
		context.moveTo(line.x, line.y);
		context.lineTo(line.moveToX, line.moveToY);
		context.stroke();
    }
    render() {
        return (
        	<div className="connectors">
	            <div className="container">
	            	<div className="row">
	            		<div className="col-xs-4">
	            			<ConnectorsLeftList />
	            		</div>
	            		<div className="col-xs-4">
	            			<ConnectorsCenter />
	            		</div>
	            		<div className="col-xs-4">
		            		<ConnectorsRightList />
	            		</div>
	            	</div>
	            </div>
            </div>
        );
    }
}

export default Connectors;