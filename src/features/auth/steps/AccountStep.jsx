import { Button } from '@/components/Button';
import { CheckboxField, FieldPair, FieldStack, RequiredLegend, TextField } from '@/components/Field';
import Icon from '@/components/Icon';
import { LEGAL } from '@/data/options';
import { PERSONAS } from '@/data/personas';
import { cx } from '@/lib/cx';
import { pick } from '@/lib/pick';
import { useForm } from '@/lib/useForm';
import { checked, email, PASSWORD_RULES, required, strongPassword } from '@/lib/validation';
import { toast } from '@/store/ui';
import { DEMO_SIGNUP } from '../demoSignup';
import { DemoFill, StepActions } from './StepParts';
import styles from '../auth.module.css';

const FIELDS = ['firstName', 'lastName', 'email', 'phone', 'password', 'agree'];

const RULES = {
  firstName: required('Enter your first name.'),
  lastName: required('Enter your last name.'),
  email: [required('Enter your email.'), email()],
  phone: required('Enter your mobile number.'),
  password: [required('Enter a password.'), strongPassword()],
  agree: checked(),
};

function PasswordRules({ value }) {
  return (
    <div className={styles.passwordRules}>
      {PASSWORD_RULES.map(([label, test]) => (
        <span key={label} className={cx(test(value) && styles.met)}>
          <Icon name="check" size={14} stroke={2.2} />
          {label}
        </span>
      ))}
    </div>
  );
}

export default function AccountStep({ role, details, onNext, onBack, first }) {
  const form = useForm(
    {
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      agree: false,
      ...pick(details, ['firstName', 'lastName', 'email', 'phone']),
    },
    RULES,
  );
  const pro = role === 'pro';

  const signUpWithGoogle = () => {
    const [firstName, lastName] = PERSONAS[role].name.split(' ');
    onNext({ firstName, lastName, email: PERSONAS[role].email, phone: PERSONAS[role].phone });
    toast('Google account connected. Name and email filled in.');
  };

  return (
    <>
      <h1 className="h1">Your details</h1>
      <form className="mt-16" onSubmit={form.handleSubmit(onNext)} noValidate>
        <FieldStack>
          <Button size="lg" block onClick={signUpWithGoogle}>
            Sign up with Google
          </Button>
          <div className={styles.or}>or with your email</div>
          <div className="row row-between row-wrap gap-8">
            <RequiredLegend />
            <DemoFill onFill={() => form.setValues(pick(DEMO_SIGNUP[role], FIELDS))} />
          </div>
          <FieldPair>
            <TextField {...form.field('firstName')} label="First name" autoComplete="given-name" required />
            <TextField {...form.field('lastName')} label="Last name" autoComplete="family-name" required />
          </FieldPair>
          <TextField
            {...form.field('email')}
            label={pro ? 'Email' : 'Work email'}
            type="email"
            autoComplete="email"
            required
            hint={pro ? undefined : 'Use your company address. We use it to match you to your business.'}
          />
          <TextField
            {...form.field('phone')}
            label="Mobile number"
            type="tel"
            autoComplete="tel"
            required
            hint="For sign-in codes and interview reminders. Never shown to others."
          />
          <TextField
            {...form.field('password')}
            label="Password"
            type="password"
            autoComplete="new-password"
            required
            hint={<PasswordRules value={form.values.password} />}
          />
          <CheckboxField {...form.checkbox('agree')} required>
            I agree to the{' '}
            <a className="link" href={LEGAL.terms} target="_blank" rel="noreferrer">
              Terms
            </a>{' '}
            and the{' '}
            <a className="link" href={LEGAL.privacy} target="_blank" rel="noreferrer">
              Privacy and cookie policy
            </a>
            .
          </CheckboxField>
          <StepActions first={first} onBack={onBack} />
        </FieldStack>
      </form>
    </>
  );
}
