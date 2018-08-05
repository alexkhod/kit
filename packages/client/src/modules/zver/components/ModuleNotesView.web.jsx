import React from 'react';
import PropTypes from 'prop-types';

import translate from '../../../i18n';
import { Table, Button } from '../../common/components/web';
import ModuleNoteForm from './ModuleNoteForm';

class ModuleNotesView extends React.PureComponent {
  static propTypes = {
    moduleId: PropTypes.number.isRequired,
    notes: PropTypes.array.isRequired,
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
    const { note, moduleId, addNote, editNote, onNoteSelect } = this.props;

    if (note.id === null) {
      addNote(values.content, moduleId);
    } else {
      editNote(note.id, values.content);
    }

    onNoteSelect({ id: null, content: '' });
  };

  render() {
    const { moduleId, notes, note, t } = this.props;
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

    //console.log(notes);

    return (
      <div>
        <h3>{t('notes.title')}</h3>
        <ModuleNoteForm moduleId={moduleId} onSubmit={this.onSubmit()} initialValues={note} note={note} />
        <h1 />
        <Table dataSource={notes} columns={columns} />
      </div>
    );
  }
}

export default translate('zver')(ModuleNotesView);
