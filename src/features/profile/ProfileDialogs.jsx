import { useState } from 'react';
import { Dialog, DialogActions, DialogBody } from '@/components/Dialog';
import {
  Checkbox,
  FieldPair,
  FieldStack,
  OptionGroup,
  RequiredLegend,
  SelectField,
  TextField,
  ToggleRow,
} from '@/components/Field';
import Icon from '@/components/Icon';
import Note from '@/components/Note';
import { CERTIFICATIONS, START_OPTIONS, TRADES, TRAVEL_DISTANCES } from '@/data/options';
import { toggleItem } from '@/lib/toggleItem';
import { useForm } from '@/lib/useForm';
import { required } from '@/lib/validation';
import { useAppStore, usePersona } from '@/store';
import { toast } from '@/store/ui';

const JOB_TYPES = ['Full-time', 'Contract', 'Part-time', 'Apprenticeship'];
const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });

export function EditProfileDialog({ onClose }) {
  const persona = usePersona();
  const [firstName, ...rest] = persona.name.split(' ');
  const form = useForm(
    { firstName, lastName: rest.join(' '), headline: persona.headline, city: persona.city, trade: persona.trade },
    {
      firstName: required('Enter your first name.'),
      lastName: required('Enter your last name.'),
      headline: required('Enter a headline.'),
      city: required('Enter your city.'),
    },
  );

  const submit = form.handleSubmit((values) => {
    useAppStore.getState().updateProfile('pro', {
      name: `${values.firstName.trim()} ${values.lastName.trim()}`,
      headline: values.headline.trim(),
      city: values.city.trim(),
      trade: values.trade,
    });
    onClose();
    toast('Profile saved');
  });

  return (
    <Dialog title="Edit profile" onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <DialogBody>
          <FieldStack>
            <RequiredLegend />
            <FieldPair>
              <TextField {...form.field('firstName')} label="First name" required data-autofocus />
              <TextField {...form.field('lastName')} label="Last name" required />
            </FieldPair>
            <TextField
              {...form.field('headline')}
              label="Headline"
              required
              hint="Your trade and where you work, in one line."
            />
            <TextField {...form.field('city')} label="City" required />
            <SelectField {...form.field('trade')} label="Main trade" options={TRADES} placeholder={false} required />
          </FieldStack>
        </DialogBody>
        <DialogActions onCancel={onClose} submitLabel="Save" />
      </form>
    </Dialog>
  );
}

export function AvailabilityDialog({ onClose }) {
  const availability = useAppStore((state) => state.availability);
  const [types, setTypes] = useState(availability.types);
  const [open, setOpen] = useState(availability.open);
  const form = useForm(
    { roles: availability.roles, distance: availability.distance, start: availability.start },
    { roles: required('Enter the roles you want.') },
  );

  const submit = form.handleSubmit((values) => {
    useAppStore.getState().setAvailability({ ...values, types, open });
    onClose();
    toast(open ? 'Availability saved' : 'You’re no longer shown as available');
  });

  return (
    <Dialog title="Availability" onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <DialogBody>
          <FieldStack>
            <RequiredLegend />
            <TextField
              {...form.field('roles')}
              label="Roles you want"
              required
              hint="Separate with commas."
              data-autofocus
            />
            <OptionGroup legend="Job types">
              {JOB_TYPES.map((type) => (
                <Checkbox
                  key={type}
                  label={type}
                  checked={types.includes(type)}
                  onChange={() => setTypes(toggleItem(types, type))}
                />
              ))}
            </OptionGroup>
            <FieldPair>
              <SelectField
                {...form.field('distance')}
                label="Travel distance"
                options={TRAVEL_DISTANCES}
                placeholder={false}
                required
              />
              <SelectField
                {...form.field('start')}
                label="Can start"
                options={START_OPTIONS}
                placeholder={false}
                required
              />
            </FieldPair>
            <ToggleRow
              divided
              title="Show I’m available"
              description="Verified employers can find you and see these details."
              checked={open}
              onChange={(event) => setOpen(event.target.checked)}
            />
          </FieldStack>
        </DialogBody>
        <DialogActions onCancel={onClose} submitLabel="Save" />
      </form>
    </Dialog>
  );
}

export function LicenseDialog({ onClose }) {
  const form = useForm(
    { certification: '', issuer: '', issued: '', expires: '', number: '' },
    { certification: required('Choose a license or certification.'), issuer: required('Enter who issued it.') },
  );

  const submit = form.handleSubmit((values) => {
    useAppStore.getState().addLicense({
      certification: values.certification,
      name: values.certification,
      issuer: values.issuer.trim(),
      date: values.issued ? `Issued ${monthYear.format(new Date(`${values.issued}-01T12:00`))}` : '',
    });
    onClose();
    toast(`${values.certification} added to your profile`);
  });

  return (
    <Dialog title="Add a license or certification" onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <DialogBody>
          <FieldStack>
            <RequiredLegend />
            <SelectField
              {...form.field('certification')}
              label="Name"
              options={CERTIFICATIONS}
              required
              data-autofocus
            />
            <TextField
              {...form.field('issuer')}
              label="Issued by"
              placeholder="For example, OSHA Training Institute"
              required
            />
            <FieldPair>
              <TextField {...form.field('issued')} label="Issue date" type="month" />
              <TextField {...form.field('expires')} label="Expiry date" type="month" />
            </FieldPair>
            <TextField
              {...form.field('number')}
              label="Card or credential number"
              hint="Shown only to employers you apply to."
            />
            <Note icon="info">
              <span className="text-sm">
                You list this yourself; we don’t check it. Employers may ask to see the card.
              </span>
            </Note>
          </FieldStack>
        </DialogBody>
        <DialogActions onCancel={onClose} submitLabel="Save" />
      </form>
    </Dialog>
  );
}

export function ContactDialog({ slug, onClose }) {
  const rows = [
    ['globe', 'Profile link', `solartechconnect.com/p/${slug}`],
    ['mail', 'Email', 'Shown to contacts and employers you apply to'],
    ['phone', 'Phone', 'Never shown on your profile'],
  ];
  return (
    <Dialog title="Contact details" onClose={onClose}>
      <DialogBody>
        <div className="stack">
          {rows.map(([icon, label, value]) => (
            <div key={label} className="row row-top">
              <Icon name={icon} />
              <div>
                <p className="strong">{label}</p>
                <p className="text-sm muted">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogBody>
    </Dialog>
  );
}
