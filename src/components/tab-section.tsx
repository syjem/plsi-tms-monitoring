import { getWorkLogs } from '@/app/actions/logs/get-work-logs';
import { ErrorAlert } from '@/components/error-alert';
import { MainTab } from '@/components/tabs';
import React from 'react';

async function TabSection() {
  const { data, error } = await getWorkLogs();

  return (
    <React.Fragment>
      {error && <ErrorAlert error={error} />}
      <section className="mt-6 max-w-xl mx-auto px-4">
        <MainTab logs={data ?? []} />
      </section>
    </React.Fragment>
  );
}

export default TabSection;
