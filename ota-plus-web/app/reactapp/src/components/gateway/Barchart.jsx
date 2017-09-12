import React, { Component, PropTypes } from 'react';
import { TimeSeries, Index } from "pondjs";
import { ChartContainer, ChartRow, Charts, YAxis, BarChart, styler } from "react-timeseries-charts";
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import moment from 'moment';
import _ from 'underscore';

const currentDate = moment().format("Y-M-D");
const currentHour = moment().hour();
const currentMinutes = moment().minutes();
const currentHourFormatted = currentHour + ':00';
const devices = [1, 2, 0, 0, 3, 4, 5, 6, 5, 4, 3, 2, 1, 1, 2, 4, 4, 5, 2, 5, 5, 3, 2, 4];
const data = [
    [currentDate + " 00:00"],
    [currentDate + " 01:00"],
    [currentDate + " 02:00"],
    [currentDate + " 03:00"],
    [currentDate + " 04:00"],
    [currentDate + " 05:00"],
    [currentDate + " 06:00"],
    [currentDate + " 07:00"],
    [currentDate + " 08:00"],
    [currentDate + " 09:00"],
    [currentDate + " 10:00"],
    [currentDate + " 11:00"],
    [currentDate + " 12:00"],
    [currentDate + " 13:00"],
    [currentDate + " 14:00"],
    [currentDate + " 15:00"],
    [currentDate + " 16:00"],
    [currentDate + " 17:00"],
    [currentDate + " 18:00"],
    [currentDate + " 19:00"],
    [currentDate + " 20:00"],
    [currentDate + " 21:00"],
    [currentDate + " 22:00"],
    [currentDate + " 23:00"],
];

@observer
class Barchart extends Component {
    @observable data = [];
    @observable series = [];

    constructor(props) {
        super(props);
        this.resize = this.resize.bind(this);
        this.getRectItemValues = this.getRectItemValues.bind(this);
        this.createRectWrapper = this.createRectWrapper.bind(this);
    }
    componentWillMount() {
        _.each(data, (items, index) => {
            items.push(devices[index]);
        });
        this.data = data;
        this.series = new TimeSeries({
            name: "hilo_rainfall",
            columns: ["index", "precip"],
            points: this.data.map(([d, value]) => [Index.getIndexString("1h", new Date(d)), value])
        });
    }
    componentDidMount() {
        let values = this.getRectItemValues();
        let that = this;
        setTimeout(function() {
            that.createRectWrapper(values)
        }, 500);
        window.addEventListener("resize", this.resize);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }
    getRectItemValues() {
        let rects = document.getElementsByTagName('rect');
        rects = _.omit(rects, [0, 1]);
        let rectToHighlight = rects[currentHour + 2].getBoundingClientRect();
        return {
            leftPos: rectToHighlight.left,
            topPos: rectToHighlight.top,
            width: rectToHighlight.width,
            height: rectToHighlight.height,
            beforeRects: _.first(rects, currentHour + 2)
        }
    }
    createRectWrapper(values) {
        let div = document.createElement('div');
        div.style.width = values.width + 'px';
        div.style.height = values.height + 'px';
        div.style.background = "grey";
        div.style.position = "absolute";
        div.style.left = values.leftPos + 'px';
        div.style.top = values.topPos + 'px';
        div.id = "rect-wrapper";
        document.body.appendChild(div);

        let minutesPercentage = currentMinutes / 60 * 100;
        let percentageDiv = document.createElement('div');
        percentageDiv.style.width = values.width + 'px';
        percentageDiv.style.height = minutesPercentage * values.height / 100 + 'px';
        percentageDiv.style.background = "orange";
        percentageDiv.style.position = "absolute";
        percentageDiv.style.bottom = "0";
        percentageDiv.id = "rect-inner";
        div.appendChild(percentageDiv);

        _.each(values.beforeRects, (rect, index) => {
            if(!_.isUndefined(rect)) {
                let rectItem = rect.getBoundingClientRect();
                let div = document.createElement('div');
                div.style.width = rectItem.width + 'px';
                div.style.height = rectItem.height + 'px';
                div.style.background = "orange";
                div.style.position = "absolute";
                div.style.left = rectItem.left + 'px';
                div.style.top = rectItem.top + 'px';
                div.id = "rect-wrapper-" + index;
                document.body.appendChild(div);
            }
        });
    }
    resize() {
        let values = this.getRectItemValues();
        let div = document.getElementById('rect-wrapper');
        div.style.width = values.width + 'px';
        div.style.height = values.height + 'px';
        div.style.left = values.leftPos + 'px';
        div.style.top = values.topPos + 'px';

        _.each(values.beforeRects, (rect, index) => {
            if(!_.isUndefined(rect)) {
                let div = document.getElementById('rect-wrapper-' + index);
                let rectItem = rect.getBoundingClientRect();
                div.style.width = rectItem.width + 'px';
                div.style.height = rectItem.height + 'px';
                div.style.left = rectItem.left + 'px';
                div.style.top = rectItem.top + 'px';
            }
        });
    }
    render() {
        const style = styler([{ key: "precip", color: "grey"}]);
        return (
            <div className="barchart">
                <ChartContainer timeRange={this.series.range()}>
                    <ChartRow height="150">
                        <YAxis
                            id="y-axis"
                            label=""
                            min={0}
                            max={6}
                            width="80"
                            type="linear"
                        />
                        <Charts>
                            <BarChart
                                axis="y-axis"
                                style={style}
                                spacing={1}
                                columns={["precip"]}
                                series={this.series}
                            />
                        </Charts>
                    </ChartRow>
                </ChartContainer>
            </div>
        );
    }
};

export default Barchart;