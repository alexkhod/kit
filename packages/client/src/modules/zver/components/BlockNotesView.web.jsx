import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import translate from '../../../i18n';
import { Table, Button } from '../../common/components/web';
import BlockNoteForm from './BlockNoteForm';

class BlockNotesView extends React.PureComponent {
  static propTypes = {
    blockId: PropTypes.number.isRequired,
    notes: PropTypes.array.isRequired,
    modules: PropTypes.array.isRequired,
    note: PropTypes.object,
    addNote: PropTypes.func.isRequired,
    editNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired,
    onNoteSelect: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  handleEditNote = (id, content) => {
    const { onNoteSelect } = this.props;
    onNoteSelect({ id, content });
  };

  handleDeleteNote = id => {
    const { note, onNoteSelect, deleteNote } = this.props;

    if (note.id === id) {
      onNoteSelect({ id: null, content: '' });
    }

    deleteNote(id);
  };

  onSubmit = () => values => {
    const { note, blockId, addNote, editNote, onNoteSelect } = this.props;

    if (note.id === null) {
      addNote(values.content, blockId);
    } else {
      editNote(note.id, values.content);
    }

    onNoteSelect({ id: null, content: '' });
  };

  render() {
    const { blockId, notes, modules, note, t } = this.props;
    const columns = [
      {
        title: t('notes.column.content'),
        dataIndex: 'content',
        key: 'content'
      },
      {
        title: t('notes.column.actions'),
        key: 'actions',
        width: 120,
        render: (text, record) => (
          <div style={{ width: 120 }}>
            <Button
              color="primary"
              size="sm"
              className="edit-note"
              onClick={() => this.handleEditNote(record.id, record.content)}
            >
              {t('notes.btn.edit')}
            </Button>{' '}
            <Button color="primary" size="sm" className="delete-note" onClick={() => this.handleDeleteNote(record.id)}>
              {t('notes.btn.del')}
            </Button>
          </div>
        )
      }
    ];
    const modulescolumns = [
      {
        title: t('modules.column.content'),
        dataIndex: 'inv',
        key: 'inv',
        render: (text, record) => (
          <Link className="zver-link" to={`/module/${record.id}`}>
            {text}
          </Link>
        )
      },
      {
        title: t('modules.column.actions'),
        key: 'actions',
        width: 120,
        render: (text, record) => (
          <div style={{ width: 120 }}>
            <Button
              color="primary"
              size="sm"
              className="edit-note"
              onClick={() => this.handleEditNote(record.id, record.content)}
            >
              {t('notes.btn.edit')}
            </Button>{' '}
            <Button color="primary" size="sm" className="delete-note" onClick={() => this.handleDeleteNote(record.id)}>
              {t('notes.btn.del')}
            </Button>
          </div>
        )
      }
    ];
    //console.log(notes);

    return (
      <div>
        <h3>{t('notes.title')}</h3>
        <BlockNoteForm blockId={blockId} onSubmit={this.onSubmit()} initialValues={note} note={note} />
        <h1 />
        <Table dataSource={notes} columns={columns} />
        <h3>{t('modules.title')}</h3>
        <BlockNoteForm blockId={blockId} onSubmit={this.onSubmit()} initialValues={note} note={note} />
        <Table dataSource={modules} columns={modulescolumns} />
      </div>
    );
  }
}

export default translate('zver')(BlockNotesView);
