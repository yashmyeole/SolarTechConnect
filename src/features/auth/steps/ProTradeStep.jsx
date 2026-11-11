import { FieldPair, FieldStack, RequiredLegend, SelectField, TextField } from '@/components/Field';
import { EXPERIENCE, TRADES, TRAVEL_DISTANCES } from '@/data/options';
import { pick } from '@/lib/pick';
import { useForm } from '@/lib/useForm';
import { required } from '@/lib/validation';
import { DEMO_SIGNUP } from '../demoSignup';
import { DemoFill, StepActions } from './StepParts';

const FIELDS = ['trade', 'experience', 'city', 'zip', 'travel'];

const RULES = {
  trade: required('Choose your main trade.'),
  experience: required('Choose your experience in solar.'),
  city: required('Enter your city.'),
  zip: required('Enter your ZIP code.'),
};

export default function ProTradeStep({ details, onNext, onBack }) {
  const form = useForm({ trade: '', experience: '', city: '', zip: '', travel: '', ...pick(details, FIELDS) }, RULES);
  return (
    <>
      <h1 className="h1">Your trade and location</h1>
      <p className="muted mt-4">So we can show jobs you can get to.</p>
      <form className="mt-16" onSubmit={form.handleSubmit(onNext)} noValidate>
        <FieldStack>
          <div className="row row-between row-wrap gap-8">
            <RequiredLegend />
            <DemoFill onFill={() => form.setValues(pick(DEMO_SIGNUP.pro, FIELDS))} />
          </div>
          <SelectField
            {...form.field('trade')}
            label="Main trade"
            options={TRADES}
            required
            hint="Not listed? Pick the closest; you can change it later."
          />
          <SelectField {...form.field('experience')} label="Experience in solar" options={EXPERIENCE} required />
          <FieldPair>
            <TextField {...form.field('city')} label="City" autoComplete="address-level2" required />
            <TextField
              {...form.field('zip')}
              label="ZIP code"
              autoComplete="postal-code"
              inputMode="numeric"
              required
            />
          </FieldPair>
          <SelectField {...form.field('travel')} label="How far will you travel for work?" options={TRAVEL_DISTANCES} />
          <StepActions onBack={onBack} />
        </FieldStack>
      </form>
    </>
  );
}
