import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import Icon from '@/components/Icon';
import Note from '@/components/Note';
import { DEMO_MODE } from '@/config';
import { usePageTitle } from '@/lib/usePageTitle';
import { createAccount } from './createAccount';
import JoinFlow from './JoinFlow';
import styles from './auth.module.css';

const ROLE_PATHS = { professional: 'pro', employer: 'emp' };

const CHOICES = [
  {
    path: 'professional',
    icon: 'users',
    title: 'I’m looking for solar work',
    text: 'Build a profile, find jobs, keep in touch with crews.',
    steps: '3 short steps',
  },
  {
    path: 'employer',
    icon: 'building',
    title: 'I’m hiring',
    text: 'Post jobs, review candidates, run a company page.',
    steps: '4 steps, including a quick business check',
  },
];

function RoleChoice({ email }) {
  const navigate = useNavigate();
  return (
    <div className={`${styles.column} ${styles.wide}`}>
      <Card className={styles.card}>
        <h1 className="h1">Create your account</h1>
        <p className="muted mt-4">How will you use Solar Tech Connect?</p>
        {email && (
          <Note tone="info" className="mt-16">
            There’s no account for <b>{email}</b> yet, so we brought you here to create one. Your email is already
            filled in.
          </Note>
        )}
        <div className="stack mt-24">
          {CHOICES.map((choice) => (
            <button
              key={choice.path}
              type="button"
              className={styles.choice}
              onClick={() => navigate(`/join/${choice.path}`, { state: { email } })}
            >
              <span className={styles.iconBox}>
                <Icon name={choice.icon} size={22} />
              </span>
              <span className="grow">
                <span className="h3 block">{choice.title}</span>
                <span className="muted">{choice.text}</span>
                <span className="block text-sm subtle mt-4">{choice.steps}</span>
              </span>
              <Icon name="chevronRight" />
            </button>
          ))}
        </div>
      </Card>
      <p className={styles.footer}>
        Already have an account?{' '}
        <Link className="link" to="/signin">
          Sign in
        </Link>
      </p>
      {DEMO_MODE && (
        <Note tone="info" className={styles.demo}>
          <p className="strong">Demo</p>
          <p className="text-sm muted">Create a sample account in one click, without typing anything.</p>
          <div className="row row-wrap gap-8 mt-8">
            <Button size="sm" onClick={() => createAccount('pro')}>
              Create a demo professional
            </Button>
            <Button size="sm" onClick={() => createAccount('emp')}>
              Create a demo employer
            </Button>
          </div>
        </Note>
      )}
    </div>
  );
}

export default function JoinPage() {
  const { role: rolePath } = useParams();
  const { state } = useLocation();
  const role = ROLE_PATHS[rolePath];
  usePageTitle(role ? `Join as ${rolePath === 'professional' ? 'a professional' : 'an employer'}` : 'Join');

  if (rolePath && !role) return <Navigate to="/join" replace />;
  if (!role) return <RoleChoice email={state?.email} />;
  return <JoinFlow key={role} role={role} email={state?.email ?? ''} />;
}
