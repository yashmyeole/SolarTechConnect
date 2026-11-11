import { useSearchParams } from 'react-router';
import { activeFilters, FILTERS, readFilters, writeFilters } from './jobFilters';

export function useJobFilters() {
  const [params, setParams] = useSearchParams();
  const filters = readFilters(params);

  const update = (changes) =>
    setParams(writeFilters({ ...filters, ...changes }), { replace: true, preventScrollReset: true });

  const clearAll = () =>
    update(Object.fromEntries(Object.entries(FILTERS).map(([key, filter]) => [key, filter.fallback])));

  return { filters, active: activeFilters(filters), search: params.toString(), update, clearAll };
}
