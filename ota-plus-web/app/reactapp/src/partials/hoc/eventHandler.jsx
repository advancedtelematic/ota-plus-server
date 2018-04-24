import React, { Component } from 'react';
import $ from 'jquery';
import _ from 'underscore';

function eventHandler(WrappedComponent) {
    return class extends React.Component {
        componentDidMount() {
            this._attachEventListener();
        }
        componentWillUnmount(){
            this._detachEventListener();
        }
        _attachEventListener = () => {
            const body = $('body');
            const itemsList = ['package-dropdown-item','device-dropdown-item', 'campaign-dropdown-item'];

            if ($._data( body[0], 'events' ) && $._data( body[0], 'events' ).click) {
                this._detachEventListener();
            } else {
                body.on('click', (e) => {
                    if (!_.contains(itemsList, e.target.className)) {
                        this.handler(e)
                    }
                });
            }
        };
        _detachEventListener = () => {
            $('body').unbind('click');
        };
        handler = (e) => {
            this.props.hideHandler(e);
        };
        render() {
            return <WrappedComponent {...this.props} />
        }
    };
}

export default eventHandler;