import { Fragment } from 'react';
import { Navigate, useParams } from 'react-router';
import Avatar from '@/components/Avatar';
import { Button, ButtonLink } from '@/components/Button';
import { Card, CardBody, CardHeader } from '@/components/Card';
import Checklist from '@/components/Checklist';
import { Chip, VerifiedMark } from '@/components/Chip';
import Icon from '@/components/Icon';
import { List, ListItem } from '@/components/List';
import Note from '@/components/Note';
import { SegmentedNav } from '@/components/Segmented';
import { OWN_COMPANY_ID } from '@/data/companies';
import { JOBS } from '@/data/jobs';
import { MEMBERS } from '@/data/people';
import { MemberLink } from '@/features/directory/EntityLink';
import NotFoundPage from '@/features/errors/NotFoundPage';
import UpdateCard from '@/features/feed/UpdateCard';
import JobLinkItem from '@/features/jobs/JobLinkItem';
import { formatCount } from '@/lib/format';
import { usePageTitle } from '@/lib/usePageTitle';
import { useAppStore, useCompanies, useRole } from '@/store';
import { toast } from '@/store/ui';
import { useFollow } from './useFollow';
import styles from './companies.module.css';

const TABS = ['overview', 'jobs', 'people', 'updates'];

function Actions({ company, own }) {
  const role = useRole();
  const [following, toggle] = useFollow(company);
  if (own) {
    return (
      <>
        <Button variant="primary" onClick={() => toast('The page editor opens here')}>
          <Icon name="edit" size={18} />
          Edit page
        </Button>
        <ButtonLink to="/employer/jobs/new">Post a job</ButtonLink>
      </>
    );
  }
  if (!role) {
    return (
      <ButtonLink variant="primary" to="/signin">
        Follow
      </ButtonLink>
    );
  }
  if (role === 'emp') return null;
  return (
    <>
      <Button variant={following ? 'secondary' : 'primary'} on={following} onClick={toggle}>
        {following && <Icon name="check" size={18} />}
        {following ? 'Following' : 'Follow'}
      </Button>
      <Button onClick={() => toast(`Opens ${company.site} in a new tab`)}>
        Website
        <Icon name="external" size={16} />
      </Button>
    </>
  );
}

function JobRows({ jobs, held }) {
  if (!jobs.length) {
    return (
      <p className="empty">{held ? 'Jobs appear here once your business is verified.' : 'No open jobs right now.'}</p>
    );
  }
  return (
    <List>
      {jobs.map((job) => (
        <JobLinkItem key={job.id} job={job} compact />
      ))}
    </List>
  );
}

function PersonRow({ member }) {
  const role = useRole();
  const requested = useAppStore((state) => state.requestedMemberIds.includes(member.id));
  const toggle = () => {
    const sent = useAppStore.getState().toggleContactRequest(member.id);
    toast(sent ? `Contact request sent to ${member.name}` : 'Request withdrawn');
  };
  return (
    <ListItem>
      <Avatar name={member.name} />
      <span className="grow">
        {role ? <MemberLink id={member.id} /> : <span className="strong">{member.name}</span>}
        <span className="block text-sm muted">{member.headline}</span>
      </span>
      {role === 'pro' && (
        <Button size="sm" on={requested} aria-pressed={requested} onClick={toggle}>
          {requested ? 'Request sent' : 'Add contact'}
        </Button>
      )}
    </ListItem>
  );
}

