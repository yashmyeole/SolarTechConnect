import { Button } from '@/components/Button';
import { Dialog, DialogBody, DialogFooter } from '@/components/Dialog';
import { Radio } from '@/components/Field';
import { FILTERS } from './jobFilters';
import styles from './jobs.module.css';

export default function FiltersDrawer({ filters, resultCount, onChange, onClear, onClose }) {
  return (
    <Dialog title="Filters" variant="drawer" onClose={onClose}>
      <DialogBody>
        {Object.entries(FILTERS).map(([key, filter]) => (
          <fieldset key={key} className={styles.filterGroup}>
            <legend className="h3">{filter.label}</legend>
            <div className="mt-4">
              {filter.options.map(([value, label]) => (
                <Radio
                  key={label}
                  name={`filter-${key}`}
                  label={label}
                  checked={filters[key] === value}
                  onChange={() => onChange({ [key]: value })}
                />
              ))}
            </div>
          </fieldset>
        ))}
      </DialogBody>
      <DialogFooter className={styles.drawerFooter}>
        <Button variant="quiet" onClick={onClear}>
          Clear all
        </Button>
        <Button variant="primary" onClick={onClose}>
          Show {resultCount} {resultCount === 1 ? 'job' : 'jobs'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
