import PageHeader from '@/components/PageHeader';
import { SegmentedNav } from '@/components/Segmented';
import { useAppStore, useRole } from '@/store';

export default function JobsHeader({ current }) {
  const role = useRole();
  const saved = useAppStore((state) => state.savedJobIds.length);
  const applied = useAppStore((state) => state.applications.length);
  return (
    <PageHeader
      title="Jobs"
      subtitle={role ? undefined : 'Solar jobs from employers we’ve checked.'}
      actions={
        role === 'pro' && (
          <SegmentedNav
            label="Jobs"
            current={current}
            items={[
              { value: 'search', label: 'Search', to: '/jobs' },
              { value: 'saved', label: 'Saved', to: '/jobs/saved', count: saved },
              { value: 'applied', label: 'Applied', to: '/jobs/applied', count: applied },
            ]}
          />
        )
      }
    />
  );
}
