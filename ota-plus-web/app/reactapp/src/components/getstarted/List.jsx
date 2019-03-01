/** @format */

import React, { Component } from 'react';
import _ from 'lodash';

class List extends Component {
  render() {
    const { data } = this.props;
    const renderContent = !_.isUndefined(data);

    function reverseObject(obj) {
      let new_obj = {};
      if (obj) {
        let rev_obj = Object.keys(obj).reverse();
        rev_obj.forEach(function(i) {
          new_obj[i] = obj[i];
        });
      }
      return new_obj;
    }

    const dataReverse = reverseObject(data);

    return renderContent ? (
      <div className='get-started-content'>
        {_.map(dataReverse, (version, i) => {
          delete version.slides.introduction;
          return (
            <div key={i}>
              {_.map(version.slides, (slide, i) => {
                return (
                  <div className='item' key={i}>
                    <div className='item__title'>{slide.feature.title}</div>
                    <div className='item__content'>
                      <div className='item__content__image-box'>
                        <img src={slide.feature.blogImage.src} alt='' />
                      </div>
                      <div className='item__content__description-box'>
                        {!slide.feature.message.__html ? <div className='message'>{slide.feature.message}</div> : <div className='message' dangerouslySetInnerHTML={slide.feature.message} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    ) : (
      <div className='wrapper-center'>
        <p>{'Something went wrong'}</p>
      </div>
    );
  }
}

export default List;
