import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Form } from 'formsy-react';
import { SubHeader, SearchBar } from '../../partials';

@observer
class Subheader extends Component {
    @observable data = [];
    @observable totalErrors = 0;
    @observable totalWarnings = 0;

    constructor(props) {
        super(props);
    }
    componentWillMount() {
        _.each(Object.keys(this.props.data), (name, index) => {
            let objectItem = this.props.data[name];
            objectItem.name = name;
            this.data.push(objectItem);
            this.totalErrors += objectItem.errors;
            this.totalWarnings += objectItem.warnings;
        });
    }
    render() {
		return (
            <div className="dashboard-subheader">
                <div className={"system" + (this.totalErrors ? " error" : this.totalWarnings ? " warning" : " ok")}>
                    <div className="title">
                        System status
                    </div>                      
                    <div className="status">
                        {this.totalErrors} errors, {this.totalWarnings} warnings
                    </div>
                    <div className="triangle">
                    </div>
                </div>
                <div className="sub-systems">
                    {_.map(this.data, (item, index) => {
                        return (
                            <div className="item" key={index}>
                                <div className="title">
                                    {item.name}
                                </div>
                                <div className="icon">
                                    {item.errors ?
                                        <img src="/assets/img/icons/red_cross.png" alt="Icon" />
                                    :
                                        <img src="/assets/img/icons/green_tick.png" alt="Icon" />
                                    }
                                </div>
                                <div className="status">
                                    {item.errors || item.warnings ?
                                        item.errors + ' errors, ' + item.warnings + ' warnings'
                                    :
                                        'all services online and running'
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Subheader;