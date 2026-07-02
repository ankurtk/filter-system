// ============================================================
// employeeFilterConfig.ts
// FilterFieldDefinition[] for the Employee table.
// This is the ONLY file that needs to change when using the
// FilterBuilder component with a different data schema.
// ============================================================

import type { FilterFieldDefinition } from '../types/filter.types';

export const EMPLOYEE_FILTER_CONFIG: FilterFieldDefinition[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'text',
  },
  {
    key: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { value: 'Engineering', label: 'Engineering' },
      { value: 'Design', label: 'Design' },
      { value: 'Finance', label: 'Finance' },
      { value: 'HR', label: 'HR' },
      { value: 'Marketing', label: 'Marketing' },
      { value: 'Sales', label: 'Sales' },
    ],
  },
  {
    key: 'role',
    label: 'Role',
    type: 'text',
  },
  {
    key: 'salary',
    label: 'Salary',
    type: 'amount',
  },
  {
    key: 'joinDate',
    label: 'Join Date',
    type: 'date',
  },
  {
    key: 'isActive',
    label: 'Active Status',
    type: 'boolean',
  },
  {
    key: 'skills',
    label: 'Skills',
    type: 'multiselect',
    options: [
      { value: 'React', label: 'React' },
      { value: 'TypeScript', label: 'TypeScript' },
      { value: 'Node.js', label: 'Node.js' },
      { value: 'Python', label: 'Python' },
      { value: 'Go', label: 'Go' },
      { value: 'Kubernetes', label: 'Kubernetes' },
      { value: 'AWS', label: 'AWS' },
      { value: 'Docker', label: 'Docker' },
      { value: 'SQL', label: 'SQL' },
      { value: 'Figma', label: 'Figma' },
      { value: 'Salesforce', label: 'Salesforce' },
      { value: 'Excel', label: 'Excel' },
      { value: 'TensorFlow', label: 'TensorFlow' },
      { value: 'PyTorch', label: 'PyTorch' },
      { value: 'Terraform', label: 'Terraform' },
    ],
  },
  {
    key: 'address.city',
    label: 'City',
    type: 'select',
    options: [
      { value: 'San Francisco', label: 'San Francisco' },
      { value: 'New York', label: 'New York' },
      { value: 'Seattle', label: 'Seattle' },
      { value: 'Austin', label: 'Austin' },
      { value: 'Chicago', label: 'Chicago' },
      { value: 'Dallas', label: 'Dallas' },
      { value: 'Los Angeles', label: 'Los Angeles' },
      { value: 'Boston', label: 'Boston' },
      { value: 'Miami', label: 'Miami' },
      { value: 'Denver', label: 'Denver' },
      { value: 'Atlanta', label: 'Atlanta' },
      { value: 'Portland', label: 'Portland' },
      { value: 'Phoenix', label: 'Phoenix' },
      { value: 'Nashville', label: 'Nashville' },
      { value: 'Charlotte', label: 'Charlotte' },
      { value: 'Minneapolis', label: 'Minneapolis' },
      { value: 'Columbus', label: 'Columbus' },
      { value: 'Washington', label: 'Washington' },
      { value: 'San Diego', label: 'San Diego' },
      { value: 'Palo Alto', label: 'Palo Alto' },
      { value: 'Raleigh', label: 'Raleigh' },
      { value: 'Houston', label: 'Houston' },
      { value: 'Indianapolis', label: 'Indianapolis' },
      { value: 'San Jose', label: 'San Jose' },
    ],
  },
  {
    key: 'address.state',
    label: 'State',
    type: 'text',
  },
  {
    key: 'projects',
    label: 'Projects',
    type: 'number',
  },
  {
    key: 'lastReview',
    label: 'Last Review',
    type: 'date',
  },
  {
    key: 'performanceRating',
    label: 'Performance Rating',
    type: 'number',
  },
];
