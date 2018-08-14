import React from 'react';
import PropTypes from 'prop-types';

import translate from '../../../i18n';
import { Table, Button } from '../../common/components/web';
import ModuleNoteForm from './ModuleNoteForm';
import { IfLoggedIn } from '../../user/containers/AuthBase';

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

  handleEditNote = (id, content, updated_at) => {
    const { onNoteSelect } = this.props;
    onNoteSelect({ id, content, updated_at });
  };

  handleDeleteNote = id => {
    const { note, onNoteSelect, deleteNote } = this.props;

    if (note.id === id) {
      onNoteSelect({ id: null, content: '', updated_at: '' });
    }

    deleteNote(id);
  };

  onSubmit = () => values => {
    const { note, moduleId, addNote, editNote, onNoteSelect } = this.props;

    if (note.id === null) {
      addNote(values.content, moduleId);
    } else {
      editNote(note.id, values.content, values.updated_at);
    }

    onNoteSelect({ id: null, content: '', updated_at: '' });
  };

  render() {
    const { moduleId, notes, note, t } = this.props;
    const columns = [
      {
        title: t('notes.column.updated'),
        dataIndex: 'updated_at',
        key: 'updated_at'
      },
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
          <IfLoggedIn role="admin">
            <div style={{ width: 120 }}>
              <Button
                color="primary"
                size="sm"
                className="edit-note"
                onClick={() => this.handleEditNote(record.id, record.content, record.updated_at)}
              >
                {t('notes.btn.edit')}
              </Button>{' '}
              <Button
                color="primary"
                size="sm"
                className="delete-note"
                onClick={() => this.handleDeleteNote(record.id)}
              >
                {t('notes.btn.del')}
              </Button>
            </div>
          </IfLoggedIn>
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
