/** @format */

import React, { Component } from 'react';
import { SubHeader } from '../../partials';
import { observer, inject } from 'mobx-react';
import { FormInput } from '../../partials';

const CHARACTER_POSITION_REGEXP_PATTERN = '\\((.*?)\\)';

@inject('stores')
@observer
class ContentPanelSubheader extends Component {
  render() {
    const { groupsStore } = this.props.stores;
    let expressionsArray = groupsStore.selectedGroup.expression.split(/ and | or /);
    let operationsArray = groupsStore.selectedGroup.expression.match(/and|or/g);
    let expressionsArrayToDisplay = [];

    expressionsArray.forEach(element => {
      let singleExpressionAfterSplit = element.split(' ');
      let singleExpressionToDisplay = [];
      if (element.search('contains') > 0) {
        //line below to support old type of expression closed in parenthesis
        if (singleExpressionAfterSplit[2].charAt(singleExpressionAfterSplit[2].length - 1) === ')') {
          singleExpressionAfterSplit[2] = singleExpressionAfterSplit[2].slice(0, -1);
        }
        singleExpressionToDisplay = ['Device ID', 'contains', singleExpressionAfterSplit[2]];

        return expressionsArrayToDisplay.push({
          expression: singleExpressionToDisplay,
          type: 'contains',
        });
      } else if (element.search('position') > 0) {

        // we need to get value between () brackets
        // for example: the input is "deviceid,position(13),is,8" and the output is ["(15)", "15"]
        const [, character] = element.match(CHARACTER_POSITION_REGEXP_PATTERN);
        const position = singleExpressionAfterSplit[singleExpressionAfterSplit.length - 1];

        if (element.search('than') < 0) {
          singleExpressionToDisplay = ['Device ID', 'has a character equal to', position, `in position ${character}`];
        } else if (element.search('than') > 0) {
          singleExpressionToDisplay = ['Device ID', 'has a character different from', position, `in position ${character}`];
        }

        return expressionsArrayToDisplay.push({
          expression: singleExpressionToDisplay,
          type: 'position',
        });
      }
    });

    const Filters = expressionsArrayToDisplay.map((singleFilter, index) => {
      return (
        <div key={index} className={'filters'}>
          <div className={'filter filter--dark'}>
            <div className='filter__block' style={{ flex: 1 }}>
              <FormInput id='name-filter' name='nameFilter' defaultValue={singleFilter.expression[0]} isEditable={false} />
            </div>
            <div className='filter__block' style={{ flex: 2 }}>
              <FormInput id='expression-filter' name='expressionFilter' defaultValue={singleFilter.expression[1]} isEditable={false} />
            </div>

            {singleFilter.type === 'contains' && (
              <div className='filter__block' style={{ flex: 4 }}>
                <FormInput id='word' name='word' className='input-wrapper' defaultValue={singleFilter.expression[2]} isEditable={false} />
              </div>
            )}
            {singleFilter.type === 'position' && (
              <div className={'filter__block filter__block--double'} style={{ display: 'flex', flex: 4 }}>
                <div className='filter__block' style={{ flex: 1 }}>
                  <FormInput id='word' name='word' className='input-wrapper' defaultValue={singleFilter.expression[2]} isEditable={false} />
                </div>
                <div className='filter__block' style={{ flex: 1 }}>
                  <FormInput id='word' name='word' className='input-wrapper' defaultValue={singleFilter.expression[3]} isEditable={false} />
                </div>
              </div>
            )}
          </div>
          {operationsArray && index < operationsArray.length ? <div className='filters--operation_dark'>{operationsArray[index]}</div> : ''}
        </div>
      );
    });

    return <SubHeader className='subheader--filters'>{Filters}</SubHeader>;
  }
}

export default ContentPanelSubheader;
