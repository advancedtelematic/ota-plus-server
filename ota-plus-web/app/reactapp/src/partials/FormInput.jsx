import React, {Component} from 'react';

export default class FormInput extends Component {

    validateInput(e) {
        if (e.target.value.length > 0) {
            this.props.onValid ? this.props.onValid() : null;
        } else {
            this.props.onInvalid ? this.props.onInvalid() : null;
        }
    }

    componentDidMount() {
        const {previousValue, isEditable = true, defaultValue} = this.props;
        this.input.value =
            previousValue && previousValue.length ?
            previousValue :
            defaultValue && defaultValue.length ? defaultValue : '';
        !isEditable ? this.input.setAttribute('disabled', 'disabled') : null;
    }

    render() {
        const {
            title = '',
            name,
            placeholder = '',
            defaultValue,
            id, label = '',
            showIcon = false,
            showInput = true,
            inDirector = false,
            inputWidth = '100%',
            wrapperWidth = '100%',
            onChange = null,
            statusIconShown = false,
            children,
            getInputRef = () => {}
        } = this.props;
        return (
            <div className="c-form__relative-wrapper" style={{width: wrapperWidth}}>
                {label.length ?
                    <label title={title} htmlFor={id} className="c-form__label">
                        {label || ''}
                        {showIcon ? <i className="c-form__icon fa fa-info"/> : ''}
                    </label>
                :
                    null
                }
                {showInput ?
                    <div className="c-form__input-wrapper">
                        {children}
                        <input ref={(input) => {this.input = input; getInputRef(input)}}
                               name={name}
                               id={id}
                               style={{width: inputWidth}}
                               className="c-form__input"
                               type="text"
                               onKeyUp={this.validateInput.bind(this)}
                               placeholder={placeholder || ''}
                               onChange={onChange} />
                       {statusIconShown ?
                            <i className='fa fa-check c-form__select-icon' />
                       :
                            null
                       }
                    </div>
                    : ''
                }
            </div>
        )
    }
};