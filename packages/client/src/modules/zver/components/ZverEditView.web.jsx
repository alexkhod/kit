import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import translate from '../../../i18n';
import { PageLayout } from '../../common/components/web';
import ZverForm from './ZverForm';
import ZverNotes from '../containers/ZverNotes';
import settings from '../../../../../../settings';

const onSubmit = (zver, editZver) => values => {
  editZver(zver.id, values.title, values.content);
};

const ZverEditView = ({ loading, zver, match, location, subscribeToMore, editZver, t }) => {
  let zverObj = zver;
  // if new zver was just added read it from router
  if (!zverObj && location.state) {
    zverObj = location.state.zver;
  }

  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - ${t('zver.title')}`}
      meta={[
        {
          name: 'description',
          content: t('zver.meta')
        }
      ]}
    />
  );

  if (loading && !zverObj) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">{t('zver.loadMsg')}</div>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        <Link id="back-button" to="/zvers">
          {t('zver.btn.back')}
        </Link>
        <h2>
          {t(`zver.label.edit`)} {t('zver.label.zver')}
        </h2>
        <ZverForm onSubmit={onSubmit(zverObj, editZver)} zver={zver} />
        <br />
        {zverObj && (
          <ZverNotes
            zverId={Number(match.params.id)}
            notes={zverObj.notes}
            blocks={zverObj.blocks}
            subscribeToMore={subscribeToMore}
          />
        )}
      </PageLayout>
    );
  }
};

ZverEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  zver: PropTypes.object,
  editZver: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default translate('zver')(ZverEditView);
