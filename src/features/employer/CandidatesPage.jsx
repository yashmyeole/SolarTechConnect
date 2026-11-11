import { Fragment, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import Avatar from '@/components/Avatar';
import { Button, ButtonLink } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Select } from '@/components/Field';
import Icon from '@/components/Icon';
import PageHeader from '@/components/PageHeader';
import { Segmented } from '@/components/Segmented';
import {
  DetailArticle,
  DetailSection,
  ListPane,
  PaneRow,
  RowLine,
  RowMeta,
  RowTitle,
  SplitView,
} from '@/components/SplitView';
import { findJob } from '@/data/jobs';
import { PIPELINE_STAGES } from '@/data/options';
import { useDirectory } from '@/features/directory/useDirectory';
import { useOpenConversation } from '@/features/directory/useOpenConversation';
import { todayShort } from '@/lib/format';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { usePageTitle } from '@/lib/usePageTitle';
import { useAppStore, usePersona } from '@/store';
import { toast } from '@/store/ui';
import { HoldNote } from './EmployerParts';
import styles from './employer.module.css';

const LAST_STAGE = PIPELINE_STAGES.length - 1;

const VIEWS = [
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board' },
];

function useCandidateActions(onDone) {
  const { member } = useDirectory();
  return {
    advance: (memberId) => {
      const stage = useAppStore.getState().advanceCandidate(memberId);
      onDone();
      toast(`${member(memberId).name} moved to ${PIPELINE_STAGES[stage]}. They’ve been told.`);
    },
    reject: (memberId) => {
      useAppStore.getState().rejectCandidate(memberId);
      onDone();
      toast(`${member(memberId).name} marked not a fit. They get a short, polite update.`);
    },
  };
}

