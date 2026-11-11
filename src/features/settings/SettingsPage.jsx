import { useState } from 'react';
import { Navigate, useParams } from 'react-router';
import PageHeader from '@/components/PageHeader';
import { SegmentedNav } from '@/components/Segmented';
import { usePageTitle } from '@/lib/usePageTitle';
import { useRole } from '@/store';
import { SettingEditDialog } from './SettingDialogs';
import {
  AccountSettings,
  CompanySettings,
  NotificationSettings,
  PrivacySettings,
  SecuritySettings,
  TeamSettings,
} from './SettingsSections';
import styles from './settings.module.css';

const SECTIONS = {
  account: ['Account', AccountSettings],
  security: ['Sign-in', SecuritySettings],
  privacy: ['Privacy', PrivacySettings],
  notifications: ['Notifications', NotificationSettings],
  company: ['Company', CompanySettings],
  team: ['Team', TeamSettings],
};

const ORDER = {
  pro: ['account', 'security', 'privacy', 'notifications'],
  emp: ['account', 'security', 'company', 'team', 'notifications', 'privacy'],
};

export default function SettingsPage() {
  const { section = 'account' } = useParams();
  const role = useRole();
  const [editing, setEditing] = useState(null);
  usePageTitle('Settings');

  if (!ORDER[role].includes(section)) return <Navigate to="/settings" replace />;
  const Section = SECTIONS[section][1];
  const edit = (editorKey, value, onSave) => setEditing({ editorKey, value, onSave });

  return (
    <>
      <PageHeader title="Settings" />
      <div className="toolbar">
        <SegmentedNav
          label="Settings area"
          current={section}
          items={ORDER[role].map((key, index) => ({
            value: key,
            label: SECTIONS[key][0],
            to: index ? `/settings/${key}` : '/settings',
          }))}
        />
      </div>
      <div className={`stack ${styles.content}`}>
        <Section edit={edit} />
      </div>
      {editing && <SettingEditDialog {...editing} role={role} onClose={() => setEditing(null)} />}
    </>
  );
}
