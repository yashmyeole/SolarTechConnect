import { useState } from 'react';
import { Navigate, useParams } from 'react-router';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card, CardFooterLink } from '@/components/Card';
import Icon from '@/components/Icon';
import { List, ListItem, SubHeading } from '@/components/List';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';
import { SegmentedNav } from '@/components/Segmented';
import { MEMBERS } from '@/data/people';
import { CompanyLink, MemberLink } from '@/features/directory/EntityLink';
import { useDirectory } from '@/features/directory/useDirectory';
import { useOpenConversation } from '@/features/directory/useOpenConversation';
import { usePageTitle } from '@/lib/usePageTitle';
import { useAppStore } from '@/store';
import { toast } from '@/store/ui';
import styles from './people.module.css';

const TABS = ['suggested', 'requests', 'contacts', 'following'];

function RequestButton({ member }) {
  const requested = useAppStore((state) => state.requestedMemberIds.includes(member.id));
  const toggle = () => {
    const sent = useAppStore.getState().toggleContactRequest(member.id);
    toast(sent ? `Contact request sent to ${member.name}` : 'Request withdrawn');
  };
  return (
    <Button size="sm" on={requested} aria-pressed={requested} onClick={toggle}>
      {requested ? 'Request sent' : 'Add contact'}
    </Button>
  );
}

function Suggested() {
  const dismissed = useAppStore((state) => state.dismissedMemberIds);
  const suggestions = MEMBERS.filter((member) => !dismissed.includes(member.id));
  return (
    <Card>
      <SubHeading>People you may know</SubHeading>
      <List>
        {suggestions.map((member) => (
          <ListItem key={member.id} wrap>
            <Avatar name={member.name} size={48} />
            <span className={`grow ${styles.person}`}>
              <MemberLink id={member.id} />
              <span className="block text-sm muted">{member.headline}</span>
              <span className="text-sm subtle">{member.reason}</span>
            </span>
            <span className="row gap-4">
              <RequestButton member={member} />
              <Button
                iconOnly
                size="sm"
                className="subtle"
                aria-label={`Hide ${member.name}`}
                onClick={() => useAppStore.getState().dismissSuggestion(member.id)}
              >
                <Icon name="x" size={18} />
              </Button>
            </span>
          </ListItem>
        ))}
        {!suggestions.length && <li className="empty">No more suggestions right now.</li>}
      </List>
    </Card>
  );
}

function Requests() {
  const { member } = useDirectory();
  const requests = useAppStore((state) => state.contactRequests);
  const answer = (person, accept) => {
    useAppStore.getState().answerContactRequest(person.id, accept);
    toast(accept ? `${person.name} is now one of your contacts` : 'Request ignored');
  };
  return (
    <Card>
      {requests.length ? (
        <List>
          {requests.map((request) => {
            const person = member(request.memberId);
            return (
              <ListItem key={person.id} top wrap>
                <Avatar name={person.name} size={48} />
                <span className={`grow ${styles.person}`}>
                  <MemberLink id={person.id} />
                  <span className="block text-sm muted">{person.headline}</span>
                  {request.message && <span className="block text-sm mt-4">“{request.message}”</span>}
                </span>
                <span className="row gap-8">
                  <Button variant="quiet" size="sm" onClick={() => answer(person, false)}>
                    Ignore
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => answer(person, true)}>
                    Accept
                  </Button>
                </span>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <p className="empty">No requests waiting.</p>
      )}
    </Card>
  );
}

function Contacts() {
  const { member } = useDirectory();
  const openConversation = useOpenConversation();
  const contactIds = useAppStore((state) => state.contactIds);
  const count = useAppStore((state) => state.contactCount);
  const [query, setQuery] = useState('');
  const contacts = contactIds
    .map(member)
    .filter((person) => person.name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <Card>
      <div className={styles.search}>
        <SearchInput
          label={`Search ${count} contacts`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <List>
        {contacts.map((person) => (
          <ListItem key={person.id}>
            <Avatar name={person.name} />
            <span className="grow">
              <MemberLink id={person.id} />
              <span className="block text-sm muted">{person.headline}</span>
            </span>
            <Button size="sm" onClick={() => openConversation(person.id)}>
              Message
            </Button>
          </ListItem>
        ))}
        {!contacts.length && <li className="empty">No contacts match “{query}”.</li>}
      </List>
      <CardFooterLink onClick={() => toast(`Showing all ${count} contacts`)}>Show all {count}</CardFooterLink>
    </Card>
  );
}

function Following() {
  const { company } = useDirectory();
  const following = useAppStore((state) => state.followingCompanyIds);
  const unfollow = (id) => {
    useAppStore.getState().toggleFollow(id);
    toast(`You stopped following ${company(id).name}`);
  };
  return (
    <Card>
      <SubHeading>Companies</SubHeading>
      <List>
        {following.map((id) => (
          <ListItem key={id}>
            <Avatar name={company(id).name} company />
            <span className="grow">
              <CompanyLink id={id} />
              <span className="block text-sm muted">{company(id).kind}</span>
            </span>
            <Button size="sm" on onClick={() => unfollow(id)}>
              Following
            </Button>
          </ListItem>
        ))}
        {!following.length && <li className="empty">You’re not following any companies.</li>}
      </List>
      <CardFooterLink to="/companies">Find companies to follow</CardFooterLink>
    </Card>
  );
}

const VIEWS = { suggested: Suggested, requests: Requests, contacts: Contacts, following: Following };

export default function PeoplePage() {
  const { tab = 'suggested' } = useParams();
  const requests = useAppStore((state) => state.contactRequests.length);
  const contacts = useAppStore((state) => state.contactCount);
  const following = useAppStore((state) => state.followingCompanyIds.length);
  usePageTitle('People');
  if (!TABS.includes(tab)) return <Navigate to="/people" replace />;
  const View = VIEWS[tab];

  return (
    <>
      <PageHeader
        title="People"
        subtitle="The people you work with and the ones worth knowing."
        actions={
          <SegmentedNav
            label="People"
            current={tab}
            items={[
              { value: 'suggested', label: 'Suggested', to: '/people' },
              { value: 'requests', label: 'Requests', to: '/people/requests', count: requests },
              { value: 'contacts', label: 'Contacts', to: '/people/contacts', count: contacts },
              { value: 'following', label: 'Following', to: '/people/following', count: following },
            ]}
          />
        }
      />
      <View />
    </>
  );
}
