import { getWorkLogs } from '@/app/actions/logs/get-work-logs';
import { MainTab } from '@/components/tabs';
import React from 'react';

async function TabSection() {
  const workLogs = await getWorkLogs();

  return (
    <React.Fragment>
      <section className="mt-6 max-w-xl mx-auto px-4">
        <MainTab logs={workLogs} />
      </section>
    </React.Fragment>
  );
}

export default TabSection;
