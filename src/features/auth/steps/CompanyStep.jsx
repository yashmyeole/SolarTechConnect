import { useState } from 'react';
import {
  ChoiceChips,
  FieldLabel,
  FieldPair,
  FieldStack,
  RequiredLegend,
  SelectField,
  TextField,
} from '@/components/Field';
import { COMPANY_FOCUS, COMPANY_SIZES } from '@/data/options';
import { pick } from '@/lib/pick';
import { toggleItem } from '@/lib/toggleItem';
import { useForm } from '@/lib/useForm';
import { required } from '@/lib/validation';
import { DEMO_SIGNUP } from '../demoSignup';
import { DemoFill, StepActions } from './StepParts';

const FIELDS = ['companyName', 'website', 'size', 'city', 'state'];

const RULES = {
  companyName: required('Enter your company name.'),
  website: required('Enter your company website.'),
  size: required('Choose your company size.'),
  city: required('Enter your headquarters city.'),
  state: required('Enter your state.'),
};

export default function CompanyStep({ details, onNext, onBack }) {
  const form = useForm(
    { companyName: '', website: '', size: '', city: '', state: '', ...pick(details, FIELDS) },
    RULES,
  );
  const [focus, setFocus] = useState(details.focus);

  const fillDemo = () => {
    form.setValues(pick(DEMO_SIGNUP.emp, FIELDS));
    setFocus(DEMO_SIGNUP.emp.focus);
  };

  return (
    <>
      <h1 className="h1">Your company</h1>
      <p className="muted mt-4">This becomes your company page.</p>
      <form className="mt-16" onSubmit={form.handleSubmit((values) => onNext({ ...values, focus }))} noValidate>
        <FieldStack>
          <div className="row row-between row-wrap gap-8">
            <RequiredLegend />
            <DemoFill onFill={fillDemo} />
          </div>
          <TextField {...form.field('companyName')} label="Company name" autoComplete="organization" required />
          <TextField {...form.field('website')} label="Company website" type="url" placeholder="https://" required />
          <SelectField {...form.field('size')} label="Company size" options={COMPANY_SIZES} required />
          <FieldPair>
            <TextField {...form.field('city')} label="Headquarters city" required />
            <TextField {...form.field('state')} label="State" required />
          </FieldPair>
          <div className="stack gap-8">
            <FieldLabel>What do you build or service?</FieldLabel>
            <ChoiceChips
              options={COMPANY_FOCUS}
              selected={focus}
              onToggle={(option) => setFocus(toggleItem(focus, option))}
            />
          </div>
          <StepActions onBack={onBack} />
        </FieldStack>
      </form>
    </>
  );
}
