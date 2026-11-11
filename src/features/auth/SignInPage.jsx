import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { FieldStack, TextField } from '@/components/Field';
import { DEMO_MODE } from '@/config';
import { DEMO_PASSWORD } from '@/data/personas';
import { firstName } from '@/lib/format';
import { useForm } from '@/lib/useForm';
import { usePageTitle } from '@/lib/usePageTitle';
import { email, required } from '@/lib/validation';
import { useAppStore } from '@/store';
import { toast } from '@/store/ui';
import DemoAccounts from './DemoAccounts';
import styles from './auth.module.css';

function EmailStep({ onKnown }) {
  const navigate = useNavigate();
  const form = useForm({ email: '' }, { email: [required('Enter your email.'), email()] });

  const submit = form.handleSubmit(({ email: address }) => {
    const account = useAppStore.getState().findAccount(address);
    if (account) onKnown(account);
    else navigate('/join', { state: { email: address.trim() } });
  });

  return (
    <form className="mt-24" onSubmit={submit} noValidate>
      <FieldStack>
        <TextField {...form.field('email')} label="Email" type="email" autoComplete="email" required />
        <Button type="submit" variant="primary" size="lg" block>
          Continue
        </Button>
      </FieldStack>
    </form>
  );
}

function PasswordStep({ account, onBack, onSignedIn }) {
  const form = useForm({ password: '' }, { password: required('Enter your password.') });

  const submit = form.handleSubmit(({ password }) => {
    if (account.demo && password !== DEMO_PASSWORD) {
      form.setError('password', 'That password isn’t right. Try again or reset it.');
      return;
    }
    onSignedIn(account);
  });

  return (
    <form className="mt-24" onSubmit={submit} noValidate>
      <FieldStack>
        <div className={styles.emailRow}>
          <span className="strong">{account.email}</span>
          <Button variant="text" size="sm" onClick={onBack}>
            Change
          </Button>
        </div>
        <TextField
          {...form.field('password')}
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
        />
        <Button
          variant="text"
          size="sm"
          className={styles.forgot}
          onClick={() => toast(`We sent a reset link to ${account.email}`)}
        >
          Forgot your password?
        </Button>
        <Button type="submit" variant="primary" size="lg" block>
          Sign in
        </Button>
      </FieldStack>
    </form>
  );
}

export default function SignInPage() {
  usePageTitle('Sign in');
  const [account, setAccount] = useState(null);

  const signIn = (found) => {
    useAppStore.getState().signIn(found.email);
    toast(`Welcome back, ${firstName(found.identity.name)}`);
  };

  const continueWithGoogle = () => {
    useAppStore.getState().signInDemo('pro');
    toast('Signed in with Google');
  };

  return (
    <div className={styles.column}>
      <Card className={styles.card}>
        <h1 className="h1">Sign in</h1>
        <p className="muted mt-4">Professionals and employers sign in here.</p>
        {account ? (
          <PasswordStep account={account} onBack={() => setAccount(null)} onSignedIn={signIn} />
        ) : (
          <>
            <EmailStep onKnown={setAccount} />
            <div className={`${styles.or} mt-16`}>or</div>
            <Button size="lg" block className="mt-16" onClick={continueWithGoogle}>
              Continue with Google
            </Button>
          </>
        )}
      </Card>
      <p className={styles.footer}>
        New here?{' '}
        <Link className="link" to="/join">
          Create an account
        </Link>
      </p>
      {DEMO_MODE && <DemoAccounts />}
    </div>
  );
}
