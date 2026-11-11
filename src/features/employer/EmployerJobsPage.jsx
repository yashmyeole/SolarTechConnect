import { useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { Button, ButtonLink } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import Icon from '@/components/Icon';
import { Menu, MenuItem } from '@/components/Menu';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';
import { SegmentedNav } from '@/components/Segmented';
import { usePageTitle } from '@/lib/usePageTitle';
import { useAppStore } from '@/store';
import { toast } from '@/store/ui';
import { HoldNote, JobStatus } from './EmployerParts';
import styles from './employer.module.css';

const TABS = [
  ['open', 'Open', 'open'],
  ['drafts', 'Drafts', 'draft'],
  ['closed', 'Closed', 'closed'],
];

const MORE = [
  ['edit', 'Edit job', 'Editing opens the job form'],
  ['clock', 'Pause', 'Job paused. It no longer appears in search.'],
  ['doc', 'Duplicate', 'Copied into a new draft'],
  ['x', 'Close job', 'Job closed. Candidates are told the role is filled.'],
];

function RowAction({ job }) {
  if (job.status === 'draft') {
    return (
      <ButtonLink size="sm" to="/employer/jobs/new">
        Continue
      </ButtonLink>
    );
  }
  if (job.status === 'open') {
    return (
      <ButtonLink size="sm" to={`/employer/candidates?job=${job.id}`}>
        Candidates
      </ButtonLink>
    );
  }
  return (
    <Button size="sm" onClick={() => toast('Copied into a new draft')}>
      Repost
    </Button>
  );
}

export default function EmployerJobsPage() {
  const { status = 'open' } = useParams();
  const jobs = useAppStore((state) => state.employer.jobs);
  const [query, setQuery] = useState('');
  usePageTitle('Jobs');
  const tab = TABS.find(([key]) => key === status);
  if (!tab) return <Navigate to="/employer/jobs" replace />;

  const count = (value) => jobs.filter((job) => job.status === value).length;
  const shown = jobs.filter(
    (job) => job.status === tab[2] && job.title.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Jobs"
        subtitle="Everything you’ve posted."
        actions={
          <ButtonLink variant="primary" to="/employer/jobs/new">
            <Icon name="plus" size={18} />
            Post a job
          </ButtonLink>
        }
      />
      <HoldNote />
      <div className="toolbar">
        <SegmentedNav
          label="Job status"
          current={status}
          items={TABS.map(([key, label, value], index) => ({
            value: key,
            label,
            count: count(value),
            to: index ? `/employer/jobs/${key}` : '/employer/jobs',
          }))}
        />
        <span className="grow" />
        <SearchInput
          label="Search your jobs"
          className={styles.searchJobs}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <Card>
        {shown.length ? (
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Job</th>
                  <th scope="col">Status</th>
                  <th scope="col">Candidates</th>
                  <th scope="col">Views</th>
                  <th scope="col">{status === 'drafts' ? 'Edited' : 'Posted'}</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {shown.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <span className="strong">{job.title}</span>
                      <span className="block text-sm subtle">{job.location}</span>
                    </td>
                    <td>
                      <JobStatus status={job.status} />
                    </td>
                    <td className="tabular">
                      {job.newApplicants > 0 && <Chip tone="accent">{job.newApplicants} new</Chip>} {job.applicants}
                    </td>
                    <td className="tabular">{job.views}</td>
                    <td className="muted">{job.date}</td>
                    <td>
                      <div className={`row gap-4 ${styles.rowActions}`}>
                        <RowAction job={job} />
                        <Menu
                          label={`More actions for ${job.title}`}
                          trigger={(props) => (
                            <Button iconOnly size="sm" aria-label={`More actions for ${job.title}`} {...props}>
                              <Icon name="more" />
                            </Button>
                          )}
                        >
                          {MORE.map(([icon, label, message]) => (
                            <MenuItem key={label} icon={icon} onSelect={() => toast(message)}>
                              {label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty">{query ? `No jobs match “${query}”.` : 'Nothing here.'}</p>
        )}
      </Card>
    </>
  );
}
