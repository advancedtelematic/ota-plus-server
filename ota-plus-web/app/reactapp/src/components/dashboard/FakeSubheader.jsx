import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'underscore';
import { Form } from 'formsy-react';
import { SubHeader, SearchBar } from '../../partials';

@observer
class FakeSubheader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {filter, changeFilter, enableAnimation, disableAnimation} = this.props;
		return (
            <div className="search-header">
                <SubHeader>
                    <Form>
                        <SearchBar 
                            value={filter}
                            changeAction={changeFilter}
                            id="search-dashboard-input"
                        />
                    </Form>
                    <div className="fake-actions">
                        <div className="animation">
                            <a href="#" className="stop" onClick={disableAnimation}>
                                <img src="/assets/img/icons/pause_icon.svg" alt="Icon" />
                            </a>
                            <a href="#" className="play" onClick={enableAnimation}>
                                <img src="/assets/img/icons/play_icon.svg" alt="Icon" />
                            </a>
                        </div>
                        <div className="list-actions">
                            <a href="#" className="edit-filters btn btn-main btn-small">edit filters</a>
                            <a href="#" className="sort-list btn btn-main btn-small">sort list</a>
                        </div>
                        <div className="pages">
                            <a href="#" className="live-logs btn btn-main btn-small">live logs</a>
                            <a href="#" className="page-link">page 2</a>
                            <a href="#" className="page-link">page 3</a>
                            <a href="#" className="page-link">page 4</a>
                            <a href="#" className="page-link">page 5</a>
                            <a href="#" className="page-link">page 6</a>
                            <a href="#" className="page-link">page 7</a>
                            <a href="#" className="page-link">page 8</a>
                            <a href="#" className="page-link">page 9</a>
                            <a href="#" className="page-link">page 10</a>
                        </div>
                        <div className="csv">
                            <a href="#" className="download-in-csv btn btn-main btn-small">Download all as CSV</a>
                        </div>
                    </div>
                </SubHeader>
            </div>
        );
    }
}

export default FakeSubheader;