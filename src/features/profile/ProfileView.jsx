import { useState } from 'react';
import { Link } from 'react-router';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { AvailableMark, Chip } from '@/components/Chip';
import Icon from '@/components/Icon';
import { List, ListItem } from '@/components/List';
import { Menu, MenuItem } from '@/components/Menu';
import Photo from '@/components/Photo';
import { MemberLink } from '@/features/directory/EntityLink';
import { useOpenConversation } from '@/features/directory/useOpenConversation';
import { firstName } from '@/lib/format';
import { useAppStore, useRole } from '@/store';
import { toast } from '@/store/ui';
import { AvailabilityDialog, ContactDialog, EditProfileDialog, LicenseDialog } from './ProfileDialogs';
import styles from './profile.module.css';

const ADD_ITEMS = [
  ['image', 'Work photos or a project', 'Add a project: title, photos, place and year'],
  ['briefcase', 'Job', 'Add a job: title, company, dates'],
  ['shield', 'License or certification'],
  ['plus', 'Skill', 'Add a skill from the trade skills list'],
  ['cap', 'Training', 'Add a school or training program'],
  ['users', 'Ask for a reference', 'Choose someone you have worked with'],
];

function AddToProfileMenu({ onAddLicense, trigger }) {
  return (
    <Menu label="Add to profile" trigger={trigger}>
      {ADD_ITEMS.map(([icon, label, message]) => (
        <MenuItem key={label} icon={icon} onSelect={() => (message ? toast(message) : onAddLicense())}>
          {label}
        </MenuItem>
      ))}
    </Menu>
  );
}

function Section({ title, own, add, onAddLicense, children }) {
  const action = !own ? null : add ? (
    <AddToProfileMenu
      onAddLicense={onAddLicense}
      trigger={(props) => (
        <Button variant="text" size="sm" {...props}>
          <Icon name="plus" size={16} />
          Add
        </Button>
      )}
    />
  ) : (
    <Button variant="text" size="sm" onClick={() => toast(`Edit ${title}: add, change, reorder or remove`)}>
      Edit
    </Button>
  );
  return (
    <Card>
      <CardHeader title={title} action={action} />
      <CardBody>{children}</CardBody>
    </Card>
  );
}

function ViewerActions({ profile }) {
  const role = useRole();
  const openConversation = useOpenConversation();
  const requested = useAppStore((state) => state.requestedMemberIds.includes(profile.id));
  const invited = useAppStore((state) => state.employer.invitedMemberIds.includes(profile.id));
  const verified = useAppStore((state) => state.employer.verified);
  const message = <Button onClick={() => openConversation(profile.id)}>Message</Button>;

  if (role === 'emp') {
    const invite = () => {
      useAppStore.getState().inviteToApply(profile.id);
      toast(`Invite sent to ${profile.name}. They’ll see the job in their messages.`);
    };
    return (
      <>
        <Button variant="primary" disabled={invited || !verified} onClick={invite}>
          {invited ? 'Invited' : 'Invite to apply'}
        </Button>
        {message}
        <Button onClick={() => toast('Added to your shortlist')}>Shortlist</Button>
      </>
    );
  }

  const toggleRequest = () => {
    const sent = useAppStore.getState().toggleContactRequest(profile.id);
    toast(sent ? `Contact request sent to ${profile.name}` : 'Request withdrawn');
  };
  return (
    <>
      <Button variant={requested ? 'secondary' : 'primary'} on={requested} onClick={toggleRequest}>
        {requested ? (
          'Request sent'
        ) : (
          <>
            <Icon name="plus" size={18} />
            Add contact
          </>
        )}
      </Button>
      {message}
    </>
  );
}

