import React from 'react';

import TestmoduleView from '../components/TestmoduleView';

class Testmodule extends React.Component {
  render() {
    return <TestmoduleView {...this.props} />;
  }
}

export default Testmodule;
