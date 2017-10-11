import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import ListItem from './ListItem';
import moment from 'moment';

@observer
class List extends Component {
    @observable tmpIntervalId = null;
    @observable data = [];
    @observable keys = [];

    constructor(props) {
        super(props);
        this.addItem = this.addItem.bind(this);
        this.getRandomInt = this.getRandomInt.bind(this);
        this.getRandomMiliseconds = this.getRandomMiliseconds.bind(this);
        this.playAnimation = this.playAnimation.bind(this);
        this.stopAnimation = this.stopAnimation.bind(this);
        this.mixLogs = this.mixLogs.bind(this);
        this.shuffleArray = this.shuffleArray.bind(this);
        this.playAnimation();
    }
    componentWillMount() {
        let index = 0;
        _.each(this.props.data, (item, logCode) => {
            if(index < 25) {
                item.code = logCode;
                item.time = moment().subtract(1, 'minutes').format("DD.MM.YYYY hh:mm:ss")  + ':' + this.getRandomMiliseconds();
                this.data.push(item);
                index++;
            }
        });
        this.keys = _.uniq(Object.keys(this.props.data));
    }
    componentWillUnmount() {
        this.stopAnimation();
    }
    playAnimation() {
        this.tmpIntervalId = setInterval(() => { this.addItem() }, 1000);
    }
    stopAnimation() {
        clearInterval(this.tmpIntervalId);
    }
    addItem() {
        let randomInt = this.getRandomInt(0, this.keys.length + 1);
        if(randomInt % 2) {
            let randomKey = this.keys[randomInt];
            let randomObject = this.props.data[randomKey];
            randomObject.time = moment().format("DD.MM.YYYY hh:mm:ss") + ':' + this.getRandomMiliseconds();
            randomObject.code = this.keys[randomInt];
            this.data.unshift(randomObject);
        }
    }
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    getRandomMiliseconds(min = 100, max = 999) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    mixLogs() {
        let shuffledData = this.shuffleArray(this.data);
        _.each(shuffledData, (item, index) => {
            item.time = moment().format("DD.MM.YYYY hh:mm:ss") + ':' + this.getRandomMiliseconds();;
        });
        this.data = shuffledData;
    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.animationIsPlaying) {
            this.playAnimation();
            this.mixLogs();
        } else {
            this.stopAnimation();
        }
    }
    render() {
		return (
            <div className="items-list">
                {_.map(this.data, (item, index) => {
                    return (
                        <ListItem 
                            key={index}
                            item={item}
                        />
                    );
                })}
            </div>
        );
    }
}

export default List;