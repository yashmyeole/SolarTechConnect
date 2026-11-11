import { MenuItem } from '@/components/Menu';
import { PERSONAS, ROLE_LABEL } from '@/data/personas';
import { useDemoActions } from './useDemoActions';

export default function DemoMenuItems() {
  const { role, verified, switchAccount, toggleVerified, reset } = useDemoActions();
  const other = role === 'pro' ? 'emp' : 'pro';
  return (
    <>
      <MenuItem icon="swap" onSelect={switchAccount}>
        Switch to {PERSONAS[other].name.split(' ')[0]}, {ROLE_LABEL[other].toLowerCase()}
      </MenuItem>
      {role === 'emp' && (
        <MenuItem icon={verified ? 'clock' : 'shield'} onSelect={toggleVerified}>
          {verified ? 'Set business to in review' : 'Set business to verified'}
        </MenuItem>
      )}
      <MenuItem icon="refresh" onSelect={reset}>
        Reset demo data
      </MenuItem>
    </>
  );
}
