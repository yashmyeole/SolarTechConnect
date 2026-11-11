import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Avatar from '@/components/Avatar';
import { Button, ButtonLink } from '@/components/Button';
import { Chip, VerifiedMark } from '@/components/Chip';
import Icon from '@/components/Icon';
import { DetailArticle, DetailSection } from '@/components/SplitView';
import { CompanyLink } from '@/features/directory/EntityLink';
import { useDirectory } from '@/features/directory/useDirectory';
import { cx } from '@/lib/cx';
import { distanceLabel, formatPay, postedAgo } from '@/lib/format';
import { useAppStore, useRole } from '@/store';
import { toast } from '@/store/ui';
import ApplyDialog from './ApplyDialog';
import styles from './jobs.module.css';

function copyLink(message) {
  navigator.clipboard?.writeText(location.href).catch(() => {});
  toast(message);
}

function Actions({ job, application, onApply }) {
  const role = useRole();
  const saved = useAppStore((state) => state.savedJobIds.includes(job.id));

  if (role === 'emp') return <Chip>You’re viewing this as an employer</Chip>;
  if (!role) {
    return (
      <>
        <ButtonLink variant="primary" size="lg" to={`/signin?next=/jobs/${job.id}`}>
          Sign in to apply
        </ButtonLink>
        <ButtonLink size="lg" to="/join/professional">
          Create a free profile
        </ButtonLink>
      </>
    );
  }

  const toggleSaved = () => {
    const nowSaved = useAppStore.getState().toggleSavedJob(job.id);
    toast(nowSaved ? 'Saved. Find it under Jobs, Saved.' : 'Removed from saved jobs');
  };

  return (
    <>
      {application ? (
        <>
          <Chip tone="ok" className={styles.appliedChip}>
            <Icon name="check" size={15} stroke={2.2} />
            Applied {application.appliedOn}
          </Chip>
          <ButtonLink size="sm" to="/jobs/applied">
            See application
          </ButtonLink>
        </>
      ) : (
        <Button variant="primary" size="lg" onClick={onApply}>
          Apply
        </Button>
      )}
      <Button size={application ? 'sm' : 'lg'} on={saved} aria-pressed={saved} onClick={toggleSaved}>
        <Icon name="bookmark" size={18} />
        {saved ? 'Saved' : 'Save'}
      </Button>
      <Button iconOnly aria-label="Copy link to this job" onClick={() => copyLink('Link to this job copied')}>
        <Icon name="send" />
      </Button>
    </>
  );
}

export default function JobDetail({ job, onBack }) {
  const role = useRole();
  const { company } = useDirectory();
  const owner = company(job.companyId);
  const application = useAppStore((state) =>
    state.role === 'pro' ? state.applications.find((entry) => entry.jobId === job.id) : undefined,
  );
  const following = useAppStore((state) => state.followingCompanyIds.includes(job.companyId));
  const certifications = useAppStore(useShallow((state) => state.licenses.map((license) => license.certification)));
  const [applying, setApplying] = useState(false);
  const pro = role === 'pro';
  const applyBar = role !== 'emp' && !application;

  const toggleFollow = () => {
    const nowFollowing = useAppStore.getState().toggleFollow(job.companyId);
    toast(nowFollowing ? `You’re following ${owner.name}` : `You stopped following ${owner.name}`);
  };

  return (
    <div className={cx(!role && styles.visitor)}>
      <DetailArticle onBack={onBack} backLabel="All results" className={cx(applyBar && styles.withApplyBar)}>
        <div className="row gap-8">
          <Avatar name={owner.name} company size={32} />
          <CompanyLink id={job.companyId} />
          <VerifiedMark size={15} />
        </div>
        <h2 className="h1 mt-12">{job.title}</h2>
        <p className="muted mt-4">
          {job.city}
          {job.workplace !== 'Remote' && <span className="sep">{distanceLabel(job)}</span>}
          <span className="sep">Posted {postedAgo(job.postedDaysAgo)}</span>
        </p>
        <dl className={styles.facts}>
          {[
            ['Pay', formatPay(job)],
            ['Job type', job.type],
            ['Experience', job.experience],
            ['Starts', job.start],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className={styles.factLabel}>{label}</dt>
              <dd className={styles.factValue}>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="row row-wrap gap-8 mt-16">
          <Actions job={job} application={application} onApply={() => setApplying(true)} />
        </div>

        <DetailSection>
          <h3 className="h2">About the role</h3>
          <p className="mt-8">{job.about}</p>
          <h4 className="h3 mt-16">What you’ll do</h4>
          <ul className="bullets mt-8">
            {job.duties.map((duty) => (
              <li key={duty}>{duty}</li>
            ))}
          </ul>
          <h4 className="h3 mt-16">Schedule</h4>
          <p className="mt-4">{job.schedule}.</p>
          <h4 className="h3 mt-16">Where you’ll work</h4>
          <p className="mt-4">
            {job.workplace === 'Remote'
              ? 'Remote within Illinois, with occasional site visits.'
              : `${job.workplace} in and around ${job.city}. Outdoor work at height in all seasons; protective equipment provided.`}
          </p>
        </DetailSection>

        <DetailSection>
          <h3 className="h2">Licenses and certifications</h3>
          <p className="muted mt-4">{owner.name} asks for these. You can apply without them.</p>
          <ul className="stack gap-8 mt-12">
            {job.certifications.map((certification) => (
              <li key={certification} className="row gap-8">
                {pro ? (
                  certifications.includes(certification) ? (
                    <Chip tone="ok">
                      <Icon name="check" size={14} stroke={2.2} />
                      On your profile
                    </Chip>
                  ) : (
                    <Chip>Not on your profile</Chip>
                  )
                ) : (
                  <Icon name="shield" size={16} className="subtle" />
                )}
                <span>{certification}</span>
              </li>
            ))}
          </ul>
        </DetailSection>

        <DetailSection>
          <h3 className="h2">About {owner.name}</h3>
          <div className="row mt-12">
            <Avatar name={owner.name} company size={56} />
            <div className="grow">
              <CompanyLink id={job.companyId} />
              <p className="text-sm subtle">
                {owner.kind} · {owner.size}
              </p>
            </div>
            {pro && (
              <Button size="sm" on={following} aria-pressed={following} onClick={toggleFollow}>
                {following ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>
          <p className="mt-12">{owner.about}</p>
        </DetailSection>
      </DetailArticle>

      {applyBar && (
        <div className={styles.applyBar}>
          <span className="grow">
            <span className="strong block">{job.title}</span>
            <span className="text-sm muted">{formatPay(job)}</span>
          </span>
          {pro ? (
            <Button variant="primary" onClick={() => setApplying(true)}>
              Apply
            </Button>
          ) : (
            <ButtonLink variant="primary" to={`/signin?next=/jobs/${job.id}`}>
              Sign in to apply
            </ButtonLink>
          )}
        </div>
      )}
      {applying && <ApplyDialog job={job} onClose={() => setApplying(false)} />}
    </div>
  );
}