export default function CompanyPage() {
  const { companyId, tab = 'overview' } = useParams();
  const role = useRole();
  const company = useCompanies()[companyId];
  const verifiedEmployer = useAppStore((state) => state.employer.verified);
  const posts = useAppStore((state) => state.posts);
  usePageTitle(company?.name ?? 'Company');

  if (!company) return <NotFoundPage />;
  if (!TABS.includes(tab)) return <Navigate to={`/companies/${companyId}`} replace />;

  const own = role === 'emp' && companyId === OWN_COMPANY_ID;
  const verified = !own || verifiedEmployer;
  const jobs = verified ? JOBS.filter((job) => job.companyId === companyId) : [];
  const people = MEMBERS.filter((member) => member.companyId === companyId);
  const updates = posts.filter((post) => post.author.kind === 'company' && post.author.id === companyId);
  const base = `/companies/${companyId}`;

  return (
    <>
      {own && (
        <Note tone={verified ? 'info' : 'warn'} className={styles.note}>
          {verified ? (
            <>
              <b>This is how members see your page.</b> Add a logo and two project photos to finish it.
            </>
          ) : (
            <>
              <b>Business check in review.</b> Your page is visible, but jobs stay hidden until the check passes.
            </>
          )}
        </Note>
      )}
      <Card className={styles.header}>
        <div className="row row-top row-wrap gap-16">
          <Avatar name={company.name} company size={64} />
          <div className={`grow ${styles.headerText}`}>
            <h1 className="h1">{company.name}</h1>
            <p className={`mt-4 ${styles.tagline}`}>{company.tagline}</p>
            <p className="text-sm muted mt-4">
              {company.city}
              <span className="sep">{company.size}</span>
              <span className="sep">{formatCount(company.followers)} followers</span>
            </p>
            <p className="mt-8">{verified ? <VerifiedMark /> : <Chip tone="warn">Verification in review</Chip>}</p>
          </div>
          <div className="row row-wrap gap-8">
            <Actions company={company} own={own} />
          </div>
        </div>
      </Card>

      <div className="toolbar mt-16">
        <SegmentedNav
          label="Company page"
          current={tab}
          items={[
            { value: 'overview', label: 'Overview', to: base },
            { value: 'jobs', label: 'Jobs', to: `${base}/jobs`, count: jobs.length },
            { value: 'people', label: 'People', to: `${base}/people` },
            { value: 'updates', label: 'Updates', to: `${base}/updates` },
          ]}
        />
      </div>

      {tab === 'overview' && (
        <div className="layout-main-aside">
          <div className="stack">
            <Card padded>
              <h2 className="h3">About</h2>
              <p className="mt-8 measure">{company.about}</p>
              <dl className="kv mt-16">
                {[
                  ['Website', company.site],
                  ['Focus', company.kind],
                  ['Size', company.size],
                  ['Headquarters', company.city],
                  ['Founded', company.founded],
                ].map(([label, value]) => (
                  <Fragment key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </Fragment>
                ))}
              </dl>
            </Card>
            <Card>
              <CardHeader
                title="Open jobs"
                action={
                  jobs.length > 3 && (
                    <ButtonLink variant="text" size="sm" to={`${base}/jobs`}>
                      All {jobs.length}
                    </ButtonLink>
                  )
                }
              />
              <div className="mt-8">
                <JobRows jobs={jobs.slice(0, 3)} held={!verified} />
              </div>
            </Card>
          </div>
          <aside>
            <Card>
              <CardHeader
                title="Employer check"
                action={verified ? <VerifiedMark size={15} /> : <Chip tone="warn">In review</Chip>}
              />
              <CardBody>
                <Checklist
                  className="text-sm"
                  items={[
                    'Work email confirmed',
                    `Email domain matches ${company.site}`,
                    'Found in the state business register',
                  ].map((label, index) => ({ label, status: verified || index === 0 ? 'ok' : 'hold' }))}
                />
              </CardBody>
            </Card>
          </aside>
        </div>
      )}
      {tab === 'jobs' && (
        <Card>
          <JobRows jobs={jobs} held={!verified} />
        </Card>
      )}
      {tab === 'people' && (
        <Card>
          <List>
            {people.map((member) => (
              <PersonRow key={member.id} member={member} />
            ))}
            {!people.length && <li className="empty">No one has listed this company yet.</li>}
          </List>
        </Card>
      )}
      {tab === 'updates' && (
        <Card>
          {updates.length ? (
            updates.map((post) => <UpdateCard key={post.id} post={post} />)
          ) : (
            <p className="empty">No updates yet.</p>
          )}
        </Card>
      )}
    </>
  );
}
