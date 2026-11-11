import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import Avatar from '@/components/Avatar';
import { Button, ButtonLink } from '@/components/Button';
import { Card } from '@/components/Card';
import Icon from '@/components/Icon';
import PageHeader from '@/components/PageHeader';
import SearchInput from '@/components/SearchInput';
import { Segmented } from '@/components/Segmented';
import { MONTHLY_INVITES } from '@/data/employer';
import { findJob } from '@/data/jobs';
import { APPLICATION_STAGES, PIPELINE_STAGES } from '@/data/options';
import { useDirectory } from '@/features/directory/useDirectory';
import ApplyDialog from '@/features/jobs/ApplyDialog';
import { cx } from '@/lib/cx';
import { formatPay } from '@/lib/format';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { usePageTitle } from '@/lib/usePageTitle';
import { useAppStore, useRole } from '@/store';
import { toast } from '@/store/ui';
import styles from './messages.module.css';

function useContact(contact) {
  const { member, company } = useDirectory();
  if (contact.kind === 'company') {
    return { name: company(contact.id).name, isCompany: true, to: `/companies/${contact.id}` };
  }
  return { name: member(contact.id)?.name ?? contact.id, isCompany: false, to: `/members/${contact.id}` };
}

function ThreadItem({ thread, current, onOpen }) {
  const contact = useContact(thread.with);
  const last = thread.messages.at(-1);
  const preview = last ? `${last.from === 'me' ? 'You: ' : ''}${last.text ?? 'Shared a job'}` : 'New conversation';
  return (
    <button
      type="button"
      className={styles.thread}
      aria-current={current ? 'page' : undefined}
      onClick={() => onOpen(thread.id)}
    >
      <Avatar name={contact.name} company={contact.isCompany} />
      <span className="grow">
        <span className="row row-between gap-8">
          <span className="strong">{contact.name}</span>
          <span className="text-xs subtle">{thread.time}</span>
        </span>
        <span className={cx('text-sm', styles.preview, thread.unread ? styles.unreadPreview : 'muted')}>{preview}</span>
      </span>
      {thread.unread && <span className={styles.unread} aria-label="Unread" />}
    </button>
  );
}

function ThreadList({ threads, activeId, onOpen }) {
  const role = useRole();
  const { member, company } = useDirectory();
  const invitesLeft = useAppStore((state) => state.employer.invitesLeft);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const nameOf = (thread) =>
    thread.with.kind === 'company' ? company(thread.with.id).name : (member(thread.with.id)?.name ?? '');
  const visible = threads.filter(
    (thread) =>
      (filter === 'all' || (filter === 'unread' ? thread.unread : thread.topic === 'jobs')) &&
      nameOf(thread).toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className={styles.list}>
      <div className={styles.listTools}>
        <SearchInput label="Search messages" value={query} onChange={(event) => setQuery(event.target.value)} />
        <div className="mt-8">
          <Segmented
            label="Filter conversations"
            small
            value={filter}
            onChange={setFilter}
            items={[
              { value: 'all', label: 'All' },
              { value: 'unread', label: 'Unread' },
              { value: 'jobs', label: role === 'emp' ? 'Candidates' : 'About jobs' },
            ]}
          />
        </div>
      </div>
      <div className={styles.threads}>
        {visible.map((thread) => (
          <ThreadItem key={thread.id} thread={thread} current={thread.id === activeId} onOpen={onOpen} />
        ))}
        {!visible.length && <p className="empty">No conversations here.</p>}
      </div>
      {role === 'emp' && (
        <p className={`text-xs subtle ${styles.invites}`}>
          Free with applicants and contacts. <span className="tabular">{invitesLeft}</span> of {MONTHLY_INVITES} invites
          left this month for anyone else.
        </p>
      )}
    </div>
  );
}

function JobContext({ thread, onApply }) {
  const role = useRole();
  const job = findJob(thread.jobId);
  const application = useAppStore((state) => state.applications.find((entry) => entry.jobId === thread.jobId));
  const candidate = useAppStore((state) =>
    state.employer.candidates.find((entry) => entry.memberId === thread.with.id),
  );
  const stage =
    role === 'emp'
      ? candidate && PIPELINE_STAGES[candidate.stage]
      : application && APPLICATION_STAGES[application.stage];
  return (
    <div className={styles.context}>
      <Icon name="briefcase" size={18} />
      <span className="grow">
        About{' '}
        <Link className="strong hover-underline" to={`/jobs/${job.id}`}>
          {job.title}
        </Link>
        {stage && (
          <span className="sep">
            {role === 'emp' ? 'Stage' : 'Your application'}: <b className="strong">{stage}</b>
          </span>
        )}
      </span>
      {role === 'emp' ? (
        <ButtonLink
          size="sm"
          to={candidate ? `/employer/candidates?candidate=${thread.with.id}` : `/members/${thread.with.id}`}
        >
          {candidate ? 'Open candidate' : 'View profile'}
        </ButtonLink>
      ) : (
        !application && (
          <Button variant="primary" size="sm" onClick={onApply}>
            Apply
          </Button>
        )
      )}
    </div>
  );
}

