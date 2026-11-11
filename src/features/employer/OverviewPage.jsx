import { Link } from 'react-router';
import Avatar from '@/components/Avatar';
import { ButtonLink } from '@/components/Button';
import { Card, CardHeader } from '@/components/Card';
import { Chip, VerifiedMark } from '@/components/Chip';
import Icon from '@/components/Icon';
import IconCircle from '@/components/IconCircle';
import { List, ListItem } from '@/components/List';
import PageHeader from '@/components/PageHeader';
import { OWN_COMPANY_ID } from '@/data/companies';
import { MEMBERS } from '@/data/people';
import { MemberLink } from '@/features/directory/EntityLink';
import { OWN_COMPANY_PATH } from '@/layouts/navigation';
import { firstName, greeting, todayLong } from '@/lib/format';
import { usePageTitle } from '@/lib/usePageTitle';
import { useAppStore, useCompanies, usePersona } from '@/store';
import { HoldNote, JobStatus, PipelineBar, PipelineLegend } from './EmployerParts';
import styles from './employer.module.css';

export default function OverviewPage() {
  usePageTitle('Overview');
  const persona = usePersona();
  const company = useCompanies()[OWN_COMPANY_ID];
  const verified = useAppStore((state) => state.employer.verified);
  const jobs = useAppStore((state) => state.employer.jobs);
  const newCandidates = useAppStore(
    (state) => state.employer.candidates.filter((candidate) => candidate.stage === 0).length,
  );
  const open = jobs.filter((job) => job.status === 'open');
  const drafts = jobs.filter((job) => job.status === 'draft').length;

  const stats = [
    [verified ? 'Open jobs' : 'Jobs on hold', open.length, `${drafts} draft${drafts === 1 ? '' : 's'}`],
    ['New candidates', 12, '6 since Friday'],
    ['Interviews this week', 3, 'Next: tomorrow, 9:00 am'],
    ['Days to fill', 16, 'Median, last 90 days'],
  ];

  const todo = [
    [
      'clipboard',
      `${newCandidates} new candidates for Crew Lead, Commercial Rooftop`,
      'Waiting since Nov 9.',
      'Review',
      '/employer/candidates?job=5',
    ],
    [
      'calendar',
      'Interview with Lena Fischer tomorrow at 9:00 am',
      'Crew Lead, Commercial Rooftop · Video call',
      'Details',
      '/employer/candidates?candidate=lena-fischer',
    ],
    ['edit', 'Finish your draft: Project Coordinator', 'Last edited November 6.', 'Continue', '/employer/jobs/new'],
    [
      'building',
      'Your company page is 70% complete',
      'Add a logo and two project photos.',
      'Edit page',
      OWN_COMPANY_PATH,
    ],
  ];

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${firstName(persona.name)}`}
        subtitle={`${company.name} · ${todayLong()}`}
        actions={
          <ButtonLink to="/employer/talent">
            <Icon name="search" size={18} />
            Find talent
          </ButtonLink>
        }
      />
      <HoldNote />
      <Card className={styles.stats}>
        {stats.map(([label, value, detail]) => (
          <div key={label} className={styles.stat}>
            <p className={styles.statLabel}>{label}</p>
            <p className={styles.statValue}>{value}</p>
            <p className={styles.statDetail}>{detail}</p>
          </div>
        ))}
      </Card>
      <div className="layout-main-aside">
        <div className="stack">
          <Card>
            <CardHeader title="To do" action={<Chip tone="accent">{todo.length}</Chip>} />
            <List className="mt-8">
              {todo.map(([icon, title, detail, action, to]) => (
                <ListItem key={title}>
                  <IconCircle name={icon} />
                  <span className="grow">
                    <span className="strong block">{title}</span>
                    <span className="text-sm muted">{detail}</span>
                  </span>
                  <ButtonLink size="sm" to={to}>
                    {action}
                  </ButtonLink>
                </ListItem>
              ))}
            </List>
          </Card>
          <Card>
            <CardHeader
              title="Open jobs"
              action={
                <ButtonLink variant="text" size="sm" to="/employer/jobs">
                  All jobs
                </ButtonLink>
              }
            />
            <div className={`${styles.tableScroll} mt-12`}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Job</th>
                    <th scope="col">Candidates</th>
                    <th scope="col">Pipeline</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {open.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <Link className="strong hover-underline" to={`/employer/candidates?job=${job.id}`}>
                          {job.title}
                        </Link>
                        <span className="block text-sm subtle">
                          {job.location} · Posted {job.date}
                        </span>
                      </td>
                      <td className="tabular nowrap">
                        <b className="strong">{job.newApplicants}</b> new of {job.applicants}
                      </td>
                      <td>
                        <PipelineBar pipeline={job.pipeline} />
                      </td>
                      <td>
                        <JobStatus status={job.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PipelineLegend />
          </Card>
        </div>
        <aside className="stack">
          <Card padded>
            <div className="row row-between">
              <h2 className="h3">Business check</h2>
              {verified ? <VerifiedMark size={15} /> : <Chip tone="warn">In review</Chip>}
            </div>
            <p className="text-sm muted mt-8">
              {verified
                ? 'Verified on November 2. Your jobs carry the Verified employer mark.'
                : 'Usually within 1 business day.'}
            </p>
            <Link className="link text-sm mt-8 block" to="/settings/company">
              Details
            </Link>
          </Card>
          <Card>
            <CardHeader
              title="Available near your jobs"
              action={
                <ButtonLink variant="text" size="sm" to="/employer/talent">
                  More
                </ButtonLink>
              }
            />
            <List className="mt-8">
              {MEMBERS.filter((member) => member.available)
                .slice(0, 3)
                .map((member) => (
                  <ListItem key={member.id}>
                    <Avatar name={member.name} />
                    <span className="grow">
                      <MemberLink id={member.id} />
                      <span className="block text-sm muted">
                        {member.trade} · {member.miles} mi
                      </span>
                    </span>
                  </ListItem>
                ))}
            </List>
          </Card>
        </aside>
      </div>
    </>
  );
}
