/** @format */

import React, { Component } from 'react';
import _ from 'underscore';

class List extends Component {
  render() {
    const { data } = this.props;
    const renderContent = !_.isUndefined(data);

    function reverseObject(obj) {
      let new_obj = {};
      let rev_obj = Object.keys(obj).reverse();
      rev_obj.forEach(function(i) {
        new_obj[i] = obj[i];
      });
      return new_obj;
    }

    const dataReverse = reverseObject(data);

    return renderContent ? (
      <div className='whats-new-content'>
        {_.map(dataReverse, (version, i) => {
          delete version.slides.introduction;
          return (
            <div key={i}>
              {_.map(version.slides, (slide, i) => {
                return (
                  <div className='item' key={i}>
                    <div className='image-box'>
                      <img src={slide.feature.blogImage.src} alt='' />
                    </div>
                    <div className='description-box'>
                      <div className='date'> DATE OF RELEASE: {version.dataOfRelease}</div>
                      <div className='title'>{slide.feature.title}</div>
                      {!slide.feature.message.__html ? <div className='message'>{slide.feature.message}</div> : <div className='message' dangerouslySetInnerHTML={slide.feature.message} />}
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
