import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
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

        if ($._data( body[0], 'events' ) && $._data( body[0], 'events' ).click) {
            self._detachEventListener();
        } else {
            body.on('click', (e) => {
                if (e.target.className !== 'c-form__option ') {
                    self.toggleMenu();
                }
            });
        }
    }

    _detachEventListener() {
        $('body').unbind('click');
    }

    toggleMenu(e) {
        const {appendMenuToBodyTag} = this.props;
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

    }

    appendSelectFieldsToBody(e) {
        const {multiple = true, options, id, visibleFieldsCount = options.length > 1 ? options.length : 2,} = this.props;
        const {showDropDown, selectedOptions} = this.state;
        const renderContainer = document.createElement('div');
        const inputPosition = e.target.getBoundingClientRect();

        renderContainer.setAttribute('id', 'dropdown-render-container');
        document.body.appendChild(renderContainer);

        const selectFields =
            <select size={visibleFieldsCount}
                    style={{
                        top: inputPosition.top + inputPosition.height,
                        left: inputPosition.left,
                        position: 'absolute',
                        width: inputPosition.width,
                        height: options.length > 1 ? 'auto' : '35px'
                    }}
                    className="c-form__select"
                    multiple={multiple} id={id}>
                {options.map((value, index) => {
                    const selected = _.contains(selectedOptions, value);
                    if (_.isObject(value)) {
                        const option = value;
                        return (
                            <option key={index}
                                    onClick={this.selectOption.bind(this, option)}
                                    id={`${id}-${option.id}`}
                                    className={`c-form__option ${selected ? 'c-form__option--selected' : ''}`}
                                    value={option.value}>
                                {option.text}
                            </option>
                        )
                    } else {
                        return (
                            <option key={index}
                                    onClick={this.selectOption.bind(this, value)}
                                    id={`${id}-${value}`}
                                    className={`c-form__option ${selected ? 'c-form__option--selected' : ''}`}
                                    value={value}>
                                {value}
                            </option>
                        )
                    }
                })}
            </select>;

        if (!showDropDown) {
            ReactDOM.render(selectFields, renderContainer)
        } else {
            renderContainer.innerHTML = '';
        }
    }

    selectOption(value, e) {
        const {appendMenuToBodyTag, multiple} = this.props;

        if (appendMenuToBodyTag) {
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
    }

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
        } = this.props;

        const {showDropDown, selectedOptions} = this.state;
        const inputValue =
            selectedOptions.id ?
                selectedOptions.id
                : selectedOptions.length
                ? selectedOptions
                : defaultValue && defaultValue.length > 0 ? defaultValue : '';

        return (
            <div className="c-form__relative-wrapper" style={{width: wrapperWidth}}>
                <label className="c-form__label">{label}</label>
                <input className={`c-form__input ${inputValue.length ? 'c-form__input--hide-caret' : ''}`}
                       type="text"
                       style={{width: inputWidth}}
                       value={inputValue}
                       placeholder={placeholder}
                       onClick={this.toggleMenu}
                       id={id}/>
                {inputValue.length ?
                    <i className={`fa fa-check c-form__select-icon`}/>
                    :
                    <i className={`fa ${showDropDown ? 'fa-angle-up' : 'fa-angle-down'} c-form__select-icon`}/>
                }
                {showDropDown && !appendMenuToBodyTag ?
                    <select size={visibleFieldsCount}
                            style={{
                                height: options.length > 1 ? 'auto' : '35px'
                            }}
                            className="c-form__select"
                            multiple={multiple} id={'select-' + id}>
                        {options.map((value, index) => {
                            const selected = _.contains(selectedOptions, value);
                            if (_.isObject(value)) {
                                const option = value;
                                return (
                                    <option key={index}
                                            onClick={this.selectOption.bind(this, option)}
                                            id={`${id}-${option.id}`}
                                            className={`c-form__option ${selected ? 'c-form__option--selected' : ''}`}
                                            value={option.value}>
                                        {option.text}
                                    </option>
                                )
                            } else {
                                return (
                                    <option key={index}
                                            onClick={this.selectOption.bind(this, value)}
                                            id={`${id}-${value}`}
                                            className={`c-form__option ${selected ? 'c-form__option--selected' : ''}`}
                                            value={value}>
                                        {value}
                                    </option>
                                )
                            }
                        })}
                    </select>
                    : ''}
            </div>
        )
    }
}

FormSelect.propTypes = {
    multiple: PropTypes.bool,
    label: PropTypes.string,
    appendMenuToBodyTag: PropTypes.bool,
    placeholder: PropTypes.string,
    visibleFieldsCount: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
    id: PropTypes.string,
    options: PropTypes.oneOfType([
        PropTypes.string,
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