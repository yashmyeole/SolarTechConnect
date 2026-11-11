import { useState } from 'react';
import { Link } from 'react-router';
import Avatar from '@/components/Avatar';
import { Button, ButtonLink } from '@/components/Button';
import { Card } from '@/components/Card';
import Icon from '@/components/Icon';
import IconCircle from '@/components/IconCircle';
import { List, SubHeading } from '@/components/List';
import PageHeader from '@/components/PageHeader';
import { Segmented } from '@/components/Segmented';
import { useDirectory } from '@/features/directory/useDirectory';
import { cx } from '@/lib/cx';
import { usePageTitle } from '@/lib/usePageTitle';
import { useAppStore, useRole } from '@/store';
import styles from './notifications.module.css';

const FILTERS = {
  pro: [
    ['all', 'All'],
    ['jobs', 'Jobs'],
    ['messages', 'Messages'],
    ['network', 'People'],
    ['posts', 'Updates'],
  ],
  emp: [
    ['all', 'All'],
    ['jobs', 'Candidates'],
    ['messages', 'Messages'],
    ['network', 'Company'],
  ],
};

function Lead({ lead }) {
  const { member, company } = useDirectory();
  if (lead.company) return <Avatar name={company(lead.company).name} company />;
  if (lead.member) return <Avatar name={member(lead.member).name} />;
  return <IconCircle name={lead.icon} />;
}

function NotificationRow({ item, role }) {
  const read = () => useAppStore.getState().markNotificationRead(role, item.id);
  return (
    <li className={cx(styles.row, item.unread && styles.unread)}>
      <Lead lead={item.lead} />
      <Link className={`grow ${styles.text}`} to={item.to} onClick={read}>
        {item.text.map((part, index) => (typeof part === 'string' ? part : <b key={index}>{part.bold}</b>))}
        {item.unread && <span className="sr-only"> (new)</span>}
      </Link>
      <span className="text-xs subtle nowrap">{item.time}</span>
    </li>
  );
}

export default function NotificationsPage() {
  usePageTitle('Notifications');
  const role = useRole();
  const notifications = useAppStore((state) => state.notifications[role]);
  const [filter, setFilter] = useState('all');
  const shown = notifications.filter((item) => filter === 'all' || item.kind === filter);
  const fresh = shown.filter((item) => item.unread);
  const earlier = shown.filter((item) => !item.unread);
  const anyUnread = notifications.some((item) => item.unread);

  return (
    <>
      <PageHeader
        title="Notifications"
        actions={
          <>
            {anyUnread && (
              <Button size="sm" onClick={() => useAppStore.getState().markAllNotificationsRead(role)}>
                <Icon name="check" size={16} />
                Mark all as read
              </Button>
            )}
            <ButtonLink size="sm" to="/settings/notifications">
              <Icon name="sliders" size={16} />
              Settings
            </ButtonLink>
          </>
        }
      />
      <div className="toolbar">
        <Segmented
          label="Show"
          value={filter}
          onChange={setFilter}
          items={FILTERS[role].map(([value, label]) => ({ value, label }))}
        />
      </div>
      <Card>
        {fresh.length > 0 && (
          <>
            <SubHeading>New</SubHeading>
            <List>
              {fresh.map((item) => (
                <NotificationRow key={item.id} item={item} role={role} />
              ))}
            </List>
          </>
        )}
        {earlier.length > 0 && (
          <>
            <SubHeading className={cx(fresh.length > 0 && styles.divided)}>Earlier</SubHeading>
            <List>
              {earlier.map((item) => (
                <NotificationRow key={item.id} item={item} role={role} />
              ))}
            </List>
          </>
        )}
        {!shown.length && <p className="empty">Nothing here.</p>}
      </Card>
    </>
  );
}
