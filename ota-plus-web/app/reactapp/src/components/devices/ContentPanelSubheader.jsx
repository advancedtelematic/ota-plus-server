import React, { Component, PropTypes } from 'react';
import { SubHeader, SearchBar } from '../../partials';
import { observer, inject } from 'mobx-react';
import { Form } from 'formsy-react';
import { FlatButton } from 'material-ui';
import { FormInput, FormSelect } from '../../partials';

@inject("stores")
@observer
class ContentPanelSubheader extends Component {

    render() {
        const { groupsStore } = this.props.stores;
        let expressionsArray = groupsStore.selectedGroup.expression.split(' and ');
        if (expressionsArray.length > 1) {
            expressionsArray = expressionsArray.map(element => element.substring(0, element.length - 1).substring(1));
        }

        const Filters = expressionsArray.map((singleFilter, index) => {
            let singleFilterElements = singleFilter.split(' ');
            if (singleFilterElements[0] === 'deviceid') {
                singleFilterElements[0] = 'device ID';
            }
            return (
                <div key={index} className={"filters filters--dark"}>
                    <div className="filters__block" style={{ flex: 1 }} >
                        <FormInput
                            id="name-filter"
                            name="nameFilter"
                            defaultValue={singleFilterElements[0]}
                            isEditable={false}

                        />
                    </div>
                    <div className="filters__block" style={{ flex: 1 }} >
                        <FormInput
                            id="expression-filter"
                            name="expressionFilter"
                            defaultValue={singleFilterElements[1]}
                            isEditable={false}

                        />
                    </div>
                    <div className="filters__block" style={{ flex: 5 }} >
                        {<FormInput
                            id="word"
                            name="word"
                            className="input-wrapper"
                            defaultValue={singleFilterElements[2]}
                            isEditable={false}
                        />
                        }
                    </div>

                </div >
            )
        })


        return (
            <SubHeader className="subheader--filters" >
                {Filters}
            </SubHeader>
        );
    }
}

export default ContentPanelSubheader;