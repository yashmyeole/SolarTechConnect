import { useEffect, useEffectEvent, useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import Checklist from '@/components/Checklist';
import { FieldError, FieldLabel, FieldStack, RequiredLegend, TextField } from '@/components/Field';
import { DEMO_MODE } from '@/config';
import { pick } from '@/lib/pick';
import { useForm } from '@/lib/useForm';
import { required } from '@/lib/validation';
import { toast } from '@/store/ui';
import { checkFor } from '../businessCheck';
import { DEMO_SIGNUP } from '../demoSignup';
import BusinessResult from './BusinessResult';
import CodeInput from './CodeInput';
import { DemoFill, StepActions } from './StepParts';
import styles from '../auth.module.css';

const FIELDS = ['code', 'legalName', 'registrationState', 'license'];

const RULES = {
  code: (value) => (/^\d{6}$/.test(value) ? '' : 'Enter the six-digit code from your email.'),
  legalName: required('Enter your legal business name.'),
  registrationState: required('Enter your state of registration.'),
};

const STEP_MS = 600;

export default function VerifyStep({ details, onNext, onBack }) {
  const form = useForm(
    { code: '', legalName: '', registrationState: '', license: '', ...pick(details, FIELDS) },
    RULES,
  );
  const [check, setCheck] = useState(null);
  const [completed, setCompleted] = useState(0);

  const finish = useEffectEvent(() => onNext({ ...form.values, verified: check.verified }));

  useEffect(() => {
    if (!check) return;
    const step = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : STEP_MS;
    const timers = check.steps.map((_, index) => setTimeout(() => setCompleted(index + 1), step * (index + 1)));
    timers.push(setTimeout(finish, step * check.steps.length + (step ? 900 : 400)));
    return () => timers.forEach(clearTimeout);
  }, [check]);

  const status = (index, result) => (index < completed ? result : index === completed ? 'running' : '');

  return (
    <>
      <h1 className="h1">Verify your business</h1>
      <p className="muted mt-4">
        Professionals only see jobs from employers that pass this check. It usually takes under a minute.
      </p>
      <form
        className="mt-16"
        onSubmit={form.handleSubmit(() => !check && setCheck(checkFor(details.email)))}
        noValidate
      >
        <FieldStack>
          <div className="row row-between row-wrap gap-8">
            <RequiredLegend />
            <DemoFill onFill={() => form.setValues(pick(DEMO_SIGNUP.emp, FIELDS))} />
          </div>
          <div className="stack gap-8">
            <FieldLabel id="code-label" required>
              Code we sent to {details.email || 'your work email'}
            </FieldLabel>
            <CodeInput
              value={form.values.code}
              onChange={(code) => form.setValue('code', code)}
              labelledBy="code-label"
              describedBy="code-hint"
              invalid={Boolean(form.errors.code)}
            />
            <p className="text-sm subtle" id="code-hint">
              {DEMO_MODE ? 'Demo: any six digits work. A Gmail or other free address shows the review path. ' : ''}
              <Button variant="text" size="sm" onClick={() => toast('A new code is on its way')}>
                Send a new code
              </Button>
            </p>
            <FieldError id="code-error" message={form.errors.code} />
          </div>
          <TextField
            {...form.field('legalName')}
            label="Legal business name"
            required
            hint="As registered with the state."
          />
          <TextField {...form.field('registrationState')} label="State of registration" required />
          <TextField
            {...form.field('license')}
            label="Contractor license number"
            hint="Speeds up the check if your state licenses solar contractors."
          />
          {check && (
            <Card padded className={styles.check} aria-live="polite">
              <p className="strong">Business check</p>
              <Checklist
                className="mt-8"
                items={check.steps.map(([result, label], index) => ({ status: status(index, result), label }))}
              />
              {completed === check.steps.length && <BusinessResult check={check} className="mt-12" />}
            </Card>
          )}
          <StepActions onBack={onBack} nextLabel={check ? 'Checking…' : 'Continue'} />
        </FieldStack>
      </form>
    </>
  );
}
