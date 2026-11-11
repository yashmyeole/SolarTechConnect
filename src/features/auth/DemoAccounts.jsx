import { Button } from '@/components/Button';
import Note from '@/components/Note';
import { DEMO_PASSWORD, PERSONAS, ROLE_LABEL } from '@/data/personas';
import { useAppStore } from '@/store';
import { toast } from '@/store/ui';
import styles from './auth.module.css';

export default function DemoAccounts() {
  const signIn = (role) => {
    useAppStore.getState().signInDemo(role);
    toast(`Signed in as ${PERSONAS[role].name}`);
  };

  return (
    <Note tone="info" className={styles.demo}>
      <p className="strong">Demo accounts</p>
      <p className="text-sm muted">Sign in with one click, or type the details below.</p>
      <div className="mt-8">
        {['pro', 'emp'].map((role) => (
          <div key={role} className={styles.demoAccount}>
            <div className="grow text-sm">
              <span className="strong block">
                {PERSONAS[role].name} · {ROLE_LABEL[role]}
              </span>
              <span className="muted">{PERSONAS[role].email}</span>
            </div>
            <Button size="sm" onClick={() => signIn(role)}>
              Sign in as {PERSONAS[role].name.split(' ')[0]}
            </Button>
          </div>
        ))}
      </div>
      <p className="text-sm mt-8">
        Password for both: <code className="strong">{DEMO_PASSWORD}</code>. Any other email opens sign-up with the email
        filled in.
      </p>
    </Note>
  );
}
