import React from 'react';
import Helmet from 'react-helmet';
import { PageLayout } from '../../common/components/web';

const renderMetaData = () => (
  <Helmet
    title="Testmodule"
    meta={[
      {
        name: 'description',
        content: 'Testmodule page'
      }
    ]}
  />
);

const TestmoduleView = () => {
  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center">
        <p>Hello Testmodule!</p>
      </div>
    </PageLayout>
  );
};

export default TestmoduleView;