function Conversation({ thread, onBack }) {
  const role = useRole();
  const { company } = useDirectory();
  const contact = useContact(thread.with);
  const [draft, setDraft] = useState('');
  const [applying, setApplying] = useState(false);
  const logRef = useRef(null);
  const last = thread.messages.at(-1);

  useEffect(() => {
    const log = logRef.current;
    log.scrollTop = log.scrollHeight;
  }, [thread.id, thread.messages.length]);

  const send = (text) => {
    if (!text.trim()) return;
    useAppStore.getState().sendMessage(role, thread.id, text.trim());
    setDraft('');
    document.getElementById('message-input')?.focus();
  };

  return (
    <div className={styles.conversation}>
      <div className={`row ${styles.conversationHeader}`}>
        {onBack && (
          <Button iconOnly aria-label="Back to conversations" onClick={onBack}>
            <Icon name="chevronLeft" />
          </Button>
        )}
        <Avatar name={contact.name} company={contact.isCompany} />
        <div className="grow">
          <Link className="strong hover-underline" to={contact.to}>
            {contact.name}
          </Link>
          <p className={`text-sm subtle ${styles.subtitle}`}>{thread.subtitle}</p>
        </div>
        <Button iconOnly aria-label="Conversation options" onClick={() => toast('Mute, archive, report or block')}>
          <Icon name="more" />
        </Button>
      </div>
      {thread.jobId && <JobContext thread={thread} onApply={() => setApplying(true)} />}
      <div ref={logRef} className={styles.log} aria-live="polite">
        {thread.messages.length === 0 && <p className={styles.day}>Say hello to {contact.name}</p>}
        {thread.messages.map((message, index) => {
          const job = message.jobId && findJob(message.jobId);
          const newDay = index === 0 || thread.messages[index - 1].day !== message.day;
          return (
            <div key={index} className="stack gap-4">
              {newDay && <p className={styles.day}>{message.day}</p>}
              <div className={cx(styles.message, message.from === 'me' && styles.mine)}>
                {job ? (
                  <Link className={styles.jobCard} to={`/jobs/${job.id}`}>
                    <Avatar name={company(job.companyId).name} company />
                    <span className="grow">
                      <span className="strong block">{job.title}</span>
                      <span className="text-sm muted">
                        {company(job.companyId).name} · {formatPay(job)}
                      </span>
                    </span>
                    <Icon name="chevronRight" size={18} />
                  </Link>
                ) : (
                  <p className={styles.bubble}>{message.text}</p>
                )}
                <span className={styles.time}>{message.time}</span>
              </div>
            </div>
          );
        })}
      </div>
      {role === 'pro' && thread.quickReplies && last?.from === 'them' && (
        <div className={`row row-wrap gap-8 ${styles.quickReplies}`}>
          {thread.quickReplies.map((reply) => (
            <Button key={reply} size="sm" onClick={() => send(reply)}>
              {reply}
            </Button>
          ))}
        </div>
      )}
      <form
        className={styles.composer}
        onSubmit={(event) => {
          event.preventDefault();
          send(draft);
        }}
      >
        <Button iconOnly aria-label="Attach a photo or file" onClick={() => toast('Attach a photo or file')}>
          <Icon name="image" />
        </Button>
        {role === 'emp' && (
          <Button iconOnly aria-label="Suggest interview times" onClick={() => toast('Pick times from your calendar')}>
            <Icon name="calendar" />
          </Button>
        )}
        <label className="sr-only" htmlFor="message-input">
          Write a message
        </label>
        <textarea
          id="message-input"
          className={styles.input}
          rows={1}
          placeholder="Write a message"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              send(draft);
            }
          }}
        />
        <Button type="submit" variant="primary" aria-label="Send">
          <Icon name="send" size={18} />
        </Button>
      </form>
      {applying && <ApplyDialog job={findJob(thread.jobId)} onClose={() => setApplying(false)} />}
    </div>
  );
}

export default function MessagesPage() {
  usePageTitle('Messages');
  const { threadId } = useParams();
  const navigate = useNavigate();
  const role = useRole();
  const threads = useAppStore((state) => state.threads[role]);
  const wide = useMediaQuery('(min-width: 900px)');
  const requested = threadId ? threads.find((thread) => thread.id === Number(threadId)) : null;
  const active = requested ?? (wide ? threads[0] : null);

  useEffect(() => {
    if (active?.unread) useAppStore.getState().markThreadRead(role, active.id);
  }, [active, role]);

  if (threadId && !requested) return <Navigate to="/messages" replace />;

  const open = (id) => navigate(`/messages/${id}`, wide ? { replace: true } : {});
  const showList = wide || !active;
  const showConversation = Boolean(active);

  return (
    <>
      <PageHeader
        title="Messages"
        actions={
          <Button onClick={() => toast('Choose a contact or candidate to message')}>
            <Icon name="pen" size={18} />
            New message
          </Button>
        }
      />
      <Card className={cx(styles.layout, !(showList && showConversation) && styles.single)}>
        {showList && <ThreadList threads={threads} activeId={active?.id} onOpen={open} />}
        {showConversation && (
          <Conversation key={active.id} thread={active} onBack={wide ? undefined : () => navigate('/messages')} />
        )}
      </Card>
    </>
  );
}
