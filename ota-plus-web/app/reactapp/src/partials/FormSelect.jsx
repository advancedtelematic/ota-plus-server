import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';

class FormSelect extends Component {
    constructor() {
        super();
        this.state = {
            showDropDown: false,
            selectedOption: ''
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.selectOption = this.selectOption.bind(this);
        this.appendSelectFieldsToBody = this.appendSelectFieldsToBody.bind(this);
    }

    toggleMenu(e) {
        const {appendMenuToBodyTag} = this.props;
        const existContainer = document.getElementById('dropdown-render-container');
        if (existContainer) {
            existContainer.parentNode.removeChild(existContainer)
        }

        this.setState({
            showDropDown: !this.state.showDropDown
        });

        if (appendMenuToBodyTag && e.target.className !== 'c-form__option') {
            this.appendSelectFieldsToBody(e);
        }
    }

    appendSelectFieldsToBody(e) {
        const {multiple = true, options, id, visibleFieldsCount = 0} = this.props;
        const {showDropDown} = this.state;
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
                        width: inputPosition.width
                    }}
                    className="c-form__select"
                    multiple={multiple} id={id}>
                {options.map((value, index) => {
                    if (_.isObject(value)) {
                        const option = value;
                        return (
                            <option key={index}
                                    onClick={this.selectOption.bind(this, option)}
                                    id={`${id}-${option.id}`}
                                    className="c-form__option"
                                    value={option.value}>
                                {option.text}
                            </option>
                        )
                    } else {
                        return (
                            <option key={index}
                                    onClick={this.selectOption.bind(this, value)}
                                    id={`${id}-${value}`}
                                    className="c-form__option"
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
        this.setState({
            selectedOption: value
        });
        this.props.onChange(e);
        this.toggleMenu(e);
    }

    render() {
        const {
            multiple = true,
            label,
            placeholder,
            options, id,
            inputWidth = '100%',
            wrapperWidth = '100%',
            defaultValue,
            appendMenuToBodyTag = false,
            visibleFieldsCount = 0,
        } = this.props;

        const {showDropDown, selectedOption} = this.state;
        const inputValue =
            selectedOption.id ?
                selectedOption.id
                : selectedOption.length
                ? selectedOption
                : defaultValue && defaultValue.length > 0 ? defaultValue : '';

        return (
            <div className="c-form__relative-wrapper" style={{width: wrapperWidth}}>
                <label className="c-form__label">{label}</label>
                <input className={`c-form__input ${inputValue.length ? 'c-form__input--hide-caret' : ''}`}
                       type="text"
                       style={{width: inputWidth}}
                       value={inputValue}
                       placeholder={placeholder}
                       onClick={this.toggleMenu}/>
                {inputValue.length ?
                    <i className={`fa fa-check c-form__select-icon`}/>
                    :
                    <i className={`fa ${showDropDown ? 'fa-angle-up' : 'fa-angle-down'} c-form__select-icon`}/>
                }
                {showDropDown && !appendMenuToBodyTag ?
                    <select size={visibleFieldsCount}
                            className="c-form__select"
                            multiple={multiple} id={id}>
                        {options.map((value, index) => {
                            if (_.isObject(value)) {
                                const option = value;
                                return (
                                    <option key={index}
                                            onClick={this.selectOption.bind(this, option)}
                                            id={`${id}-${option.id}`}
                                            className="c-form__option"
                                            value={option.value}>
                                        {option.text}
                                    </option>
                                )
                            } else {
                                return (
                                    <option key={index}
                                            onClick={this.selectOption.bind(this, value)}
                                            id={`${id}-${value}`}
                                            className="c-form__option"
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
    multiple: PropTypes.bool, // TODO: doesn't work now
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