"use client";

import React from "react";

function TableHead() {
  return (
    <thead className="text-sm">
      <tr className="bg-gray-100">
        <th className="font-semibold border border-black p-2 print:p-1 w-16">
          Date
        </th>
        <th className="font-semibold border border-black p-2 print:p-1 w-8">
          Day
        </th>
        <th className="font-semibold border border-black p-2 print:p-1 w-4">
          Sched
        </th>
        <th className="font-semibold border border-black p-2 print:p-1 w-24">
          Time-in
        </th>
        <th className="font-semibold border border-black p-2 print:p-1 w-24">
          Time-out
        </th>
        <th className="font-semibold border border-black p-2 print:p-1 w-44">
          Destination
        </th>
        <th className="font-semibold border border-black p-2 print:p-1 w-32">
          Remarks
        </th>
        <th className="font-semibold border border-black p-2 print:p-1 w-16">
          Signature
        </th>
      </tr>
    </thead>
  );
}

export default TableHead;
