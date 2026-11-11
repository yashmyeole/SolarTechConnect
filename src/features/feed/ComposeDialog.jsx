import { useState } from 'react';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Dialog, DialogActions, DialogBody } from '@/components/Dialog';
import { FieldError, Select } from '@/components/Field';
import Icon from '@/components/Icon';
import { GROUPS } from '@/data/community';
import { useAppStore, usePersona } from '@/store';
import { toast } from '@/store/ui';
import styles from './feed.module.css';

const ATTACHMENTS = [
  ['image', 'Photos'],
  ['briefcase', 'Project'],
  ['doc', 'File'],
];

export default function ComposeDialog({ withPhotos, onClose, onPosted }) {
  const persona = usePersona();
  const joined = useAppStore((state) => state.joinedGroupIds);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!text.trim()) {
      setError('Write something before you post.');
      document.getElementById('update-text').focus();
      return;
    }
    useAppStore.getState().addPost({ author: { kind: 'member', id: persona.id }, time: 'Now', text: text.trim() });
    toast('Update posted');
    onPosted();
    onClose();
  };

  const audiences = [
    'Everyone',
    'Contacts only',
    ...GROUPS.filter((group) => joined.includes(group.id)).map((group) => group.name),
  ];

  return (
    <Dialog title="New update" onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <DialogBody>
          <div className="row">
            <Avatar name={persona.name} />
            <div className="grow">
              <p className="strong">{persona.name}</p>
              <label className="sr-only" htmlFor="update-audience">
                Who can see this
              </label>
              <Select id="update-audience" small className={styles.audience} options={audiences} />
            </div>
          </div>
          <label className="sr-only" htmlFor="update-text">
            Update
          </label>
          <textarea
            id="update-text"
            data-autofocus
            className={`${styles.replyInput} ${styles.text}`}
            placeholder={
              withPhotos
                ? 'Describe the photos: the job, the place, the crew.'
                : 'Share an update, a question or photos of your work.'
            }
            value={text}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'update-text-error' : undefined}
            onChange={(event) => {
              setText(event.target.value);
              setError('');
            }}
          />
          <FieldError id="update-text-error" message={error} />
          <div className="row gap-4 mt-8">
            {ATTACHMENTS.map(([icon, label]) => (
              <Button key={label} variant="quiet" size="sm" onClick={() => toast(`Add ${label.toLowerCase()}`)}>
                <Icon name={icon} size={18} />
                {label}
              </Button>
            ))}
          </div>
        </DialogBody>
        <DialogActions onCancel={onClose} submitLabel="Post update" />
      </form>
    </Dialog>
  );
}
