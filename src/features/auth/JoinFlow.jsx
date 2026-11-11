import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import Note from '@/components/Note';
import { DEMO_MODE } from '@/config';
import { ROLE_LABEL } from '@/data/personas';
import { createAccount } from './createAccount';
import AccountStep from './steps/AccountStep';
import CompanyStep from './steps/CompanyStep';
import DoneStep from './steps/DoneStep';
import ProBasicsStep from './steps/ProBasicsStep';
import ProTradeStep from './steps/ProTradeStep';
import VerifyStep from './steps/VerifyStep';
import styles from './auth.module.css';

const FLOWS = {
  pro: [
    ['Account', AccountStep],
    ['Trade and location', ProTradeStep],
    ['Profile basics', ProBasicsStep],
  ],
  emp: [
    ['Account', AccountStep],
    ['Company', CompanyStep],
    ['Verify your business', VerifyStep],
    ['Done', DoneStep],
  ],
};

const EMPTY = {
  pro: { certifications: [], available: true },
  emp: { focus: [] },
};

export default function JoinFlow({ role, email }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState({ ...EMPTY[role], email });
  const flow = FLOWS[role];
  const [, Step] = flow[step];
  const last = step === flow.length - 1;

  const next = (values) => {
    const merged = { ...details, ...values };
    setDetails(merged);
    if (last) createAccount(role, merged);
    else {
      setStep(step + 1);
      scrollTo(0, 0);
    }
  };

  const back = () => (step ? setStep(step - 1) : navigate('/join'));

  return (
    <div className={`${styles.column} ${styles.wide}`}>
      <Card className={styles.card}>
        <p className="text-sm subtle">
          {ROLE_LABEL[role]} account · Step {step + 1} of {flow.length}: {flow[step][0]}
        </p>
        <div className={styles.progress} aria-hidden="true">
          {flow.map(([label], index) => (
            <i key={label} className={index <= step ? styles.done : undefined} />
          ))}
        </div>
        <Step key={step} role={role} details={details} onNext={next} onBack={back} first={step === 0} />
      </Card>
      {DEMO_MODE && !last && (
        <Note tone="info" className={styles.demo}>
          <div className="row row-wrap row-between gap-8">
            <span className="text-sm">
              <b>Demo.</b> Skip the typing and create a sample {ROLE_LABEL[role].toLowerCase()} account.
            </span>
            <Button size="sm" onClick={() => createAccount(role)}>
              Finish with demo details
            </Button>
          </div>
        </Note>
      )}
    </div>
  );
}
