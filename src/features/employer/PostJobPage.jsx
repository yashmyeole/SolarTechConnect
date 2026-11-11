import { useNavigate } from 'react-router';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import Checklist from '@/components/Checklist';
import { Chip } from '@/components/Chip';
import {
  ChoiceChips,
  FieldLabel,
  FieldPair,
  FieldStack,
  RequiredLegend,
  SelectField,
  TextAreaField,
  TextField,
} from '@/components/Field';
import Icon from '@/components/Icon';
import PageHeader from '@/components/PageHeader';
import { RowLine, RowMeta, RowTitle } from '@/components/SplitView';
import { OWN_COMPANY_ID } from '@/data/companies';
import { EXPERIENCE, JOB_CERTIFICATIONS } from '@/data/options';
import { toggleItem } from '@/lib/toggleItem';
import { useForm } from '@/lib/useForm';
import { usePageTitle } from '@/lib/usePageTitle';
import { required } from '@/lib/validation';
import { useAppStore, useCompanies } from '@/store';
import { toast } from '@/store/ui';
import { HoldNote } from './EmployerParts';
import styles from './employer.module.css';

const WORKPLACES = ['On-site', 'Hybrid', 'Remote'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Apprenticeship'];

const INITIAL = {
  title: '',
  location: '',
  workplace: WORKPLACES[0],
  type: JOB_TYPES[0],
  payMin: '',
  payMax: '',
  schedule: '',
  start: '',
  openings: '1',
  experience: EXPERIENCE[0],
  about: '',
  duties: '',
  question: 'Do you have reliable transport to the job site?',
  certifications: ['OSHA 10'],
};

const RULES = {
  title: required('Enter a job title.'),
  location: required('Enter the job site or city.'),
  payMin: required('Enter the bottom of the pay range.'),
  payMax: [
    required('Enter the top of the pay range.'),
    (value, values) =>
      values.payMin && Number(value) < Number(values.payMin) ? 'The top of the range must be at least the bottom.' : '',
  ],
  about: required('Write two or three sentences about the role.'),
};

function Section({ title, description }) {
  return (
    <div className={styles.formSection}>
      <h2 className="h2">{title}</h2>
      {description && <p className="text-sm muted mt-4">{description}</p>}
    </div>
  );
}

function Preview({ values, companyName }) {
  const pay = values.payMin && values.payMax ? `$${values.payMin}–$${values.payMax}/hr` : null;
  return (
    <Card padded className="mt-12">
      <div className="row gap-8">
        <Avatar name={companyName} company size={32} />
        <span className="text-sm muted">{companyName}</span>
      </div>
      <div className="mt-8">
        <RowTitle>{values.title || <span className="subtle">Job title</span>}</RowTitle>
        <RowLine>
          {pay ? <b>{pay}</b> : <span className="subtle">Pay range</span>} · {values.location || 'Location'}
        </RowLine>
        <RowMeta>
          {values.type} · {values.workplace} · {values.experience}
        </RowMeta>
      </div>
      <p className="text-sm muted mt-12">
        {values.about || <span className="subtle">The start of “About the role” appears here.</span>}
      </p>
      {values.certifications.length > 0 && (
        <div className="row row-wrap gap-8 mt-12">
          {values.certifications.map((certification) => (
            <Chip key={certification}>{certification}</Chip>
          ))}
        </div>
      )}
    </Card>
  );
}

export default function PostJobPage() {
  usePageTitle('Post a job');
  const navigate = useNavigate();
  const verified = useAppStore((state) => state.employer.verified);
  const companyName = useCompanies()[OWN_COMPANY_ID].name;
  const form = useForm(INITIAL, RULES);

  const publish = form.handleSubmit((values) => {
    useAppStore.getState().publishJob({ title: values.title.trim(), location: values.location.trim() });
    toast(
      verified ? 'Job published. It’s live in search now.' : 'Job saved. It goes live when your business is verified.',
    );
    navigate('/employer/jobs');
  });

  return (
    <>
      <PageHeader
        title="Post a job"
        subtitle="Jobs that show pay, schedule and start date get more suitable candidates."
      />
      <HoldNote />
      <div className="layout-main-aside">
        <Card as="form" onSubmit={publish} noValidate>
          <div className={styles.formCard}>
            <FieldStack>
              <RequiredLegend />
              <h2 className="h2">The basics</h2>
              <TextField
                {...form.field('title')}
                label="Job title"
                placeholder="For example, Solar Installer"
                hint="Use a title people search for."
                required
              />
              <TextField {...form.field('location')} label="Job site or city" placeholder="City, state" required />
              <FieldPair>
                <SelectField
                  {...form.field('workplace')}
                  label="Workplace"
                  options={WORKPLACES}
                  placeholder=""
                  required
                />
                <SelectField {...form.field('type')} label="Job type" options={JOB_TYPES} placeholder="" required />
              </FieldPair>
              <Section title="Pay and schedule" />
              <FieldPair>
                <TextField {...form.field('payMin')} label="Pay from ($/hr)" type="number" min="0" required />
                <TextField {...form.field('payMax')} label="Pay to ($/hr)" type="number" min="0" required />
              </FieldPair>
              <TextField
                {...form.field('schedule')}
                label="Schedule"
                placeholder="For example, Monday to Friday, 6:30 am to 3:00 pm"
              />
              <FieldPair>
                <TextField {...form.field('start')} label="Start date" type="date" />
                <TextField {...form.field('openings')} label="Openings" type="number" min="1" />
              </FieldPair>
              <Section title="Requirements" />
              <SelectField
                {...form.field('experience')}
                label="Experience"
                options={EXPERIENCE}
                placeholder=""
                required
              />
              <div className="stack gap-8">
                <FieldLabel>Licenses and certifications</FieldLabel>
                <ChoiceChips
                  options={JOB_CERTIFICATIONS}
                  selected={form.values.certifications}
                  onToggle={(option) => form.setValue('certifications', toggleItem(form.values.certifications, option))}
                />
                <p className="text-sm subtle">
                  Shown on the job. Candidates see which ones are on their profile; nobody is blocked from applying.
                </p>
              </div>
              <Section title="Description" />
              <TextAreaField
                {...form.field('about')}
                label="About the role"
                placeholder="Two or three sentences about the work and the team."
                required
              />
              <TextAreaField
                {...form.field('duties')}
                label="What they’ll do"
                placeholder="One task per line. Shown as a list."
              />
              <Section
                title="Questions for candidates"
                description="Up to three yes-or-no questions, answered when they apply."
              />
              <TextField {...form.field('question')} label="Question 1" />
              <Button variant="text" size="sm" className={styles.addQuestion} onClick={() => toast('Question added')}>
                <Icon name="plus" size={16} />
                Add a question
              </Button>
            </FieldStack>
          </div>
          <div className={styles.formFooter}>
            <Button variant="quiet" onClick={() => toast('Draft saved')}>
              Save draft
            </Button>
            <Button type="submit" variant="primary">
              {verified ? 'Publish job' : 'Save, publish when verified'}
            </Button>
          </div>
        </Card>
        <aside className="stack sticky">
          <Card padded>
            <h2 className="h3">Preview</h2>
            <p className="text-sm subtle">How it looks in search results</p>
            <Preview values={form.values} companyName={companyName} />
          </Card>
          <Card padded>
            <h2 className="h3">Before you publish</h2>
            <Checklist
              className="mt-12 text-sm"
              items={[
                { status: 'ok', label: 'A pay range is required' },
                { status: 'ok', label: 'Candidates apply with their profile and résumé' },
                verified
                  ? { status: 'ok', label: 'Your business is verified' }
                  : { status: 'hold', label: 'Goes live when the check passes' },
              ]}
            />
          </Card>
        </aside>
      </div>
    </>
  );
}
