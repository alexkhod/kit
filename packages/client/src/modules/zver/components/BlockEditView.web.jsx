import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import translate from '../../../i18n';
import { PageLayout } from '../../common/components/web';
import BlockForm from './BlockForm';
import BlockNotes from '../containers/BlockNotes';
import settings from '../../../../../../settings';

const onSubmit = (block, editBlock) => values => {
  editBlock(block.id, values.inv, values.isWork);
};

const BlockEditView = ({ loading, block, match, location, subscribeToMore, editBlock, t }) => {
  let blockObj = block;
  // if new block was just added read it from router
  if (!blockObj && location.state) {
    blockObj = location.state.block;
  }

  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - ${t('block.title')}`}
      meta={[
        {
          name: 'description',
          content: t('block.meta')
        }
      ]}
    />
  );

  if (loading && !blockObj) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">{t('block.loadMsg')}</div>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        <Link id="back-button" to="/blocks">
          {t('block.btn.back')}
        </Link>
        <h2>
          {t(`block.label.edit`)} {t('block.label.block')}
        </h2>
        <BlockForm onSubmit={onSubmit(blockObj, editBlock)} block={block} />
        <br />
        {blockObj && (
          <BlockNotes
            blockId={Number(match.params.id)}
            notes={blockObj.notes}
            modules={blockObj.modules}
            subscribeToMore={subscribeToMore}
          />
        )}
      </PageLayout>
    );
  }
};

BlockEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  block: PropTypes.object,
  editBlock: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired,
  t: PropTypes.func
};

console.log(1);

export default translate('zver')(BlockEditView);
