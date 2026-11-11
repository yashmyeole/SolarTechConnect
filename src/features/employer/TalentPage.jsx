import { useState } from 'react';
import Avatar from '@/components/Avatar';
import { Button, ButtonLink } from '@/components/Button';
import { Card } from '@/components/Card';
import { AvailableMark, Chip } from '@/components/Chip';
import { Checkbox, FieldStack, OptionGroup, SelectField, TextField, ToggleRow } from '@/components/Field';
import { List, ListItem } from '@/components/List';
import PageHeader from '@/components/PageHeader';
import { MONTHLY_INVITES } from '@/data/employer';
import { MEMBERS } from '@/data/people';
import { MemberLink } from '@/features/directory/EntityLink';
import { plural } from '@/lib/format';
import { toggleItem } from '@/lib/toggleItem';
import { usePageTitle } from '@/lib/usePageTitle';
import { useAppStore } from '@/store';
import { toast } from '@/store/ui';
import { HoldNote } from './EmployerParts';
import styles from './employer.module.css';

const TRADES = [...new Set(MEMBERS.map((member) => member.trade))];
const DISTANCES = [
  { value: '30', label: 'Within 30 mi' },
  { value: '50', label: 'Within 50 mi' },
  { value: '100', label: 'Within 100 mi' },
  { value: '500', label: 'Any distance' },
];
const LISTED = ['OSHA 10', 'OSHA 30', 'NABCEP', 'NCCER', 'State electrical license'];
const NO_FILTERS = { query: '', trade: '', distance: '100', certifications: [], availableOnly: false };

const matches = (member, filters) => {
  const query = filters.query.trim().toLowerCase();
  return (
    (!query || `${member.name} ${member.headline} ${member.trade}`.toLowerCase().includes(query)) &&
    (!filters.trade || member.trade === filters.trade) &&
    filters.certifications.every((listed) => member.certifications.some((name) => name.startsWith(listed))) &&
    member.miles <= Number(filters.distance) &&
    (!filters.availableOnly || member.available)
  );
};

function Filters({ filters, onChange, onClear }) {
  return (
    <Card padded>
      <div className="row row-between">
        <h2 className="h3">Filters</h2>
        <Button variant="quiet" size="sm" onClick={onClear}>
          Clear
        </Button>
      </div>
      <FieldStack className="mt-12">
        <TextField
          id="talent-query"
          label="Keywords"
          placeholder="Name, trade or skill"
          optional={false}
          value={filters.query}
          onChange={(event) => onChange({ query: event.target.value })}
        />
        <SelectField
          id="talent-trade"
          label="Trade"
          placeholder="Any trade"
          optional={false}
          options={TRADES}
          value={filters.trade}
          onChange={(event) => onChange({ trade: event.target.value })}
        />
        <SelectField
          id="talent-distance"
          label="Distance from Chicago"
          placeholder=""
          optional={false}
          options={DISTANCES}
          value={filters.distance}
          onChange={(event) => onChange({ distance: event.target.value })}
        />
        <OptionGroup legend="Has listed">
          {LISTED.map((listed) => (
            <Checkbox
              key={listed}
              label={listed}
              checked={filters.certifications.includes(listed)}
              onChange={() => onChange({ certifications: toggleItem(filters.certifications, listed) })}
            />
          ))}
        </OptionGroup>
        <ToggleRow
          title="Available for work only"
          divided
          checked={filters.availableOnly}
          onChange={(event) => onChange({ availableOnly: event.target.checked })}
        />
      </FieldStack>
    </Card>
  );
}

function TalentRow({ member }) {
  const verified = useAppStore((state) => state.employer.verified);
  const invited = useAppStore((state) => state.employer.invitedMemberIds.includes(member.id));

  const invite = () => {
    if (useAppStore.getState().employer.invitesLeft <= 0) {
      toast('No invites left this month');
      return;
    }
    useAppStore.getState().inviteToApply(member.id);
    toast(`Invite sent to ${member.name}. They’ll see the job in their messages.`);
  };

  return (
    <ListItem top wrap>
      <Avatar name={member.name} size={48} />
      <span className={`grow ${styles.talentText}`}>
        <span className="row row-wrap gap-8">
          <MemberLink id={member.id} />
          {member.available && <AvailableMark small>Available</AvailableMark>}
        </span>
        <span className="block text-sm">{member.headline}</span>
        <span className="block text-sm subtle">
          {member.city} · {member.miles} mi from Chicago · {member.experience}
        </span>
        <span className="row row-wrap gap-8 mt-8">
          {member.certifications.map((certification) => (
            <Chip key={certification}>{certification}</Chip>
          ))}
        </span>
      </span>
      <span className="row gap-8">
        <ButtonLink variant="quiet" size="sm" to={`/members/${member.id}`}>
          Profile
        </ButtonLink>
        <Button size="sm" disabled={invited || !verified} onClick={invite}>
          {invited ? 'Invited' : 'Invite to apply'}
        </Button>
      </span>
    </ListItem>
  );
}

export default function TalentPage() {
  usePageTitle('Find talent');
  const verified = useAppStore((state) => state.employer.verified);
  const invitesLeft = useAppStore((state) => state.employer.invitesLeft);
  const [filters, setFilters] = useState(NO_FILTERS);
  const results = MEMBERS.filter((member) => matches(member, filters));

  return (
    <>
      <PageHeader title="Find talent" subtitle="People who chose to be found by verified employers." />
      <HoldNote />
      <div className="layout-aside-main">
        <Filters
          filters={filters}
          onChange={(fields) => setFilters((current) => ({ ...current, ...fields }))}
          onClear={() => setFilters(NO_FILTERS)}
        />
        <Card>
          <div className={styles.resultsHeader}>
            <p className="strong" role="status">
              {plural(results.length, 'person', 'people')}
            </p>
            <p className="text-sm subtle">
              <span className="tabular">{invitesLeft}</span> of {MONTHLY_INVITES} invites left this month
            </p>
          </div>
          <List className={styles.results}>
            {results.length ? (
              results.map((member) => <TalentRow key={member.id} member={member} />)
            ) : (
              <li className="empty">No one matches. Widen the distance or remove a filter.</li>
            )}
          </List>
          {!verified && <p className={styles.resultsFoot}>Invites unlock when your business is verified.</p>}
        </Card>
      </div>
    </>
  );
}
