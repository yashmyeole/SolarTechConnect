import { Link } from 'react-router';
import { cx } from '@/lib/cx';
import { useAppStore } from '@/store';
import { useDirectory } from './useDirectory';

export function MemberLink({ id, className }) {
  const { member } = useDirectory();
  const self = useAppStore((state) => state.role === 'pro' && state.profiles.pro.id === id);
  const person = member(id);
  if (!person) return null;
  return (
    <Link className={cx('strong hover-underline', className)} to={self ? '/profile' : `/members/${id}`}>
      {person.name}
    </Link>
  );
}

export function CompanyLink({ id, className, children }) {
  const { company } = useDirectory();
  return (
    <Link className={cx('strong hover-underline', className)} to={`/companies/${id}`}>
      {children ?? company(id).name}
    </Link>
  );
}
