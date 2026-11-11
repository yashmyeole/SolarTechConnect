import { Link } from 'react-router';
import Avatar from '@/components/Avatar';
import { ButtonLink } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { List } from '@/components/List';
import Note from '@/components/Note';
import { findJob } from '@/data/jobs';
import { APPLICATION_STAGES } from '@/data/options';
import { useDirectory } from '@/features/directory/useDirectory';
import { usePageTitle } from '@/lib/usePageTitle';
import { useAppStore } from '@/store';
import ApplicationTracker from './ApplicationTracker';
import JobsHeader from './JobsHeader';
import styles from './jobs.module.css';

export default function ApplicationsPage() {
  usePageTitle('Applications');
  const { company } = useDirectory();
  const applications = useAppStore((state) => state.applications);

  return (
    <>
      <JobsHeader current="applied" />
      <Card>
        {applications.length ? (
          <List>
            {applications.map((application) => {
              const job = findJob(application.jobId);
              const name = company(job.companyId).name;
              return (
                <li key={job.id} className={styles.application}>
                  <div className="row row-top">
                    <Avatar name={name} company />
                    <div className="grow">
                      <Link className="strong hover-underline" to={`/jobs/${job.id}`}>
                        {job.title}
                      </Link>
                      <p className="text-sm muted">
                        {name} · Applied {application.appliedOn}
                      </p>
                    </div>
                    <Chip tone={application.stage >= 3 ? 'accent' : undefined}>
                      {APPLICATION_STAGES[application.stage]}
                    </Chip>
                  </div>
                  <ApplicationTracker stage={application.stage} />
                  {application.interview && (
                    <Note
                      tone="info"
                      icon="calendar"
                      className="mt-12"
                      action={
                        <ButtonLink size="sm" to={`/messages/${application.threadId}`}>
                          Open conversation
                        </ButtonLink>
                      }
                    >
                      {application.interview}
                    </Note>
                  )}
                </li>
              );
            })}
          </List>
        ) : (
          <p className="empty">You haven’t applied to anything yet.</p>
        )}
      </Card>
    </>
  );
}
