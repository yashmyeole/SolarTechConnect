import { Navigate, useParams } from 'react-router';
import Avatar from '@/components/Avatar';
import { Button, ButtonLink } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import DateBadge from '@/components/DateBadge';
import Icon from '@/components/Icon';
import { List, ListItem, SubHeading } from '@/components/List';
import PageHeader from '@/components/PageHeader';
import { SegmentedNav } from '@/components/Segmented';
import { COURSES, EVENTS, GROUPS } from '@/data/community';
import { useDirectory } from '@/features/directory/useDirectory';
import UpdateCard from '@/features/feed/UpdateCard';
import { usePageTitle } from '@/lib/usePageTitle';
import { useAppStore, useRole } from '@/store';
import { toast } from '@/store/ui';
import styles from './community.module.css';

function ToggleButton({ on, onLabel, offLabel, signInLabel, onToggle }) {
  const role = useRole();
  if (!role) {
    return (
      <ButtonLink size="sm" to="/signin">
        {signInLabel}
      </ButtonLink>
    );
  }
  return (
    <Button size="sm" on={on} aria-pressed={on} onClick={onToggle}>
      {on && <Icon name="check" size={16} />}
      {on ? onLabel : offLabel}
    </Button>
  );
}

function GroupItem({ group }) {
  const joined = useAppStore((state) => state.joinedGroupIds.includes(group.id));
  const toggle = () => {
    const nowJoined = useAppStore.getState().toggleGroup(group.id);
    toast(nowJoined ? 'You joined. Its updates now show on your home page.' : 'You left the group');
  };
  return (
    <ListItem top wrap>
      <Avatar name={group.name} company />
      <span className={`grow ${styles.text}`}>
        <span className="strong block">{group.name}</span>
        <span className="block text-sm muted">{group.about}</span>
        <span className="text-sm subtle">{group.members}</span>
      </span>
      <Button size="sm" on={joined} aria-pressed={joined} onClick={toggle}>
        {joined ? 'Joined' : 'Join'}
      </Button>
    </ListItem>
  );
}

function Groups() {
  const joined = useAppStore((state) => state.joinedGroupIds);
  const busyPost = useAppStore((state) => state.posts.find((post) => post.groupId));
  const mine = GROUPS.filter((group) => joined.includes(group.id));
  const others = GROUPS.filter((group) => !joined.includes(group.id));
  return (
    <div className="layout-main-aside">
      <div className="stack">
        <Card>
          <SubHeading>Your groups</SubHeading>
          <List>
            {mine.map((group) => (
              <GroupItem key={group.id} group={group} />
            ))}
            {!mine.length && <ListItem className="muted">You haven’t joined a group yet.</ListItem>}
          </List>
        </Card>
        <Card>
          <SubHeading>Suggested for you</SubHeading>
          <List>
            {others.map((group) => (
              <GroupItem key={group.id} group={group} />
            ))}
            {!others.length && <ListItem className="muted">You’ve joined every group.</ListItem>}
          </List>
        </Card>
      </div>
      {busyPost && (
        <aside>
          <Card>
            <SubHeading>Busy this week</SubHeading>
            <UpdateCard post={busyPost} />
          </Card>
        </aside>
      )}
    </div>
  );
}

function Events() {
  const attending = useAppStore((state) => state.attendingEventIds);
  const toggle = (id) => {
    const going = useAppStore.getState().toggleEvent(id);
    toast(going ? 'You’re going. We’ll remind you the day before.' : 'Removed');
  };
  return (
    <Card>
      <List>
        {EVENTS.map((event) => (
          <ListItem key={event.id} top wrap>
            <DateBadge month={event.month} day={event.day} />
            <span className={`grow ${styles.text}`}>
              <span className="strong block">{event.name}</span>
              <span className="block text-sm">{event.when}</span>
              <span className="block text-sm subtle">
                {event.where} · {event.going + (attending.includes(event.id) ? 1 : 0)} going
              </span>
            </span>
            <ToggleButton
              on={attending.includes(event.id)}
              onLabel="Going"
              offLabel="Attend"
              signInLabel="Sign in to attend"
              onToggle={() => toggle(event.id)}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

function Courses() {
  const { company } = useDirectory();
  const enrolled = useAppStore((state) => state.enrolledCourseIds);
  const toggle = (id) => {
    const nowEnrolled = useAppStore.getState().toggleCourse(id);
    toast(nowEnrolled ? 'Enrolled. The provider will email you the details.' : 'Removed');
  };
  return (
    <Card>
      <List>
        {COURSES.map((course) => (
          <ListItem key={course.id} top wrap>
            <Avatar name={company(course.providerId).name} company />
            <span className={`grow ${styles.text}`}>
              <span className="strong block">{course.name}</span>
              <span className="block text-sm">{company(course.providerId).name}</span>
              <span className="block text-sm subtle">{course.format}</span>
              <Chip tone="brand" className="mt-8">
                Leads to: {course.leadsTo}
              </Chip>
            </span>
            <ToggleButton
              on={enrolled.includes(course.id)}
              onLabel="Enrolled"
              offLabel="Enroll"
              signInLabel="Sign in to enroll"
              onToggle={() => toggle(course.id)}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

const VIEWS = { groups: Groups, events: Events, courses: Courses };

export default function CommunityPage() {
  const role = useRole();
  const { tab = role ? 'groups' : 'events' } = useParams();
  usePageTitle(role ? 'Community' : 'Events and courses');
  const tabs = role ? ['groups', 'events', 'courses'] : ['events', 'courses'];
  if (!tabs.includes(tab)) return <Navigate to="/community" replace />;
  const View = VIEWS[tab];
  const label = { groups: 'Groups', events: 'Events', courses: 'Courses' };

  return (
    <>
      <PageHeader
        title={role ? 'Community' : 'Events and courses'}
        subtitle={
          role
            ? 'Groups by trade and region, plus events and courses.'
            : 'Meet employers and earn the credentials they ask for.'
        }
        actions={
          <SegmentedNav
            label="Community"
            current={tab}
            items={tabs.map((value, index) => ({
              value,
              label: label[value],
              to: index ? `/community/${value}` : '/community',
            }))}
          />
        }
      />
      <View />
    </>
  );
}
