import Avatar from '@/components/Avatar';
import { MenuDivider, MenuHeader, MenuItem, MenuLabel } from '@/components/Menu';
import { DEMO_MODE } from '@/config';
import DemoMenuItems from '@/features/demo/DemoMenuItems';
import { useDemoActions } from '@/features/demo/useDemoActions';
import { usePersona } from '@/store';
import { OWN_COMPANY_PATH, useNavCounts } from './navigation';

export default function AccountMenu({ role, mobile }) {
  const persona = usePersona();
  const { notifications } = useNavCounts();
  const { signOut } = useDemoActions();
  const notificationsLabel = `Notifications${notifications ? ` (${notifications})` : ''}`;

  return (
    <>
      <MenuHeader>
        <Avatar name={persona.name} />
        <div className="grow">
          <p className="strong">{persona.name}</p>
          <p className="text-sm subtle">{persona.headline.split(' · ')[0]}</p>
        </div>
      </MenuHeader>
      <MenuDivider />
      {role === 'pro' ? (
        <>
          <MenuItem icon="users" to="/profile">
            Your profile
          </MenuItem>
          <MenuItem icon="bookmark" to="/jobs/saved">
            Saved jobs and applications
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem icon="building" to={OWN_COMPANY_PATH}>
            Company page
          </MenuItem>
          <MenuItem icon="team" to="/settings/team">
            Team
          </MenuItem>
        </>
      )}
      {mobile &&
        (role === 'pro' ? (
          <>
            <MenuItem icon="group" to="/community">
              Community
            </MenuItem>
            <MenuItem icon="bell" to="/notifications">
              {notificationsLabel}
            </MenuItem>
            <MenuItem icon="building" to="/companies">
              Companies
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem icon="search" to="/employer/talent">
              Find talent
            </MenuItem>
            <MenuItem icon="plus" to="/employer/jobs/new">
              Post a job
            </MenuItem>
            <MenuItem icon="bell" to="/notifications">
              {notificationsLabel}
            </MenuItem>
          </>
        ))}
      <MenuDivider />
      <MenuItem icon="sliders" to="/settings">
        Settings
      </MenuItem>
      <MenuItem icon="help" to="/help">
        Help
      </MenuItem>
      {mobile && DEMO_MODE && (
        <>
          <MenuDivider />
          <MenuLabel>Demo</MenuLabel>
          <DemoMenuItems />
        </>
      )}
      <MenuDivider />
      <MenuItem icon="signOut" onSelect={signOut}>
        Sign out
      </MenuItem>
    </>
  );
}
