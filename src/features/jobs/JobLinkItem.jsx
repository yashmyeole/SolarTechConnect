import Avatar from '@/components/Avatar';
import Icon from '@/components/Icon';
import { ListItem } from '@/components/List';
import { useDirectory } from '@/features/directory/useDirectory';
import { formatPay, shortDistance } from '@/lib/format';

export default function JobLinkItem({ job, compact = false }) {
  const { company } = useDirectory();
  const name = company(job.companyId).name;
  return (
    <ListItem to={`/jobs/${job.id}`}>
      {!compact && <Avatar name={name} company />}
      <span className="grow">
        <span className="strong block">{job.title}</span>
        <span className="text-sm muted">
          {compact ? (
            <>
              {job.city} · <b className="strong nowrap">{formatPay(job)}</b> · {job.type}
            </>
          ) : (
            <>
              {name} · {shortDistance(job)} · <b className="strong nowrap">{formatPay(job)}</b>
            </>
          )}
        </span>
      </span>
      <Icon name="chevronRight" size={18} />
    </ListItem>
  );
}
