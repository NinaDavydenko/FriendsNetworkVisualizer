import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  people: { dob: string }[];
}

function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function groupAges(people: { dob: string }[]) {
  const ageGroups: Record<string, number> = {};
  people.forEach(({ dob }) => {
    const age = calculateAge(dob);
    const group = `${Math.floor(age / 10) * 10}s`;
    ageGroups[group] = (ageGroups[group] || 0) + 1;
  });

  return Object.entries(ageGroups)
    .map(([group, count]) => ({ group, count }))
    .sort((a, b) => a.group.localeCompare(b.group));
}

export const AgeDistributionChart: React.FC<Props> = ({ people }) => {
  const data = groupAges(people);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="group" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};
