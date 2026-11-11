import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Select } from '@/components/Field';
import Icon from '@/components/Icon';
import SearchInput from '@/components/SearchInput';
import { SplitView } from '@/components/SplitView';
import { findJob } from '@/data/jobs';
import { useDirectory } from '@/features/directory/useDirectory';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { usePageTitle } from '@/lib/usePageTitle';
import FiltersDrawer from './FiltersDrawer';
import JobDetail from './JobDetail';
import { FILTERS, filterJobs, optionLabel, SORTS } from './jobFilters';
import JobList from './JobList';
import JobsHeader from './JobsHeader';
import { useJobFilters } from './useJobFilters';
import styles from './jobs.module.css';

function SearchBar({ filters, onChange }) {
  const [location, setLocation] = useState(filters.location);
  const submit = (event) => {
    event.preventDefault();
    onChange({ location: location.trim() || filters.location });
  };
  return (
    <Card as="form" role="search" className={styles.searchBar} onSubmit={submit}>
      <SearchInput
        label="Title, company or keyword"
        value={filters.q}
        onChange={(event) => onChange({ q: event.target.value })}
      />
      <SearchInput
        label="City or ZIP code"
        icon="pin"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
      />
      <Button type="submit" variant="primary" className={styles.searchButton}>
        Search
      </Button>
    </Card>
  );
}

function Toolbar({ filters, active, onOpenFilters, onChange, onClearAll }) {
  return (
    <div className="toolbar">
      <Button size="sm" onClick={onOpenFilters}>
        <Icon name="sliders" size={16} />
        Filters
        {active.length > 0 && <span className={styles.badge}>{active.length}</span>}
      </Button>
      {active.map((key) => (
        <button
          key={key}
          type="button"
          className={styles.filterChip}
          aria-label={`Remove filter: ${optionLabel(key, filters[key])}`}
          onClick={() => onChange({ [key]: FILTERS[key].fallback })}
        >
          {optionLabel(key, filters[key])}
          <Icon name="x" size={14} />
        </button>
      ))}
      {active.length > 0 && (
        <Button variant="quiet" size="sm" onClick={onClearAll}>
          Clear all
        </Button>
      )}
      <span className="grow" />
      <label className="row gap-8 text-sm muted">
        Sort
        <Select
          small
          aria-label="Sort jobs"
          value={filters.sort}
          options={SORTS.map(([value, label]) => ({ value, label }))}
          onChange={(event) => onChange({ sort: event.target.value })}
        />
      </label>
    </div>
  );
}

export default function JobSearchPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { company } = useDirectory();
  const { filters, active, search, update, clearAll } = useJobFilters();
  const wide = useMediaQuery('(min-width: 900px)');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const detailRef = useRef(null);

  const jobs = filterJobs(filters, (id) => company(id).name);
  const requested = jobId ? findJob(jobId) : null;
  const selected = requested ?? (wide ? jobs[0] : null);
  usePageTitle(requested ? requested.title : 'Jobs');

  useEffect(() => {
    const card = detailRef.current;
    if (!wide || !card || !jobId) return;
    const top = card.getBoundingClientRect().top;
    if (top < 12) scrollBy({ top: top - 12 });
  }, [jobId, wide]);

  const open = (id) =>
    navigate(
      { pathname: `/jobs/${id}`, search: search && `?${search}` },
      wide ? { replace: true, preventScrollReset: true } : {},
    );

  if (!wide && requested) {
    return (
      <JobDetail
        key={requested.id}
        job={requested}
        onBack={() => navigate({ pathname: '/jobs', search: search && `?${search}` })}
      />
    );
  }

  return (
    <>
      <JobsHeader current="search" />
      <SearchBar key={filters.location} filters={filters} onChange={update} />
      <Toolbar
        filters={filters}
        active={active}
        onOpenFilters={() => setFiltersOpen(true)}
        onChange={update}
        onClearAll={clearAll}
      />
      <SplitView>
        <JobList jobs={jobs} selectedId={selected?.id} filters={filters} onOpen={open} />
        {wide && (
          <Card ref={detailRef}>
            {selected ? (
              <JobDetail key={selected.id} job={selected} />
            ) : (
              <div className="empty">
                <p className="h3">No jobs match these filters</p>
                <p className="mt-8">Try a wider distance or remove a filter.</p>
                <Button className="mt-16" onClick={clearAll}>
                  Clear filters
                </Button>
              </div>
            )}
          </Card>
        )}
      </SplitView>
      {filtersOpen && (
        <FiltersDrawer
          filters={filters}
          resultCount={jobs.length}
          onChange={update}
          onClear={clearAll}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </>
  );
}
