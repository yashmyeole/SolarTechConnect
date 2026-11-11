import { Link } from 'react-router';
import Avatar from '@/components/Avatar';
import { Button, ButtonLink } from '@/components/Button';
import { Card, CardHeader } from '@/components/Card';
import Checklist from '@/components/Checklist';
import { Chip } from '@/components/Chip';
import DateBadge from '@/components/DateBadge';
import Icon from '@/components/Icon';
import { List, ListItem } from '@/components/List';
import PageHeader from '@/components/PageHeader';
import { EVENTS } from '@/data/community';
import { findJob } from '@/data/jobs';
import { APPLICATION_STAGES } from '@/data/options';
import { PRO_PROFILE } from '@/data/personas';
import { useDirectory } from '@/features/directory/useDirectory';
import UpdatesCard from '@/features/feed/UpdatesCard';
import JobLinkItem from '@/features/jobs/JobLinkItem';
import { firstName, greeting, todayLong } from '@/lib/format';
import { usePageTitle } from '@/lib/usePageTitle';
import { useAppStore, usePersona } from '@/store';
import { toast } from '@/store/ui';
import styles from './home.module.css';

const MATCHING_JOB_IDS = [1, 4, 8];

function NextUp({ application }) {
  const { company } = useDirectory();
  const job = findJob(application.jobId);
  return (
    <Card padded>
      <div className="row row-top">
        <Icon name="calendar" size={22} />
        <div className="grow">
          <p className="text-sm subtle">Next up</p>
          <p className={`strong ${styles.nextUp}`}>{application.interview}</p>
          <p className="text-sm muted">
            {job.title} · {company(job.companyId).name}
          </p>
          <div className="row row-wrap gap-8 mt-12">
            <ButtonLink variant="primary" size="sm" to={`/messages/${application.threadId}`}>
              Open conversation
            </ButtonLink>
            <Button size="sm" onClick={() => toast('Added to your calendar')}>
              Add to calendar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ProfileProgress() {
  const persona = usePersona();
  const addedLicense = useAppStore((state) => state.licenses.length > PRO_PROFILE.licenses.length);
  const complete = addedLicense ? 85 : 80;
  return (
    <Card padded>
      <div className="row">
        <Avatar name={persona.name} size={56} />
        <div className="grow">
          <Link className="strong hover-underline" to="/profile">
            {persona.name}
          </Link>
          <p className="text-sm muted">{persona.headline.split(' · ')[0]}</p>
        </div>
      </div>
      <div className="row row-between text-sm mt-16">
        <span className="muted">Profile {complete}% complete</span>
        <Link className="link" to="/profile">
          Edit
        </Link>
      </div>
      <div className={`${styles.meter} mt-4`} role="img" aria-label={`Profile ${complete}% complete`}>
        <i style={{ width: `${complete}%` }} />
      </div>
      <Checklist
        className="mt-12 text-sm"
        items={[
          { status: '', label: 'Add photos of two jobs you’ve worked on' },
          { status: '', label: 'Ask a coworker for a reference' },
        ]}
      />
      <p className={`text-sm muted mt-12 ${styles.views}`}>
        <b className="strong">7 employers</b> looked at your profile this week.
      </p>
    </Card>
  );
}

function RecentApplications({ applications }) {
  const { company } = useDirectory();
  return (
    <Card>
      <CardHeader
        title="Your applications"
        action={
          <ButtonLink variant="text" size="sm" to="/jobs/applied">
            All
          </ButtonLink>
        }
      />
      <List className="mt-8">
        {applications.slice(0, 3).map((application) => {
          const job = findJob(application.jobId);
          return (
            <ListItem key={job.id} to={`/jobs/${job.id}`}>
              <span className="grow">
                <span className="strong block">{job.title}</span>
                <span className="text-sm subtle">{company(job.companyId).name}</span>
              </span>
              <Chip tone={application.stage >= 3 ? 'accent' : undefined}>{APPLICATION_STAGES[application.stage]}</Chip>
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
}

function ComingUp() {
  return (
    <Card>
      <CardHeader
        title="Coming up"
        action={
          <ButtonLink variant="text" size="sm" to="/community/events">
            Events
          </ButtonLink>
        }
      />
      <List className="mt-8">
        {EVENTS.slice(0, 2).map((event) => (
          <ListItem key={event.id}>
            <DateBadge month={event.month} day={event.day} />
            <span className="grow">
              <span className="strong block">{event.name}</span>
              <span className="text-sm subtle">{event.when}</span>
            </span>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

export default function HomePage() {
  usePageTitle('Home');
  const persona = usePersona();
  const applications = useAppStore((state) => state.applications);
  const interview = applications.find((application) => application.interview);

  return (
    <>
      <PageHeader title={`${greeting()}, ${firstName(persona.name)}`} subtitle={todayLong()} />
      <div className="layout-main-aside">
        <div className="stack">
          {interview && <NextUp application={interview} />}
          <Card>
            <CardHeader
              title="Jobs that match you"
              action={
                <ButtonLink variant="text" size="sm" to="/jobs">
                  See all
                </ButtonLink>
              }
            />
            <List className="mt-8">
              {MATCHING_JOB_IDS.map((id) => (
                <JobLinkItem key={id} job={findJob(id)} />
              ))}
            </List>
          </Card>
          <UpdatesCard />
        </div>
        <aside className="stack">
          <ProfileProgress />
          <RecentApplications applications={applications} />
          <ComingUp />
        </aside>
      </div>
    </>
  );
}
