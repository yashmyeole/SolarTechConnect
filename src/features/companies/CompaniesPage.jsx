import { Link } from 'react-router';
import Avatar from '@/components/Avatar';
import { Button, ButtonLink } from '@/components/Button';
import { Card } from '@/components/Card';
import PageHeader from '@/components/PageHeader';
import { JOBS } from '@/data/jobs';
import { formatCount, plural } from '@/lib/format';
import { usePageTitle } from '@/lib/usePageTitle';
import { useCompanies, useRole } from '@/store';
import { useFollow } from './useFollow';
import styles from './companies.module.css';

function FollowAction({ company }) {
  const role = useRole();
  const [following, toggle] = useFollow(company);
  if (role === 'emp') return null;
  if (!role) {
    return (
      <ButtonLink size="sm" to="/signin">
        Follow
      </ButtonLink>
    );
  }
  return (
    <Button size="sm" on={following} aria-pressed={following} onClick={toggle}>
      {following ? 'Following' : 'Follow'}
    </Button>
  );
}

export default function CompaniesPage() {
  usePageTitle('Companies');
  const companies = Object.values(useCompanies());
  return (
    <>
      <PageHeader
        title="Companies"
        subtitle="Employers and training providers. Every employer is checked before its jobs go live."
      />
      <div className="card-grid">
        {companies.map((company) => {
          const openJobs = JOBS.filter((job) => job.companyId === company.id).length;
          return (
            <Card key={company.id} padded>
              <div className="row row-top">
                <Avatar name={company.name} company size={56} />
                <div className="grow">
                  <Link className={`strong hover-underline ${styles.name}`} to={`/companies/${company.id}`}>
                    {company.name}
                  </Link>
                  <p className="text-sm muted">{company.kind}</p>
                  <p className="text-sm subtle">
                    {company.city} · {formatCount(company.followers)} followers
                  </p>
                </div>
              </div>
              <div className="row row-between mt-16">
                {openJobs ? (
                  <Link className="link text-sm" to={`/companies/${company.id}/jobs`}>
                    {plural(openJobs, 'open job')}
                  </Link>
                ) : (
                  <span className="text-sm subtle">No open jobs</span>
                )}
                <FollowAction company={company} />
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
