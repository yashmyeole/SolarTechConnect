import { Card } from '@/components/Card';
import IconCircle from '@/components/IconCircle';
import { List, ListItem } from '@/components/List';
import { BUSINESS_CHECKS } from '../businessCheck';
import BusinessResult from './BusinessResult';
import { StepActions } from './StepParts';

export default function DoneStep({ details, onNext, onBack }) {
  const check = BUSINESS_CHECKS[details.verified ? 'match' : 'review'];
  const todo = [
    [
      'briefcase',
      'Post your first job',
      check.verified ? 'Live as soon as you publish.' : 'Saved as a draft until the check passes.',
    ],
    ['building', 'Finish your company page', 'Logo, a short description and project photos.'],
    ['team', 'Invite teammates', 'Share messages and candidates.'],
  ];

  const submit = (event) => {
    event.preventDefault();
    onNext({});
  };

  return (
    <>
      <h1 className="h1">{check.verified ? 'You’re ready to hire' : 'Account created'}</h1>
      <BusinessResult check={check} className="mt-12" />
      <form className="stack mt-16" onSubmit={submit}>
        <p className="strong">Three things to do first</p>
        <Card>
          <List>
            {todo.map(([icon, title, text]) => (
              <ListItem key={title}>
                <IconCircle name={icon} />
                <span className="grow">
                  <span className="strong block">{title}</span>
                  <span className="text-sm muted">{text}</span>
                </span>
              </ListItem>
            ))}
          </List>
        </Card>
        <StepActions onBack={onBack} nextLabel="Go to my overview" />
      </form>
    </>
  );
}