export default function ProfileView({ profile, own = false, showActions = true }) {
  const [dialog, setDialog] = useState(null);
  const close = () => setDialog(null);
  const addLicense = () => setDialog('license');

  return (
    <>
      <Card className={styles.header}>
        <Avatar name={profile.name} size={96} />
        <div className="grow">
          <h1 className="h1">{profile.name}</h1>
          <p className={`mt-4 ${styles.headline}`}>{profile.headline}</p>
          <p className="text-sm muted mt-4">
            {profile.city}
            <span className="sep">{profile.contacts} contacts</span>
            <span className="sep" />
            <button type="button" className="link" onClick={() => setDialog('contact')}>
              Contact details
            </button>
          </p>
          {profile.available && (
            <p className="mt-8">
              <AvailableMark />
            </p>
          )}
        </div>
        {showActions && (
          <div className={styles.actions}>
            {own ? (
              <>
                <Button variant="primary" onClick={() => setDialog('edit')}>
                  <Icon name="edit" size={18} />
                  Edit profile
                </Button>
                <AddToProfileMenu
                  onAddLicense={addLicense}
                  trigger={(props) => (
                    <Button {...props}>
                      <Icon name="plus" size={18} />
                      Add to profile
                    </Button>
                  )}
                />
                <Button iconOnly aria-label="Copy profile link" onClick={() => toast('Profile link copied')}>
                  <Icon name="send" />
                </Button>
              </>
            ) : (
              <ViewerActions profile={profile} />
            )}
          </div>
        )}
      </Card>

      <div className="layout-main-aside mt-16">
        <div className="stack">
          <Section title="About" own={own}>
            <p className="measure">{profile.about}</p>
          </Section>
          {own && (
            <Section title="Work photos" own add onAddLicense={addLicense}>
              <div className={styles.gallery}>
                {profile.photos.map((photo) => (
                  <figure key={photo.title}>
                    <Photo tone={photo.tone} />
                    <figcaption>
                      <span className="strong block">{photo.title}</span>
                      <span className="text-sm subtle">{photo.caption}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Section>
          )}
          <Section title="Experience" own={own} add onAddLicense={addLicense}>
            {profile.experience.map((entry) => (
              <div key={entry.title + entry.dates} className={styles.entry}>
                <Avatar name={entry.company} company />
                <div className="grow">
                  <p className="strong">{entry.title}</p>
                  <p className="text-sm">
                    {entry.company} · {entry.type}
                  </p>
                  <p className="text-sm subtle">
                    {entry.dates} · {entry.place}
                  </p>
                  {entry.summary && <p className="mt-8 muted">{entry.summary}</p>}
                </div>
              </div>
            ))}
          </Section>
          <Section title="Training and education" own={own} add onAddLicense={addLicense}>
            {profile.training.map((entry) => (
              <div key={entry.school} className={styles.entry}>
                <Avatar name={entry.school} company />
                <div>
                  <p className="strong">{entry.school}</p>
                  <p className="text-sm">{entry.program}</p>
                  <p className="text-sm subtle">{entry.years}</p>
                </div>
              </div>
            ))}
          </Section>
          {profile.reference && (
            <Section title="References" own={own} add onAddLicense={addLicense}>
              <div className="row row-top">
                <Avatar name="DeShawn Carter" />
                <div>
                  <p>“{profile.reference.quote}”</p>
                  <p className="text-sm muted mt-8">
                    <MemberLink id={profile.reference.memberId} /> · {profile.reference.context}
                  </p>
                </div>
              </div>
            </Section>
          )}
        </div>

        <aside className="stack">
          {profile.available ? (
            <Card>
              <CardHeader
                title="Availability"
                action={
                  own && (
                    <Button variant="text" size="sm" onClick={() => setDialog('availability')}>
                      Edit
                    </Button>
                  )
                }
              />
              <CardBody>
                <p>{profile.availability}</p>
                {own && (
                  <p className="text-sm subtle mt-8">
                    Shown to verified employers.{' '}
                    <Link className="link" to="/settings/privacy">
                      Change who sees this
                    </Link>
                  </p>
                )}
              </CardBody>
            </Card>
          ) : (
            own && (
              <Card padded>
                <p className="strong">Not showing as available</p>
                <Button size="sm" className="mt-8" onClick={() => setDialog('availability')}>
                  Show I’m available
                </Button>
              </Card>
            )
          )}
          <Card>
            <CardHeader
              title="Licenses and certifications"
              action={
                own && (
                  <Button variant="text" size="sm" onClick={addLicense}>
                    <Icon name="plus" size={16} />
                    Add
                  </Button>
                )
              }
            />
            <List className="mt-8">
              {profile.licenses.length ? (
                profile.licenses.map((license) => (
                  <ListItem key={license.certification} top className={styles.license}>
                    <Icon name="shield" size={18} className="subtle" />
                    <span className="grow">
                      <span className="strong block">{license.name}</span>
                      {(license.issuer || license.date) && (
                        <span className="text-sm subtle">
                          {[license.issuer, license.date].filter(Boolean).join(' · ')}
                        </span>
                      )}
                    </span>
                  </ListItem>
                ))
              ) : (
                <ListItem className="muted">None listed.</ListItem>
              )}
            </List>
            <p className={`text-sm subtle ${styles.footnote}`}>
              Listed by {own ? 'you' : firstName(profile.name)}. Employers may ask to see the cards.
            </p>
          </Card>
          <Section title="Skills" own={own}>
            <div className="row row-wrap gap-8">
              {profile.skills.map(([skill, count]) => (
                <Chip key={skill} className={styles.skill}>
                  {skill}
                  <span className={styles.skillCount}>{count}</span>
                </Chip>
              ))}
            </div>
            <p className="text-sm subtle mt-12">Numbers show how many coworkers confirmed each skill.</p>
          </Section>
          {own && (
            <Section title="Languages" own>
              <p>{profile.languages}</p>
            </Section>
          )}
        </aside>
      </div>

      {dialog === 'edit' && <EditProfileDialog onClose={close} />}
      {dialog === 'availability' && <AvailabilityDialog onClose={close} />}
      {dialog === 'license' && <LicenseDialog onClose={close} />}
      {dialog === 'contact' && <ContactDialog slug={profile.id} onClose={close} />}
    </>
  );
}
