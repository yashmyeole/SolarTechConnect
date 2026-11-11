import { Dialog, DialogActions, DialogBody } from '@/components/Dialog';
import { FieldStack, OptionGroup, Radio, SelectField, TextField } from '@/components/Field';
import { COMPANY_SIZES } from '@/data/options';
import { useForm } from '@/lib/useForm';
import { email, required } from '@/lib/validation';
import { toast } from '@/store/ui';

const text = (label, message, { inputType = 'text', hint } = {}) => ({ kind: 'text', label, message, inputType, hint });
const select = (label, options, hint) => ({ kind: 'select', label, options, hint });
const choice = (label, options) => ({ kind: 'choice', label, options });

const EDITORS = {
  name: { title: 'Your name', field: text('Name', 'Enter your name.') },
  headline: { title: 'Headline', field: text('Headline', 'Enter a headline.') },
  city: { title: 'Location', field: text('City', 'Enter your city.') },
  email: {
    title: 'Email',
    field: text('New email address', 'Enter your new email.', {
      inputType: 'email',
      hint: 'We send a code to confirm it.',
    }),
  },
  phone: {
    title: 'Mobile number',
    field: text('Mobile number', 'Enter your mobile number.', {
      inputType: 'tel',
      hint: 'For sign-in codes and interview reminders. Never shown to others.',
    }),
  },
  language: { title: 'Language', field: select('Language', ['English', 'Español'], 'Spanish is planned for launch.') },
  timeZone: {
    title: 'Time zone',
    field: select('Time zone', ['Eastern Time', 'Central Time', 'Mountain Time', 'Pacific Time']),
  },
  profileVisibility: {
    title: 'Who can see your profile',
    field: choice('Your full profile is visible to', ['Everyone signed in', 'Contacts and employers I apply to']),
  },
  messagesFrom: {
    title: 'Who can message you',
    field: choice('Allow messages from', {
      pro: ['Contacts and employers I applied to', 'Anyone signed in', 'Contacts only'],
      emp: ['Applicants and contacts', 'Anyone signed in'],
    }),
  },
  requestsFrom: {
    title: 'Contact requests',
    field: choice('Who can send you a request', ['Everyone', 'Only people who know my email address']),
  },
  companyName: {
    title: 'Company name',
    field: text('Company name', 'Enter your company name.', {
      hint: 'Changing the legal name sends your business for a quick re-check.',
    }),
  },
  site: { title: 'Website', field: text('Website', 'Enter your website.') },
  size: { title: 'Company size', field: select('Company size', COMPANY_SIZES) },
  headquarters: { title: 'Headquarters', field: text('Headquarters city', 'Enter your headquarters city.') },
};

export function SettingEditDialog({ editorKey, role, value, onSave, onClose }) {
  const { title, field } = EDITORS[editorKey];
  const options = Array.isArray(field.options) ? field.options : field.options?.[role];
  const rules =
    field.kind === 'text'
      ? { value: [required(field.message), field.inputType === 'email' && email()].filter(Boolean) }
      : {};
  const form = useForm({ value: field.inputType === 'email' ? '' : value }, rules);

  const submit = form.handleSubmit(({ value: next }) => {
    const saved = next.trim();
    onSave(saved);
    onClose();
    toast(editorKey === 'email' ? `We sent a code to ${saved} to confirm it` : 'Saved');
  });

  return (
    <Dialog title={title} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <DialogBody>
          <FieldStack>
            {field.kind === 'text' && (
              <TextField
                {...form.field('value')}
                label={field.label}
                type={field.inputType}
                hint={field.hint}
                required
                data-autofocus
              />
            )}
            {field.kind === 'select' && (
              <SelectField
                {...form.field('value')}
                label={field.label}
                options={options}
                placeholder={false}
                hint={field.hint}
                required
                data-autofocus
              />
            )}
            {field.kind === 'choice' && (
              <OptionGroup legend={field.label}>
                {options.map((option) => (
                  <Radio
                    key={option}
                    name="choice"
                    label={option}
                    checked={form.values.value === option}
                    onChange={() => form.setValue('value', option)}
                  />
                ))}
              </OptionGroup>
            )}
          </FieldStack>
        </DialogBody>
        <DialogActions onCancel={onClose} submitLabel="Save" />
      </form>
    </Dialog>
  );
}
