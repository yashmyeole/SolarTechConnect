import Avatar from '@/components/Avatar';
import { Switch } from '@/components/Field';
import Icon from '@/components/Icon';
import { ListPane, PaneRow, RowLine, RowMeta, RowTitle } from '@/components/SplitView';
import { useDirectory } from '@/features/directory/useDirectory';
import { distanceLabel, formatPay, plural, postedAgo } from '@/lib/format';
import { useAppStore, useRole } from '@/store';
import { toast } from '@/store/ui';
import styles from './jobs.module.css';

export default function JobList({ jobs, selectedId, filters, onOpen }) {
  const role = useRole();
  const { company } = useDirectory();
  const savedJobIds = useAppStore((state) => state.savedJobIds);
  const applications = useAppStore((state) => state.applications);
  const jobAlert = useAppStore((state) => state.jobAlert);
  const pro = role === 'pro';

  const toggleAlert = (event) => {
    useAppStore.getState().setJobAlert(event.target.checked);
    toast(
      event.target.checked ? 'We’ll email you new jobs that match this search.' : 'Emails for this search turned off',
    );
  };

  return (
    <ListPane
      title={
        <p className="strong" role="status">
          {plural(jobs.length, 'job')} {filters.q && `for “${filters.q}” `}near {filters.location}
        </p>
      }
      action={
        pro && (
          <label className="row gap-8 text-sm muted" title="Email me new jobs that match this search">
            Email me
            <Switch checked={jobAlert} onChange={toggleAlert} aria-label="Email me new jobs that match this search" />
          </label>
        )
      }
    >
      {jobs.length ? (
        jobs.map((job) => {
          const applied = pro && applications.some((application) => application.jobId === job.id);
          return (
            <PaneRow key={job.id} selected={job.id === selectedId} onClick={() => onOpen(job.id)}>
              <Avatar name={company(job.companyId).name} company />
              <span className="grow">
                <RowTitle>{job.title}</RowTitle>
                <RowLine>
                  {company(job.companyId).name} · {job.city}
                </RowLine>
                <RowLine>
                  <b>{formatPay(job)}</b> · {distanceLabel(job)}
                </RowLine>
                <RowMeta>
                  {applied && <span className={styles.applied}>Applied · </span>}
                  {job.type} · {postedAgo(job.postedDaysAgo)}
                </RowMeta>
              </span>
              {pro && savedJobIds.includes(job.id) && (
                <span className="subtle" title="Saved">
                  <Icon name="bookmark" size={18} />
                  <span className="sr-only">Saved</span>
                </span>
              )}
            </PaneRow>
          );
        })
      ) : (
        <p className="empty">No jobs match these filters.</p>
      )}
    </ListPane>
  );
}
