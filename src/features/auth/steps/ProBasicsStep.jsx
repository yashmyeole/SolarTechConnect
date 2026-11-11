import { useState } from 'react';
import { ChoiceChips, FieldLabel, FieldStack, ToggleRow } from '@/components/Field';
import Icon from '@/components/Icon';
import { CERTIFICATIONS } from '@/data/options';
import { toggleItem } from '@/lib/toggleItem';
import { DEMO_SIGNUP } from '../demoSignup';
import { DemoFill, StepActions } from './StepParts';
import styles from '../auth.module.css';

export default function ProBasicsStep({ details, onNext, onBack }) {
  const [certifications, setCertifications] = useState(details.certifications);
  const [available, setAvailable] = useState(details.available);
  const [resume, setResume] = useState('');

  const fillDemo = () => {
    setCertifications(DEMO_SIGNUP.pro.certifications);
    setAvailable(true);
  };

  const submit = (event) => {
    event.preventDefault();
    onNext({ certifications, available });
  };

  return (
    <>
      <h1 className="h1">Profile basics</h1>
      <p className="muted mt-4">All optional. You can add these later.</p>
      <form className="mt-16" onSubmit={submit} noValidate>
        <FieldStack>
          <DemoFill onFill={fillDemo} />
          <div className="stack gap-8">
            <FieldLabel>Résumé</FieldLabel>
            <div className={styles.drop}>
              <Icon name="upload" size={26} />
              <p>{resume || 'We read it and fill in your work history for you to check.'}</p>
              <label className={styles.fileButton}>
                {resume ? 'Choose a different file' : 'Upload a PDF or Word file'}
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx"
                  onChange={(event) => setResume(event.target.files[0]?.name ?? '')}
                />
              </label>
            </div>
          </div>
          <div className="stack gap-8">
            <FieldLabel>Licenses and certifications you hold</FieldLabel>
            <ChoiceChips
              options={CERTIFICATIONS}
              selected={certifications}
              onToggle={(option) => setCertifications(toggleItem(certifications, option))}
            />
            <p className="text-sm subtle">Listed on your profile as you enter them. None are needed to apply.</p>
          </div>
          <ToggleRow
            divided
            title="Show employers I’m available for work"
            description="Verified employers can find you in talent search."
            checked={available}
            onChange={(event) => setAvailable(event.target.checked)}
          />
          <StepActions onBack={onBack} nextLabel="Finish" />
        </FieldStack>
      </form>
    </>
  );
}
