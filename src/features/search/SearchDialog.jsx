import { Fragment, useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import Icon from '@/components/Icon';
import { useCompanies, useRole } from '@/store';
import { useUiStore } from '@/store/ui';
import { searchGroups } from './searchIndex';
import styles from './SearchDialog.module.css';

const ICON = { recent: 'clock', page: 'arrowRight', query: 'search' };

export default function SearchDialog() {
  const close = useUiStore((state) => state.closeSearch);
  const navigate = useNavigate();
  const role = useRole();
  const companies = useCompanies();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listId = useId();

  const groups = useMemo(() => {
    let position = 0;
    return searchGroups(query, role, companies).map((group) => ({
      ...group,
      items: group.items.map((item) => ({ ...item, position: position++ })),
    }));
  }, [query, role, companies]);
  const items = groups.flatMap((group) => group.items);
  const optionId = (index) => `${listId}-${index}`;

  const open = (item) => {
    close();
    navigate(item.to);
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = (active + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      setActive(next);
      document.getElementById(optionId(next))?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' && items[active]) {
      event.preventDefault();
      open(items[active]);
    }
  };

  return (
    <Dialog variant="search" label="Search" onClose={close}>
      <div className={styles.inputRow}>
        <Icon name="search" />
        <input
          data-autofocus
          className={styles.input}
          role="combobox"
          aria-label="Search"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={items.length ? optionId(active) : undefined}
          placeholder="Search jobs, people, companies or settings"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
        />
        <Button iconOnly size="sm" aria-label="Close search" onClick={close}>
          <Icon name="x" size={18} />
        </Button>
      </div>
      <div className={styles.results} id={listId} role="listbox" aria-label="Results">
        {groups.map((group) => (
          <Fragment key={group.title}>
            <p className={styles.groupTitle} role="presentation">
              {group.title}
            </p>
            {group.items.map((item) => (
              <button
                key={item.to}
                type="button"
                role="option"
                id={optionId(item.position)}
                aria-selected={item.position === active}
                tabIndex={-1}
                className={styles.option}
                onMouseMove={() => setActive(item.position)}
                onClick={() => open(item)}
              >
                {item.avatar ? (
                  <Avatar name={item.avatar.name} company={item.avatar.company} size={32} />
                ) : (
                  <span className={styles.icon}>
                    <Icon name={ICON[item.type]} size={17} />
                  </span>
                )}
                <span className="grow">
                  <span className="strong block">{item.label}</span>
                  {item.detail && <span className="text-xs subtle">{item.detail}</span>}
                </span>
              </button>
            ))}
          </Fragment>
        ))}
      </div>
      <div className={styles.foot} aria-hidden="true">
        <span>
          <kbd>↑</kbd> <kbd>↓</kbd> to move
        </span>
        <span>
          <kbd>Enter</kbd> to open
        </span>
        <span>
          <kbd>Esc</kbd> to close
        </span>
      </div>
    </Dialog>
  );
}
