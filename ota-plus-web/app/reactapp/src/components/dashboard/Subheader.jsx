import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Form } from 'formsy-react';
import { SubHeader, SearchBar } from '../../partials';
import { Link } from 'react-router';

@observer
class Subheader extends Component {
    @observable data = [];
    @observable totalErrors = 0;
    @observable totalWarnings = 0;

    constructor(props) {
        super(props);
        this.slugify = this.slugify.bind(this);
    }
    componentWillMount() {
        _.each(Object.keys(this.props.data), (name, index) => {
            let objectItem = this.props.data[name];
            objectItem.name = name.replace(/([A-Z])/g, ' $1');
            this.data.push(objectItem);
            this.totalErrors += objectItem.errors;
            this.totalWarnings += objectItem.warnings;
        });
    }
    slugify(text) {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
    }
    render() {        
		return (
            <div className="dashboard-subheader">
                <div className={"system" + (this.totalErrors ? " error" : this.totalWarnings ? " warning" : " ok")}>
                    <div className="title">
                        System status
                    </div>                      
                    <div className="status">
                        {this.totalErrors + (this.totalErrors === 1 ? ' error, ' : ' errors, ') + this.totalWarnings + (this.totalWarnings === 1 ? ' warning' : ' warnings')}
                    </div>
                    <div className="triangle">
                    </div>
                </div>
                <div className="sub-systems">
                    {_.map(this.data, (item, index) => {
                        return (
                            <Link to={item.name === 'campaigns' ? '/advanced-campaigns' : this.slugify(item.name)} className="item" key={index}>
                                <div className="title">
                                    {item.name}
                                </div>
                                <div className="icon">
                                    {item.errors ?
                                        <img src="/assets/img/icons/red_cross.svg" alt="Icon" />
                                    : item.warnings ? 
                                        <img src="/assets/img/icons/warning.svg" alt="Icon" />
                                    :
                                        <img src="/assets/img/icons/green_tick.svg" alt="Icon" />
                                    }
                                </div>
                                <div className="status">
                                    {item.errors || item.warnings ?
                                        item.errors + (item.errors === 1 ? ' error, ' : ' errors, ') + item.warnings + (item.warnings === 1 ? ' warning' : ' warnings')
                                    :
                                        'all services online and running'
                                    }
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }
}


Subheader.contextTypes = {
    router: React.PropTypes.object.isRequired
}


export default Subheader;