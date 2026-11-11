import { useState } from 'react';
import Avatar from '@/components/Avatar';
import { Button, ButtonLink } from '@/components/Button';
import { Card, CardHeader } from '@/components/Card';
import Checklist from '@/components/Checklist';
import { Dialog, DialogActions, DialogBody, DialogFooter } from '@/components/Dialog';
import { FieldStack, RequiredLegend, SelectField, Switch, TextField } from '@/components/Field';
import Icon from '@/components/Icon';
import IconCircle from '@/components/IconCircle';
import Note from '@/components/Note';
import { OWN_COMPANY_ID } from '@/data/companies';
import { LEGAL } from '@/data/options';
import { useForm } from '@/lib/useForm';
import { email, required, strongPassword } from '@/lib/validation';
import { useAppStore, useCompanies, usePersona, useRole } from '@/store';
import { toast } from '@/store/ui';
import { SettingRow, SettingsCard, SettingToggle } from './SettingsParts';
import styles from './settings.module.css';

const useSettings = () => useAppStore((state) => state.settings);

function toggleSetting(key, on, [onMessage, offMessage]) {
  useAppStore.getState().setSetting(key, on);
  toast(on ? onMessage : offMessage);
}

export function AccountSettings({ edit }) {
  const role = useRole();
  const persona = usePersona();
  const settings = useSettings();
  const [closing, setClosing] = useState(false);
  const update = (key) => (value) => useAppStore.getState().updateProfile(role, { [key]: value });

  return (
    <>
      <SettingsCard title="Your details">
        <SettingRow label="Name" value={persona.name} onAction={() => edit('name', persona.name, update('name'))} />
        <SettingRow
          label="Headline"
          description="Shown under your name"
          value={persona.headline.split(' · ')[0]}
          onAction={() => edit('headline', persona.headline, update('headline'))}
        />
        <SettingRow label="Location" value={persona.city} onAction={() => edit('city', persona.city, update('city'))} />
      </SettingsCard>
      <SettingsCard title="Preferences">
        <SettingRow
          label="Language"
          value={settings.language}
          onAction={() =>
            edit('language', settings.language, (value) => useAppStore.getState().setSetting('language', value))
          }
        />
        <SettingRow
          label="Time zone"
          value={settings.timeZone}
          onAction={() =>
            edit('timeZone', settings.timeZone, (value) => useAppStore.getState().setSetting('timeZone', value))
          }
        />
      </SettingsCard>
      <SettingsCard title="Close your account" danger>
        <SettingRow
          description={`Removes your profile, updates and messages. ${
            role === 'emp' ? 'Open jobs close.' : 'Employers keep applications you already sent.'
          }`}
        >
          <Button variant="danger" size="sm" onClick={() => setClosing(true)}>
            Close account
          </Button>
        </SettingRow>
      </SettingsCard>
      {closing && (
        <Dialog title="Close your account?" onClose={() => setClosing(false)}>
          <DialogBody>
            <p>
              Your profile, updates and messages will be removed.{' '}
              {role === 'emp'
                ? 'Open jobs close and candidates are told the roles are filled.'
                : 'Employers keep the applications you already sent.'}
            </p>
            <p className="muted mt-12">You can download your data first under Settings, Privacy.</p>
          </DialogBody>
          <DialogFooter>
            <Button variant="quiet" onClick={() => setClosing(false)} data-autofocus>
              Keep my account
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setClosing(false);
                toast('In this demo your account stays open');
              }}
            >
              Close account
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
}

function ChangePasswordForm({ onDone }) {
  const form = useForm(
    { current: '', password: '', confirm: '' },
    {
      current: required('Enter your current password.'),
      password: [required('Enter a new password.'), strongPassword()],
      confirm: [
        required('Enter the new password again.'),
        (value, values) => (value !== values.password ? 'The passwords don’t match.' : ''),
      ],
    },
  );
  const submit = form.handleSubmit(() => {
    onDone();
    toast('Password changed. Other devices were signed out.');
  });
  return (
    <form className={styles.passwordForm} onSubmit={submit} noValidate>
      <FieldStack>
        <RequiredLegend />
        <TextField
          {...form.field('current')}
          label="Current password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
        />
        <TextField
          {...form.field('password')}
          label="New password"
          type="password"
          autoComplete="new-password"
          required
          hint="At least 8 characters with a number and a symbol."
        />
        <TextField
          {...form.field('confirm')}
          label="New password again"
          type="password"
          autoComplete="new-password"
          required
        />
        <div className="row row-wrap gap-8">
          <Button type="submit" variant="primary">
            Save password
          </Button>
          <Button variant="quiet" onClick={() => toast('We sent a reset link to your email')}>
            Email me a reset link instead
          </Button>
        </div>
      </FieldStack>
    </form>
  );
}

export function SecuritySettings({ edit }) {
  const role = useRole();
  const persona = usePersona();
  const { twoStep } = useSettings();
  const [changingPassword, setChangingPassword] = useState(false);

  return (
    <>
      <SettingsCard title="How you sign in">
        <SettingRow
          label="Email"
          description="Used to sign in"
          value={persona.email}
          onAction={() => edit('email', '', () => {})}
        />
        <SettingRow
          label="Mobile number"
          description="For sign-in codes"
          value={persona.phone}
          onAction={() =>
            edit('phone', persona.phone, (phone) => useAppStore.getState().updateProfile(role, { phone }))
          }
        />
        <SettingRow
          label="Password"
          description="Last changed 3 months ago"
          actionLabel={changingPassword ? 'Cancel' : 'Change'}
          onAction={() => setChangingPassword(!changingPassword)}
        />
        {changingPassword && <ChangePasswordForm onDone={() => setChangingPassword(false)} />}
        <SettingToggle
          label="Two-step sign-in"
          description={
            twoStep
              ? 'On. We text a code when you sign in on a new device.'
              : 'Off. Add a text code for extra security.'
          }
          checked={twoStep}
          onChange={(on) =>
            toggleSetting('twoStep', on, [
              'Two-step sign-in is on. We’ll text a code on new devices.',
              'Two-step sign-in is off',
            ])
          }
        />
        <SettingRow
          label="Google"
          description="Connected for one-click sign-in"
          actionLabel="Disconnect"
          onAction={() => toast('Google disconnected. Use your password to sign in.')}
        />
      </SettingsCard>
      <SettingsCard title="Signed-in devices">
        <SettingRow
          leading={<IconCircle name="globe" size={18} />}
          label="Chrome on Windows"
          description={
            <>
              Chicago, IL · <span className={styles.thisDevice}>This device</span>
            </>
          }
        />
        <SettingRow
          leading={<IconCircle name="phone" size={18} />}
          label="Android app"
          description="Chicago, IL · 2 hours ago"
          actionLabel="Sign out"
          onAction={() => toast('Signed out of the Android app')}
        />
      </SettingsCard>
    </>
  );
}

export function PrivacySettings({ edit }) {
  const role = useRole();
  const settings = useSettings();
  const availability = useAppStore((state) => state.availability);
  const [dataInfo, setDataInfo] = useState(false);
  const set = (key) => (value) => useAppStore.getState().setSetting(key, value);

  return (
    <>
      {role === 'pro' && (
        <SettingsCard title="Who can see you">
          <SettingRow
            label="Your profile"
            description="Who can see your full profile"
            value={settings.profileVisibility}
            onAction={() => edit('profileVisibility', settings.profileVisibility, set('profileVisibility'))}
          />
          <SettingToggle
            label="Public link"
            description="Anyone with the link can see your profile without signing in."
            checked={settings.publicProfile}
            onChange={(on) => toggleSetting('publicProfile', on, ['Public link is on', 'Public link is off'])}
          />
          <SettingToggle
            label="Show I’m available for work"
            description="Verified employers see your availability, start date and travel distance."
            checked={availability.open}
            onChange={(open) => {
              useAppStore.getState().setAvailability({ ...availability, open });
              toast(open ? 'You’re shown as available for work' : 'You’re no longer shown as available');
            }}
          />
          <SettingToggle
            label="Appear in employer talent search"
            description="Turn off to be found only by companies you apply to."
            checked={settings.appearInSearch}
            onChange={(on) =>
              toggleSetting('appearInSearch', on, [
                'You appear in talent search',
                'You no longer appear in talent search',
              ])
            }
          />
          <SettingToggle
            label="Invites from employers you haven’t applied to"
            description="Only verified employers can send these, with a monthly limit."
            checked={settings.employerInvites}
            onChange={(on) =>
              toggleSetting('employerInvites', on, [
                'Employers can invite you to apply',
                'Invites from new employers turned off',
              ])
            }
          />
        </SettingsCard>
      )}
      <SettingsCard title="Messages">
        <SettingRow
          label="Who can message you"
          value={settings.messagesFrom[role]}
          onAction={() =>
            edit('messagesFrom', settings.messagesFrom[role], (value) =>
              useAppStore.getState().setSetting('messagesFrom', { ...settings.messagesFrom, [role]: value }),
            )
          }
        />
        <SettingRow
          label="Contact requests"
          value={settings.requestsFrom}
          onAction={() => edit('requestsFrom', settings.requestsFrom, set('requestsFrom'))}
        />
      </SettingsCard>
      <SettingsCard title="Your data">
        <SettingRow
          label="Download your data"
          description="Profile, messages and applications"
          actionLabel="Request"
          onAction={() => toast('We’ll email a download link within 24 hours')}
        />
        <SettingRow
          label={role === 'pro' ? 'Résumé' : 'Candidate data'}
          description={role === 'pro' ? 'Shared only with jobs you apply to' : 'Kept for 2 years after a job closes'}
          actionLabel="Details"
          onAction={() => setDataInfo(true)}
        />
        <SettingRow
          label="Uploaded files"
          description="Private. Only you and employers you apply to can open them; links expire after 15 minutes."
        />
        <SettingRow
          description={
            <>
              <a className="link" href={LEGAL.privacy}>
                Privacy policy
              </a>{' '}
              ·{' '}
              <a className="link" href={LEGAL.terms}>
                Terms
              </a>
            </>
          }
        />
      </SettingsCard>
      {dataInfo && (
        <Dialog title={role === 'pro' ? 'Résumé' : 'Candidate data'} onClose={() => setDataInfo(false)}>
          <DialogBody>
            <p className="muted">
              {role === 'pro'
                ? 'Your résumé goes only to employers you apply to. You can delete it any time; employers keep the copy you sent them.'
                : 'Applications are kept for 2 years after a job closes, then deleted.'}
            </p>
          </DialogBody>
        </Dialog>
      )}
    </>
  );
}

const NOTIFICATION_TYPES = {
  pro: [
    'Application updates',
    'Messages',
    'New jobs for saved searches',
    'Contact requests',
    'Replies to your updates',
    'Events and courses',
  ],
  emp: ['New candidates', 'Messages', 'Interview reminders', 'Company page activity', 'Team activity'],
};
const CHANNELS = [
  ['app', 'In the app'],
  ['email', 'Email'],
  ['text', 'Text'],
];
const defaultOn = (row, channel) =>
  channel === 'app' || (channel === 'email' && row < 3) || (channel === 'text' && row < 1);

export function NotificationSettings() {
  const role = useRole();
  const settings = useSettings();
  return (
    <>
      <Card>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" className={styles.first}>
                  Tell me about
                </th>
                {CHANNELS.map(([key, label]) => (
                  <th key={key} scope="col">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NOTIFICATION_TYPES[role].map((type, row) => (
                <tr key={type}>
                  <th scope="row">{type}</th>
                  {CHANNELS.map(([channel, label]) => {
                    const key = `${type}:${channel}`;
                    return (
                      <td key={channel}>
                        <Switch
                          aria-label={`${type}: ${label.toLowerCase()}`}
                          checked={settings.notify[key] ?? defaultOn(row, channel)}
                          onChange={(event) => useAppStore.getState().setNotifyPreference(key, event.target.checked)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <SettingsCard title="Email summary">
        <SettingToggle
          label="Weekly summary"
          description="One email on Mondays with what you missed."
          checked={settings.weeklySummary}
          onChange={(on) => toggleSetting('weeklySummary', on, ['Weekly summary on', 'Weekly summary off'])}
        />
      </SettingsCard>
    </>
  );
}

export function CompanySettings({ edit }) {
  const verified = useAppStore((state) => state.employer.verified);
  const company = useCompanies()[OWN_COMPANY_ID];
  const update = (key) => (value) => useAppStore.getState().updateCompany(OWN_COMPANY_ID, { [key]: value });

  return (
    <>
      <Note tone={verified ? 'ok' : 'warn'}>
        <b>{verified ? 'Verified on November 2, 2026.' : 'In review.'}</b>{' '}
        {verified
          ? 'Your jobs and company page show the Verified employer mark.'
          : 'A person is checking your business, usually within 1 business day. Jobs and invites are held until then.'}
      </Note>
      <SettingsCard title="Business check">
        <Checklist
          className={styles.roles}
          items={[
            'Work email confirmed with a code',
            `Email domain matches ${company.site}`,
            'Found in the Illinois business register',
          ].map((label, index) => ({ label, status: verified || index === 0 ? 'ok' : 'hold' }))}
        />
      </SettingsCard>
      <SettingsCard title="Company details">
        <SettingRow
          label="Company name"
          description="Changing it sends the business for a quick re-check"
          value={company.name}
          onAction={() => edit('companyName', company.name, update('name'))}
        />
        <SettingRow label="Website" value={company.site} onAction={() => edit('site', company.site, update('site'))} />
        <SettingRow label="Size" value={company.size} onAction={() => edit('size', company.size, update('size'))} />
        <SettingRow
          label="Headquarters"
          value={company.city}
          onAction={() => edit('headquarters', company.city, update('city'))}
        />
        <SettingRow label="Company page" description="Logo, description and photos">
          <ButtonLink variant="text" size="sm" to={`/companies/${OWN_COMPANY_ID}`}>
            Open
          </ButtonLink>
        </SettingRow>
      </SettingsCard>
    </>
  );
}

function InviteTeammateDialog({ domain, onClose }) {
  const form = useForm(
    { email: '', role: 'Hiring manager' },
    {
      email: [
        required('Enter their work email.'),
        email(),
        (value) => (value && !value.trim().toLowerCase().endsWith(`@${domain}`) ? `Use an address at ${domain}.` : ''),
      ],
    },
  );
  const submit = form.handleSubmit((values) => {
    useAppStore.getState().inviteTeammate(values.email.trim(), values.role);
    onClose();
    toast('Invitation sent');
  });
  return (
    <Dialog title="Invite a teammate" onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <DialogBody>
          <FieldStack>
            <RequiredLegend />
            <TextField
              {...form.field('email')}
              label="Work email"
              type="email"
              required
              hint={`Must use your company domain, ${domain}.`}
              data-autofocus
            />
            <SelectField
              {...form.field('role')}
              label="Role"
              options={['Hiring manager', 'Interviewer', 'Admin']}
              placeholder={false}
              required
            />
          </FieldStack>
        </DialogBody>
        <DialogActions onCancel={onClose} submitLabel="Send invite" />
      </form>
    </Dialog>
  );
}

export function TeamSettings() {
  const persona = usePersona();
  const team = useAppStore((state) => state.employer.team);
  const company = useCompanies()[OWN_COMPANY_ID];
  const [inviting, setInviting] = useState(false);

  return (
    <>
      <Card>
        <CardHeader
          title="Team members"
          action={
            <Button size="sm" onClick={() => setInviting(true)}>
              <Icon name="plus" size={16} />
              Invite
            </Button>
          }
        />
        <div className={`${styles.tableScroll} mt-12`}>
          <table className={`${styles.table} ${styles.team}`}>
            <thead>
              <tr>
                <th scope="col" className={styles.first}>
                  Name
                </th>
                <th scope="col">Role</th>
                <th scope="col">Last active</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {team.map((member) => {
                const name = member.isYou ? persona.name : member.name;
                return (
                  <tr key={name}>
                    <td className={styles.first}>
                      <span className="row gap-8">
                        <Avatar name={name} size={32} />
                        {name}
                      </span>
                    </td>
                    <td>{member.role}</td>
                    <td className="muted">{member.lastActive}</td>
                    <td>
                      {member.isYou ? (
                        <span className="text-sm subtle">You</span>
                      ) : (
                        <Button variant="text" size="sm" onClick={() => toast(`Change role or remove ${name}`)}>
                          Manage
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <SettingsCard title="What each role can do">
        <dl className={`kv ${styles.roles}`}>
          <dt>Admin</dt>
          <dd>Everything, including team, billing and the company page</dd>
          <dt>Hiring manager</dt>
          <dd>Posts jobs and moves candidates</dd>
          <dt>Interviewer</dt>
          <dd>Sees assigned candidates and adds notes</dd>
        </dl>
      </SettingsCard>
      {inviting && <InviteTeammateDialog domain={company.site} onClose={() => setInviting(false)} />}
    </>
  );
}