function TeamNotes({ candidate }) {
  const persona = usePersona();
  const { member } = useDirectory();
  const [text, setText] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const note = text.trim();
    if (!note) return;
    useAppStore
      .getState()
      .addCandidateNote(candidate.memberId, { authorId: persona.id, text: note, date: todayShort() });
    setText('');
  };

  return (
    <DetailSection>
      <h3 className="h3">Team notes</h3>
      <form className="row row-top gap-8 mt-8" onSubmit={submit}>
        <label className="sr-only" htmlFor="candidate-note">
          Add a note
        </label>
        <textarea
          id="candidate-note"
          className={styles.noteInput}
          placeholder="Only your hiring team sees notes"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <Button type="submit" size="sm" className={styles.noteButton}>
          Add
        </Button>
      </form>
      <ul className="stack gap-8 mt-12">
        {candidate.notes.map((note, index) => (
          <li key={index} className="row row-top gap-8">
            <Avatar name={member(note.authorId).name} size={32} />
            <div className={`grow ${styles.note}`}>
              <p className="text-sm">
                <b className="strong">{member(note.authorId).name}</b> <span className="subtle">· {note.date}</span>
              </p>
              <p>{note.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </DetailSection>
  );
}

function CandidateDetail({ candidate, jobId, actions, onBack }) {
  const { member } = useDirectory();
  const openConversation = useOpenConversation();
  const person = member(candidate.memberId);
  const asked = findJob(jobId)?.certifications ?? [];
  const matched = person.certifications.filter((certification) => asked.includes(certification)).length;
  const next = PIPELINE_STAGES[candidate.stage + 1];

  return (
    <DetailArticle onBack={onBack} backLabel="All candidates">
      <div className="row row-top">
        <Avatar name={person.name} size={56} />
        <div className="grow">
          <h2 className="h2">
            <Link className="hover-underline" to={`/members/${person.id}`}>
              {person.name}
            </Link>
          </h2>
          <p>{person.headline}</p>
          <p className="text-sm subtle mt-4">
            {person.city} · {candidate.miles} miles from the job · Applied {candidate.appliedOn}
          </p>
        </div>
        <Chip tone="brand">{PIPELINE_STAGES[candidate.stage]}</Chip>
      </div>
      <div className="row row-wrap gap-8 mt-16">
        {next ? (
          <Button variant="primary" onClick={() => actions.advance(person.id)}>
            Move to {next}
          </Button>
        ) : (
          <Chip tone="ok">Hired</Chip>
        )}
        <Button onClick={() => openConversation(person.id)}>Message</Button>
        <Button onClick={() => actions.reject(person.id)}>Not a fit</Button>
      </div>
      <DetailSection>
        <h3 className="h3">Answers</h3>
        <dl className="kv mt-8">
          {[
            ['Reliable transport to the site?', candidate.answers.transport],
            ['Earliest start date', candidate.answers.start],
          ].map(([question, answer]) => (
            <Fragment key={question}>
              <dt>{question}</dt>
              <dd>{answer}</dd>
            </Fragment>
          ))}
        </dl>
      </DetailSection>
      <DetailSection>
        <h3 className="h3">Résumé</h3>
        <Card className={`row mt-8 ${styles.resume}`}>
          <Icon name="doc" size={22} />
          <span className="grow">
            {person.name.replace(' ', '-')}-resume.pdf
            <span className="block text-sm subtle">PDF · 2 pages</span>
          </span>
          <Button variant="text" size="sm" onClick={() => toast('Résumé opened')}>
            Open
          </Button>
        </Card>
      </DetailSection>
      <DetailSection>
        <h3 className="h3">Licenses and certifications</h3>
        <p className="text-sm muted mt-4">
          {asked.length
            ? `Lists ${matched} of the ${asked.length} this job asks for. `
            : 'This job doesn’t ask for any. '}
          Listed by the candidate, not checked; ask to see cards at interview.
        </p>
        <ul className="stack gap-8 mt-12">
          {person.certifications.map((certification) => (
            <li key={certification} className="row gap-8">
              {asked.includes(certification) ? (
                <Chip tone="ok">
                  <Icon name="check" size={14} stroke={2.2} />
                  Asked for
                </Chip>
              ) : (
                <Chip>Extra</Chip>
              )}
              {certification}
            </li>
          ))}
        </ul>
      </DetailSection>
      <TeamNotes candidate={candidate} />
    </DetailArticle>
  );
}

function CandidateRow({ candidate, selected, onOpen }) {
  const { member } = useDirectory();
  const person = member(candidate.memberId);
  return (
    <PaneRow selected={selected} onClick={() => onOpen(candidate.memberId)}>
      <Avatar name={person.name} />
      <span className="grow">
        <RowTitle>{person.name}</RowTitle>
        <RowLine>
          {person.trade} · {person.experience}
        </RowLine>
        <RowMeta>
          {person.city} · {candidate.miles} mi · Applied {candidate.appliedOn}
        </RowMeta>
      </span>
    </PaneRow>
  );
}

function Board({ candidates, linkTo, actions }) {
  const { member } = useDirectory();
  return (
    <div className={styles.board}>
      {PIPELINE_STAGES.map((stage, index) => {
        const inStage = candidates.filter((candidate) => candidate.stage === index);
        return (
          <section key={stage} className={styles.column} aria-label={stage}>
            <div className={styles.columnHeader}>
              <span>{stage}</span>
              <span className="subtle tabular">{inStage.length}</span>
            </div>
            {inStage.length ? (
              inStage.map((candidate) => {
                const person = member(candidate.memberId);
                return (
                  <div key={person.id} className={styles.boardCard}>
                    <div className="row gap-8">
                      <Avatar name={person.name} size={32} />
                      <div className="grow">
                        <Link className="strong hover-underline" to={linkTo(person.id)}>
                          {person.name}
                        </Link>
                        <p className="text-xs subtle">
                          {person.trade} · {candidate.miles} mi · {candidate.appliedOn}
                        </p>
                      </div>
                    </div>
                    <div className="row gap-4">
                      {index < LAST_STAGE && (
                        <Button size="sm" className="grow" onClick={() => actions.advance(person.id)}>
                          Move to {PIPELINE_STAGES[index + 1]}
                        </Button>
                      )}
                      <Button
                        iconOnly
                        size="sm"
                        aria-label={`Not a fit: ${person.name}`}
                        onClick={() => actions.reject(person.id)}
                      >
                        <Icon name="x" size={18} />
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm subtle">No one here.</p>
            )}
          </section>
        );
      })}
    </div>
  );
}

export default function CandidatesPage() {
  usePageTitle('Candidates');
  const [params, setParams] = useSearchParams();
  const wide = useMediaQuery('(min-width: 900px)');
  const jobs = useAppStore(useShallow((state) => state.employer.jobs.filter((job) => job.status === 'open')));
  const candidates = useAppStore((state) => state.employer.candidates);

  const job = jobs.find((entry) => String(entry.id) === params.get('job')) ?? jobs[0];
  const pool = job?.applicants ? candidates : [];
  const view = params.get('view') === 'board' ? 'board' : 'list';
  const picked = pool.find((candidate) => candidate.memberId === params.get('candidate'));
  const stage = picked?.stage ?? Math.min(Math.max(Number(params.get('stage')) || 0, 0), LAST_STAGE);
  const inStage = pool.filter((candidate) => candidate.stage === stage);
  const selected = picked ?? (wide ? inStage[0] : undefined);

  const update = (fields, push = false) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        for (const [key, value] of Object.entries(fields)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        return next;
      },
      push ? {} : { replace: true, preventScrollReset: true },
    );

  const linkTo = (memberId) => {
    const next = new URLSearchParams(params);
    next.delete('view');
    next.delete('stage');
    next.set('candidate', memberId);
    return `?${next}`;
  };

  const actions = useCandidateActions(() => update({ candidate: null, stage: stage ? String(stage) : null }));
  const backToList = () => update({ candidate: null, stage: stage ? String(stage) : null }, true);

  if (!wide && picked && view === 'list') {
    return (
      <CandidateDetail key={picked.memberId} candidate={picked} jobId={job.id} actions={actions} onBack={backToList} />
    );
  }

  return (
    <>
      <PageHeader
        title="Candidates"
        actions={
          <Segmented
            label="View"
            items={VIEWS}
            value={view}
            onChange={(value) => update({ view: value === 'board' ? value : null, candidate: null })}
          />
        }
      />
      <HoldNote />
      {job ? (
        <>
          <div className="toolbar">
            <label className={`row gap-8 ${styles.jobPicker}`}>
              <span className="text-sm muted">Job</span>
              <Select
                className={styles.jobSelect}
                value={String(job.id)}
                options={jobs.map((entry) => ({
                  value: String(entry.id),
                  label: `${entry.title} · ${entry.location}`,
                }))}
                onChange={(event) => update({ job: event.target.value, stage: null, candidate: null })}
              />
            </label>
            {findJob(job.id) && (
              <ButtonLink variant="quiet" size="sm" to={`/jobs/${job.id}`}>
                View job posting
              </ButtonLink>
            )}
          </div>
          {view === 'board' ? (
            <Board candidates={pool} linkTo={linkTo} actions={actions} />
          ) : (
            <>
              <div className="toolbar">
                <Segmented
                  label="Stage"
                  items={PIPELINE_STAGES.map((label, index) => ({
                    value: index,
                    label,
                    count: pool.filter((candidate) => candidate.stage === index).length,
                  }))}
                  value={stage}
                  onChange={(value) => update({ stage: value ? String(value) : null, candidate: null })}
                />
              </div>
              <SplitView>
                <ListPane
                  title={
                    <p className="strong">
                      {PIPELINE_STAGES[stage]} · {inStage.length}
                    </p>
                  }
                  action={
                    <Button
                      variant="quiet"
                      size="sm"
                      onClick={() => toast('Sort by applied date, distance or listed credentials')}
                    >
                      <Icon name="sliders" size={16} />
                      Sort
                    </Button>
                  }
                >
                  {inStage.length ? (
                    inStage.map((candidate) => (
                      <CandidateRow
                        key={candidate.memberId}
                        candidate={candidate}
                        selected={candidate.memberId === selected?.memberId}
                        onOpen={(memberId) => update({ candidate: memberId }, !wide)}
                      />
                    ))
                  ) : (
                    <p className="empty">
                      {pool.length
                        ? 'No candidates at this stage.'
                        : 'No candidates yet. We’ll let you know when someone applies.'}
                    </p>
                  )}
                </ListPane>
                {wide && (
                  <Card>
                    {selected ? (
                      <CandidateDetail key={selected.memberId} candidate={selected} jobId={job.id} actions={actions} />
                    ) : (
                      <p className="empty">No candidates at this stage.</p>
                    )}
                  </Card>
                )}
              </SplitView>
            </>
          )}
          <p className="text-xs subtle mt-12">
            Moving someone to a new stage updates their application and sends them a notification.
          </p>
        </>
      ) : (
        <Card>
          <p className="empty">No open jobs. Post a job to start receiving candidates.</p>
        </Card>
      )}
    </>
  );
}
