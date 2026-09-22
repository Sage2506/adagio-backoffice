import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface AgeRangeFilterProps {
  idPrefix: string;
}

export default function AgeRangeFilter({ idPrefix }: AgeRangeFilterProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [minimumAge, setMinimumAge] = useState(searchParams.get("min_age") ?? "");
  const [maximumAge, setMaximumAge] = useState(searchParams.get("max_age") ?? "");
  const hasActiveRange = searchParams.has("min_age") || searchParams.has("max_age");

  useEffect(() => {
    setMinimumAge(searchParams.get("min_age") ?? "");
    setMaximumAge(searchParams.get("max_age") ?? "");
  }, [searchParams]);

  function updateRange(params: URLSearchParams) {
    params.delete("page[page]");
    navigate(`?${params.toString()}`, { replace: true });
  }

  function applyRange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newParams = new URLSearchParams(searchParams);

    if (minimumAge) newParams.set("min_age", minimumAge);
    else newParams.delete("min_age");

    if (maximumAge) newParams.set("max_age", maximumAge);
    else newParams.delete("max_age");

    updateRange(newParams);
  }

  function clearRange() {
    setMinimumAge("");
    setMaximumAge("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("min_age");
    newParams.delete("max_age");
    updateRange(newParams);
  }

  return (
    <form onSubmit={applyRange} className="flex items-end gap-2" aria-label="Filter by age range">
      <div>
        <label htmlFor={`${idPrefix}-minimum-age`} className="block text-label-md font-label-md text-on-surface-variant">Age from</label>
        <input
          id={`${idPrefix}-minimum-age`}
          type="number"
          min="0"
          max="120"
          inputMode="numeric"
          value={minimumAge}
          onChange={event => setMinimumAge(event.target.value)}
          placeholder="4"
          className="mt-1 w-20 rounded-lg border border-outline-variant bg-surface-lowest px-3 py-2 text-body-md font-body-md text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-maximum-age`} className="block text-label-md font-label-md text-on-surface-variant">Age to</label>
        <input
          id={`${idPrefix}-maximum-age`}
          type="number"
          min={minimumAge || "0"}
          max="120"
          inputMode="numeric"
          value={maximumAge}
          onChange={event => setMaximumAge(event.target.value)}
          placeholder="8"
          className="mt-1 w-20 rounded-lg border border-outline-variant bg-surface-lowest px-3 py-2 text-body-md font-body-md text-on-surface outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
      <button type="submit" title="Apply age range" className="flex size-10 items-center justify-center rounded-lg bg-primary text-on-primary transition-colors hover:bg-surface-tint focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface">
        <FunnelIcon className="size-5" />
        <span className="sr-only">Apply age range</span>
      </button>
      {hasActiveRange && (
        <button type="button" onClick={clearRange} title="Clear age range" className="flex size-10 items-center justify-center rounded-lg border border-outline-variant bg-surface-lowest text-on-surface-variant transition-colors hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface">
          <XMarkIcon className="size-5" />
          <span className="sr-only">Clear age range</span>
        </button>
      )}
    </form>
  );
}
