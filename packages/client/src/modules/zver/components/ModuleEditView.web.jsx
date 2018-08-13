import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
// import { Link } from 'react-router-dom';

import translate from '../../../i18n';
import { PageLayout } from '../../common/components/web';
import ModuleForm from './ModuleForm';
import ModuleNotes from '../containers/ModuleNotes';
// import settings from '../../../../../../settings';

const onSubmit = (module, editModule) => values => {
  editModule(module.id, values.inv, values.isWork);
};

const ModuleEditView = ({ loading, module, match, location, subscribeToMore, editModule, t }) => {
  let moduleObj = module;
  // if new module was just added read it from router
  if (!moduleObj && location.state) {
    moduleObj = location.state.module;
  }

  const renderMetaData = () => (
    <Helmet
      title={t('module.title')} // title={`${settings.app.name} - ${t('module.title')}`}
      meta={[
        {
          name: 'description',
          content: t('module.meta')
        }
      ]}
    />
  );

  if (loading && !moduleObj) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">{t('module.loadMsg')}</div>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        {/*
        <Link id="back-button" to="/modules">
          {t('module.btn.back')}
        </Link>
        */}
        <h2>
          {t(`module.label.edit`)} {t('module.label.module')}
        </h2>
        <ModuleForm onSubmit={onSubmit(moduleObj, editModule)} module={module} />
        <br />
        {moduleObj && (
          <ModuleNotes moduleId={Number(match.params.id)} notes={moduleObj.notes} subscribeToMore={subscribeToMore} />
        )}
      </PageLayout>
    );
  }
};

ModuleEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  module: PropTypes.object,
  editModule: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('zver')(ModuleEditView);
