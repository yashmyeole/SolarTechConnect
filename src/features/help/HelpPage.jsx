import { useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import Icon from '@/components/Icon';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';
import { SUPPORT } from '@/data/options';
import { firstName } from '@/lib/format';
import { usePageTitle } from '@/lib/usePageTitle';
import { usePersona, useRole } from '@/store';
import { toast } from '@/store/ui';
import styles from './help.module.css';

const TOPICS = [
  ['users', 'Getting started', ['Create your account', 'Professional or employer?', 'Sign in with Google']],
  ['doc', 'Your profile', ['Add work photos', 'List licenses and certifications', 'Show you’re available for work']],
  ['briefcase', 'Jobs and applications', ['Search and filter jobs', 'Follow an application', 'Save a search']],
  ['building', 'For employers', ['How the business check works', 'Post a job', 'Move candidates through stages']],
  ['chat', 'Messages and people', ['Who can message you', 'Add contacts', 'Join a group']],
  [
    'lock',
    'Account and security',
    ['Change your password', 'Turn on two-step sign-in', 'Download or delete your data'],
  ],
];

export default function HelpPage() {
  usePageTitle('Help');
  const role = useRole();
  const persona = usePersona();
  const [query, setQuery] = useState('');

  const search = (event) => {
    event.preventDefault();
    toast(query.trim() ? `Showing help articles for “${query.trim()}”` : 'Type a question or a few words');
  };

  return (
    <>
      <PageHeader title={`How can we help${role ? `, ${firstName(persona.name)}` : ''}?`} />
      <Card as="form" role="search" className={styles.search} onSubmit={search}>
        <SearchInput
          label="Search help, for example “change password”"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button type="submit" variant="primary" className={styles.searchButton}>
          Search
        </Button>
      </Card>
      <div className="card-grid mt-16">
        {TOPICS.map(([icon, title, articles]) => (
          <Card key={title} padded>
            <div className="row gap-8">
              <span className={styles.icon}>
                <Icon name={icon} size={18} />
              </span>
              <h2 className="h3">{title}</h2>
            </div>
            <ul className="mt-12">
              {articles.map((article) => (
                <li key={article} className={styles.article}>
                  <button type="button" className="link" onClick={() => toast(`Article: ${article}`)}>
                    {article}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <Card padded className="mt-16">
        <h2 className="h3">Talk to a person</h2>
        <p className="muted mt-4">We answer within one business day.</p>
        <div className="row row-wrap gap-24 mt-12">
          <a className="row gap-8 hover-underline" href={`mailto:${SUPPORT.email}`}>
            <Icon name="mail" />
            {SUPPORT.email}
          </a>
          <a className="row gap-8 hover-underline" href={`tel:${SUPPORT.tel}`}>
            <Icon name="phone" />
            {SUPPORT.phone}
          </a>
        </div>
      </Card>
    </>
  );
}
