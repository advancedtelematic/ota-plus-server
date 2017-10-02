import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import ListItem from './ListItem';
import moment from 'moment';

const currentTime = moment();
const realCurrentTime = moment().format("DD.MM.YYYY hh:mm");

@observer
class List extends Component {
    @observable tmpIntervalId = null;
    @observable data = [];
    @observable keys = [];

    constructor(props) {
        super(props);
        this.addItem = this.addItem.bind(this);
        this.getRandomInt = this.getRandomInt.bind(this);
        setInterval(() => { this.addItem() }, 1000);
    }
    componentWillMount() {
        _.each(this.props.data, (item, logCode) => {
            item.code = logCode;
            item.time = currentTime.subtract(1, 'minutes').format("DD.MM.YYYY hh:mm");
            this.data.push(item);
        });
        this.keys = _.uniq(Object.keys(this.props.data));
    }
    componentWillUnmount() {
        clearInterval(this.tmpIntervalId);
    }
    addItem() {
        let randomInt = this.getRandomInt(0, this.keys.length + 1);
        if(randomInt !== this.keys.length) {
            let randomKey = this.keys[randomInt];
            let randomObject = this.props.data[randomKey];
            randomObject.time = realCurrentTime;
            this.data.unshift(randomObject);
        }
    }
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
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