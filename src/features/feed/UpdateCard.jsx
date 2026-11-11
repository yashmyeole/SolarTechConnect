import { useState } from 'react';
import { useNavigate } from 'react-router';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/Button';
import Icon from '@/components/Icon';
import { List } from '@/components/List';
import { Menu, MenuItem } from '@/components/Menu';
import Photo from '@/components/Photo';
import { findGroup } from '@/data/community';
import { findJob } from '@/data/jobs';
import { CompanyLink, MemberLink } from '@/features/directory/EntityLink';
import { useDirectory } from '@/features/directory/useDirectory';
import JobLinkItem from '@/features/jobs/JobLinkItem';
import { formatCount } from '@/lib/format';
import { useAppStore, usePersona, useRole } from '@/store';
import { toast } from '@/store/ui';
import styles from './feed.module.css';

const MORE = [
  ['bookmark', 'Save', 'Saved for later'],
  ['send', 'Copy link', 'Link copied'],
  ['eye', 'Show fewer like this', 'You will see fewer updates like this'],
  ['info', 'Report', 'Thanks. Our team will review this update.'],
];

function Author({ author }) {
  const { member, company } = useDirectory();
  const name = author.kind === 'company' ? company(author.id).name : member(author.id).name;
  return <Avatar name={name} company={author.kind === 'company'} />;
}

function Replies({ post, canReply }) {
  const persona = usePersona();
  const [text, setText] = useState('');
  const inputId = `reply-${post.id}`;

  const submit = (event) => {
    event.preventDefault();
    if (!text.trim()) return document.getElementById(inputId).focus();
    useAppStore.getState().addReply(post.id, { authorId: persona.id, text: text.trim() });
    setText('');
  };

  return (
    <div className={styles.replies}>
      {post.replies.map((reply, index) => (
        <div key={index} className="row row-top gap-8">
          <Author author={{ kind: 'member', id: reply.authorId }} />
          <div className={`${styles.reply} grow`}>
            <p className="text-sm">
              <MemberLink id={reply.authorId} />
            </p>
            <p>{reply.text}</p>
          </div>
        </div>
      ))}
      {canReply && (
        <form className="row gap-8" onSubmit={submit}>
          <Avatar name={persona.name} size={32} />
          <label className="sr-only" htmlFor={inputId}>
            Write a reply
          </label>
          <input
            id={inputId}
            className={styles.replyInput}
            placeholder="Write a reply"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <Button type="submit" size="sm">
            Reply
          </Button>
        </form>
      )}
    </div>
  );
}

export default function UpdateCard({ post }) {
  const role = useRole();
  const navigate = useNavigate();
  const { member, company } = useDirectory();
  const liked = useAppStore((state) => state.likedPostIds.includes(post.id));
  const following = useAppStore((state) => state.followingCompanyIds.includes(post.author.id));
  const [repliesOpen, setRepliesOpen] = useState(Boolean(post.repliesOpen));
  const isCompany = post.author.kind === 'company';
  const group = post.groupId && findGroup(post.groupId);
  const subtitle = group
    ? `In ${group.name}`
    : isCompany
      ? `${formatCount(company(post.author.id).followers)} followers`
      : member(post.author.id).headline;

  const follow = () => {
    useAppStore.getState().toggleFollow(post.author.id);
    toast(`You’re following ${company(post.author.id).name}`);
  };

  return (
    <article className={styles.update}>
      <div className="row row-top">
        <Author author={post.author} />
        <div className="grow">
          <p>{isCompany ? <CompanyLink id={post.author.id} /> : <MemberLink id={post.author.id} />}</p>
          <p className="text-sm subtle">
            {subtitle}
            <span className="sep">{post.time === 'Now' ? 'Just now' : post.time}</span>
          </p>
        </div>
        {isCompany && role === 'pro' && !following && (
          <Button variant="text" size="sm" onClick={follow}>
            Follow
          </Button>
        )}
        <Menu
          label="Update options"
          trigger={(props) => (
            <Button iconOnly size="sm" aria-label="Options for this update" {...props}>
              <Icon name="more" size={18} />
            </Button>
          )}
        >
          {MORE.map(([icon, label, message]) => (
            <MenuItem key={label} icon={icon} onSelect={() => toast(message)}>
              {label}
            </MenuItem>
          ))}
        </Menu>
      </div>
      <p className={styles.body}>{post.text}</p>
      {post.photo && <Photo tone={post.photo.tone} label={post.photo.label} className={styles.photo} />}
      {post.jobIds && (
        <List className={styles.jobs}>
          {post.jobIds.map((id) => (
            <JobLinkItem key={id} job={findJob(id)} compact />
          ))}
        </List>
      )}
      <div className={styles.actions}>
        <Button
          variant="quiet"
          size="sm"
          on={liked}
          aria-pressed={liked}
          onClick={() => (role ? useAppStore.getState().toggleLike(post.id) : navigate('/signin'))}
        >
          <Icon name="like" size={18} />
          Helpful <span className="tabular subtle">{post.likes + (liked ? 1 : 0)}</span>
        </Button>
        <Button variant="quiet" size="sm" aria-expanded={repliesOpen} onClick={() => setRepliesOpen(!repliesOpen)}>
          <Icon name="chat" size={18} />
          Reply {post.replies.length > 0 && <span className="tabular subtle">{post.replies.length}</span>}
        </Button>
        <Button variant="quiet" size="sm" onClick={() => toast('Link copied. Paste it in a message or another app.')}>
          <Icon name="send" size={18} />
          Share
        </Button>
      </div>
      {repliesOpen && <Replies post={post} canReply={Boolean(role)} />}
    </article>
  );
}
