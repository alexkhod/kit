import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import translate from '../../../i18n';
import { Table, Button } from '../../common/components/web';
import ZverBlockForm from './ZverBlockForm';

class ZverBlocksView extends React.PureComponent {
  static propTypes = {
    zverId: PropTypes.number.isRequired,
    blocks: PropTypes.array.isRequired,
    block: PropTypes.object,
    addBlock: PropTypes.func.isRequired,
    editBlock: PropTypes.func.isRequired,
    deleteBlock: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired,
    onBlockSelect: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  handleEditBlock = (id, inv) => {
    const { onBlockSelect } = this.props;
    onBlockSelect({ id, inv });
  };

  handleDeleteBlock = id => {
    const { block, onBlockSelect, deleteBlock } = this.props;

    if (block.id === id) {
      onBlockSelect({ id: null, inv: '' });
    }

    deleteBlock(id);
  };

  onSubmit = () => values => {
    const { block, zverId, addBlock, editBlock, onBlockSelect } = this.props;

    if (block.id === null) {
      addBlock(values.inv, zverId);
    } else {
      editBlock(block.id, values.inv);
    }

    onBlockSelect({ id: null, inv: '' });
  };

  render() {
    const { zverId, blocks, block, t } = this.props;
    const columns = [
      {
        title: t('blocks.column.content'),
        dataIndex: 'inv',
        key: 'inv',
        render: (text, record) => (
          <Link className="zver-link" to={`/block/${record.id}`}>
            {text}
          </Link>
        )
      },
      {
        title: t('blocks.column.actions'),
        key: 'actions',
        width: 120,
        render: (text, record) => (
          <div style={{ width: 120 }}>
            <Button
              color="primary"
              size="sm"
              className="edit-block"
              onClick={() => this.handleEditBlock(record.id, record.inv)}
            >
              {t('blocks.btn.edit')}
            </Button>{' '}
            <Button
              color="primary"
              size="sm"
              className="delete-block"
              onClick={() => this.handleDeleteBlock(record.id)}
            >
              {t('blocks.btn.del')}
            </Button>
          </div>
        )
      }
    ];

    return (
      <div>
        <h3>{t('blocks.title')}</h3>
        <ZverBlockForm zverId={zverId} onSubmit={this.onSubmit()} initialValues={block} block={block} />
        <h1 />
        <Table dataSource={blocks} columns={columns} />
      </div>
    );
  }
}

export default translate('zver')(ZverBlocksView);
