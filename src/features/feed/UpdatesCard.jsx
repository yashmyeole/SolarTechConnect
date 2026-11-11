import { useState } from 'react';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card, CardHeader } from '@/components/Card';
import Icon from '@/components/Icon';
import { Segmented } from '@/components/Segmented';
import { useAppStore, usePersona } from '@/store';
import ComposeDialog from './ComposeDialog';
import UpdateCard from './UpdateCard';
import styles from './feed.module.css';

const ORDER = [
  { value: 'popular', label: 'Popular' },
  { value: 'latest', label: 'Latest' },
];

export default function UpdatesCard() {
  const persona = usePersona();
  const posts = useAppStore((state) => state.posts);
  const [order, setOrder] = useState('popular');
  const [composing, setComposing] = useState(null);
  const sorted = order === 'latest' ? posts : [...posts].sort((a, b) => b.likes - a.likes);

  return (
    <Card>
      <CardHeader
        title="Updates from your contacts and groups"
        action={<Segmented label="Order updates" small items={ORDER} value={order} onChange={setOrder} />}
      />
      <div className={styles.composer}>
        <Avatar name={persona.name} />
        <button type="button" className={styles.composerButton} onClick={() => setComposing('text')}>
          Share an update, a question or photos of your work
        </button>
        <Button iconOnly aria-label="Share photos" onClick={() => setComposing('photos')}>
          <Icon name="image" />
        </Button>
      </div>
      <div className={styles.list}>
        {sorted.map((post) => (
          <UpdateCard key={post.id} post={post} />
        ))}
      </div>
      {composing && (
        <ComposeDialog
          withPhotos={composing === 'photos'}
          onClose={() => setComposing(null)}
          onPosted={() => setOrder('latest')}
        />
      )}
    </Card>
  );
}
