import { useShallow } from 'zustand/react/shallow';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Dialog, DialogActions, DialogBody } from '@/components/Dialog';
import { FieldLabel, FieldStack, RequiredLegend, SelectField, TextAreaField, TextField } from '@/components/Field';
import Icon from '@/components/Icon';
import { useDirectory } from '@/features/directory/useDirectory';
import { formatPay } from '@/lib/format';
import { useForm } from '@/lib/useForm';
import { required } from '@/lib/validation';
import { useAppStore, usePersona } from '@/store';
import { toast } from '@/store/ui';
import styles from './jobs.module.css';

export default function ApplyDialog({ job, onClose }) {
  const persona = usePersona();
  const { company } = useDirectory();
  const certifications = useAppStore(useShallow((state) => state.licenses.map((license) => license.certification)));
  const form = useForm(
    { transport: '', start: '', note: '' },
    { transport: required('Choose an answer.'), start: required('Enter your earliest start date.') },
  );
  const companyName = company(job.companyId).name;
  const listed = job.certifications.filter((certification) => certifications.includes(certification)).length;
  const resumeName = `${persona.name.replace(' ', '-')}-resume.pdf`;

  const submit = form.handleSubmit(() => {
    useAppStore.getState().applyToJob(job.id);
    onClose();
    toast(`Application sent to ${companyName}. Follow it under Jobs, Applied.`);
  });

  return (
    <Dialog title={`Apply: ${job.title}`} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <DialogBody>
          <p className="muted">
            {companyName} · {job.city} · {formatPay(job)}
          </p>
          <div className={`row mt-16 ${styles.applicant}`}>
            <Avatar name={persona.name} />
            <div className="grow">
              <p className="strong">{persona.name}</p>
              <p className="text-sm muted">
                {persona.email} · {persona.phone}
              </p>
            </div>
          </div>
          <FieldStack className="mt-16">
            <RequiredLegend />
            <div className="stack gap-8">
              <FieldLabel optional={false}>Résumé</FieldLabel>
              <label className={`row ${styles.resume}`}>
                <Icon name="doc" size={22} />
                <span className="grow">
                  {resumeName}
                  <span className="block text-sm subtle">Uploaded Oct 2</span>
                </span>
                <input type="radio" name="resume" defaultChecked aria-label={`Use ${resumeName}`} />
              </label>
              <Button
                variant="text"
                size="sm"
                className={styles.resumeSwitch}
                onClick={() => toast('Choose a PDF or Word file')}
              >
                <Icon name="upload" size={16} />
                Use a different résumé
              </Button>
            </div>
            <SelectField
              {...form.field('transport')}
              label="Do you have reliable transport to the job site?"
              options={['Yes', 'No']}
              required
              data-autofocus
            />
            <TextField
              {...form.field('start')}
              label="Earliest start date"
              placeholder="For example, December 1"
              required
            />
            <TextAreaField
              {...form.field('note')}
              label="Note to the hiring team"
              placeholder="Anything you want them to know"
            />
          </FieldStack>
          <p className="text-sm muted mt-16">
            {companyName} will see your profile, including {listed} of the {job.certifications.length} licenses this job
            asks for.
          </p>
        </DialogBody>
        <DialogActions onCancel={onClose} submitLabel="Send application" />
      </form>
    </Dialog>
  );
}
