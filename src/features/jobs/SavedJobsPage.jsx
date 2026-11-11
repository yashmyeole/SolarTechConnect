import { useState } from 'react';
import { Link } from 'react-router';
import Avatar from '@/components/Avatar';
import { Button, ButtonLink } from '@/components/Button';
import { Card, CardHeader } from '@/components/Card';
import Icon from '@/components/Icon';
import { List, ListItem } from '@/components/List';
import { findJob } from '@/data/jobs';
import { useDirectory } from '@/features/directory/useDirectory';
import { formatPay } from '@/lib/format';
import { usePageTitle } from '@/lib/usePageTitle';
import { useAppStore } from '@/store';
import { toast } from '@/store/ui';
import JobsHeader from './JobsHeader';

const SAVED_SEARCHES = [
  {
    id: 'installer',
    label: 'PV Installer · within 50 mi of Chicago · $25+/hr',
    detail: 'Emails daily · 3 new this week',
  },
  { id: 'crew-lead', label: 'Crew Lead · any distance', detail: 'Emails weekly · 1 new this week' },
];

export default function SavedJobsPage() {
  usePageTitle('Saved jobs');
  const { company } = useDirectory();
  const savedJobIds = useAppStore((state) => state.savedJobIds);
  const [searches, setSearches] = useState(SAVED_SEARCHES);
  const jobs = savedJobIds.map(findJob);

  const unsave = (job) => {
    useAppStore.getState().toggleSavedJob(job.id);
    toast('Removed from saved jobs');
  };

  return (
    <>
      <JobsHeader current="saved" />
      <Card>
        {jobs.length ? (
          <List>
            {jobs.map((job) => (
              <ListItem key={job.id}>
                <Avatar name={company(job.companyId).name} company />
                <span className="grow">
                  <Link className="strong hover-underline" to={`/jobs/${job.id}`}>
                    {job.title}
                  </Link>
                  <span className="block text-sm muted">
                    {company(job.companyId).name} · {job.city} · <b className="strong">{formatPay(job)}</b>
                  </span>
                </span>
                <ButtonLink size="sm" to={`/jobs/${job.id}`}>
                  View
                </ButtonLink>
                <Button iconOnly size="sm" aria-label={`Remove ${job.title} from saved`} onClick={() => unsave(job)}>
                  <Icon name="x" size={18} />
                </Button>
              </ListItem>
            ))}
          </List>
        ) : (
          <p className="empty">Nothing saved yet. Save a job to come back to it later.</p>
        )}
      </Card>
      <Card className="mt-16">
        <CardHeader title="Saved searches" />
        <List className="mt-8">
          {searches.map((search) => (
            <ListItem key={search.id}>
              <span className="grow">
                <span className="strong block">{search.label}</span>
                <span className="text-sm subtle">{search.detail}</span>
              </span>
              <Button
                variant="quiet"
                size="sm"
                onClick={() => {
                  setSearches(searches.filter((item) => item.id !== search.id));
                  toast('Saved search removed');
                }}
              >
                Remove
              </Button>
            </ListItem>
          ))}
          {!searches.length && <li className="empty">No saved searches. Turn on “Email me” on a search to save it.</li>}
        </List>
      </Card>
    </>
  );
}
