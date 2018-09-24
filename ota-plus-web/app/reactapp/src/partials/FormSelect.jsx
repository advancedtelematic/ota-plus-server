import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import { createAttributeValue } from "../utils/Transformers";
import $ from 'jquery';

class FormSelect extends Component {
    constructor() {
        super();
        this.state = {
            showDropDown: false,
            selectedOptions: []
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.selectOption = this.selectOption.bind(this);
        this.appendSelectFieldsToBody = this.appendSelectFieldsToBody.bind(this);
        this._attachEventListener = this._attachEventListener.bind(this);
        this._detachEventListener = this._detachEventListener.bind(this);
    }

    _attachEventListener() {
        const self = this;
        const body = $('body');

        if ($._data(body[0], 'events') && $._data(body[0], 'events').click) {
            self._detachEventListener();
        } else {
            body.on('click', (e) => {
                if (e.target.className !== 'c-form__option ' && e.target.className !== 'c-form__option c-form__option--selected') {
                    self.toggleMenu();
                }
            });
        }
    }

    _detachEventListener() {
        $('body').unbind('click');
    }

    toggleMenu = (e) => {
        const { appendMenuToBodyTag } = this.props;
        const existContainer = document.getElementById('dropdown-render-container');

        if (existContainer) {
            existContainer.parentNode.removeChild(existContainer)
        }

        this.setState({
            showDropDown: !this.state.showDropDown
        }, () => {
            this._attachEventListener();
        });

        if (appendMenuToBodyTag && e && e.target && e.target.className !== 'c-form__option') {
            this.appendSelectFieldsToBody(e);
        }
    };

    appendSelectFieldsToBody = (e) => {
        const { showDropDown } = this.state;
        const { multiple = true, options, visibleFieldsCount = options.length > 1 ? options.length : 2, } = this.props;
        const renderContainer = document.createElement('div');
        const inputPosition = e.target.getBoundingClientRect();
        const appendToBody = {
            top: inputPosition.top + inputPosition.height,
            left: inputPosition.left,
            position: 'absolute',
            width: inputPosition.width,
            height: options.length > 1 ? 'auto' : '35px'
        };

        renderContainer.setAttribute('id', 'dropdown-render-container');
        document.body.appendChild(renderContainer);

        const selectFields = (
            <select size={ visibleFieldsCount }
                    style={ appendToBody }
                    id="dropdown"
                    className="c-form__select"
                    multiple={ multiple }
            >
                { this.createDropdown(options) }
            </select>
        );

        if (!showDropDown) {
            ReactDOM.render(selectFields, renderContainer)
        } else {
            renderContainer.innerHTML = '';
        }
    };

    selectOption = (value, e) => {
        const { appendMenuToBodyTag, multiple } = this.props;

        if (appendMenuToBodyTag && multiple) {
            e.target.classList.toggle('c-form__option--selected')
        }

        let options = this.state.selectedOptions;
        if (_.isArray(options)) {
            if (_.contains(options, value)) {
                options = _.without(options, value);
            } else {
                options.push(value);
            }
        }

        if (!multiple) {
            this.toggleMenu(e);
            this.setState({
                selectedOptions: value
            });
            this.props.onChange(value);
        } else {
            this.setState({
                selectedOptions: options
            });
            this.props.onChange(options);
        }
    };


    createDropdown = (options) => {
        const { selectedOptions } = this.state;
        const { id } = this.props;
        return options.map((value, index) => {
            if (_.isObject(value)) {
                const option = value;
                const selected = _.contains(selectedOptions, option.value);
                return (
                    <option key={ index }
                            onClick={ this.selectOption.bind(this, option.value) }
                            id={ `${createAttributeValue(id)}-${createAttributeValue(option.id)}` }
                            className={ `c-form__option ${selected ? 'c-form__option--selected' : ''}` }
                            value={ createAttributeValue(option.value) }>
                        { option.text }
                    </option>
                )
            } else {
                const selected = _.contains(selectedOptions, value);
                return (
                    <option key={ index }
                            onClick={ this.selectOption.bind(this, value) }
                            id={ `${createAttributeValue(id)}-${createAttributeValue(value)}` }
                            className={ `c-form__option ${selected ? 'c-form__option--selected' : ''}` }
                            value={ createAttributeValue(value) }>
                        { value }
                    </option>
                )
            }
        });
    };

    render() {
        const {
            multiple = true,
            label,
            placeholder,
            options, id = '',
            inputWidth = '100%',
            wrapperWidth = '100%',
            defaultValue,
            appendMenuToBodyTag = false,
            visibleFieldsCount = options.length > 1 ? options.length : 2,
            name = '',
            onChange = null
        } = this.props;

        const { showDropDown, selectedOptions } = this.state;
        const inputValue =
            selectedOptions.id ?
                selectedOptions.id
                : selectedOptions.text ?
                selectedOptions.text
                : selectedOptions.length
                    ? selectedOptions
                    : defaultValue && defaultValue.length > 0 ? defaultValue : '';
        const defaultRendering = {
            'top': '42px',
            'left': '1px',
            'height': options && (options.length > 1 ? 'auto' : '35px'),
        };

        return (
            <div className="c-form__wrapper" style={ { width: wrapperWidth } }>
                { label ?
                    <label className="c-form__label">{ label }</label>
                    :
                    null
                }
                <div className="c-form__relative-input">
                    <input className={ `c-form__input ${inputValue.length === 0 ? 'c-form__input--hide-caret' : ''}` }
                           type="text"
                           style={ { width: inputWidth } }
                           value={ inputValue }
                           placeholder={ placeholder }
                           onClick={ this.toggleMenu }
                           onChange={ onChange }
                           id={ createAttributeValue(id) }
                           autoComplete="off"
                           name={ name }
                    />
                    {
                        !!inputValue.length ?
                            <i className={ `fa fa-check c-form__select-icon` }/>
                            :
                            <i className={ `fa ${showDropDown ? 'fa-angle-up' : 'fa-angle-down'} c-form__select-icon` }/>
                    }
                    {
                        showDropDown && !appendMenuToBodyTag &&
                        <select size={ visibleFieldsCount }
                                style={ defaultRendering }
                                id={ 'select-' + createAttributeValue(id) }
                                className="c-form__select"
                                multiple={ multiple }
                        >
                            { this.createDropdown(options) }
                        </select>

                    }
                </div>
            </div>
        )
    }
}

FormSelect.propTypes = {
    multiple: PropTypes.bool,
    label: PropTypes.string,
    appendMenuToBodyTag: PropTypes.bool,
    placeholder: PropTypes.string,
    visibleFieldsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.string,
    options: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.shape({
            text: PropTypes.string,
            id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]),
            value: PropTypes.string
        })
    ]).isRequired
};

export default FormSelect;