import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { UpdatesContainer } from '../containers';

const title = "Updates";

@inject("stores")
@observer
class Updates extends Component {
  componentWillMount() {
    const { updatesStore } = this.props.stores;
    updatesStore.fetchUpdates();
  }
  componentWillUnmount() {
    const { updatesStore } = this.props.stores;
    updatesStore._reset();
  }
  render() {
    return (
      <FadeAnimation>
        <MetaData
          title={title}>
          <UpdatesContainer />
        </MetaData>
      </FadeAnimation>
    );
  }
}

export default Updates;