import { FilterProps } from "@akinon/akifilter";

export const filterSchema: FilterProps["filterSchema"] = [
  {
    key: 'flow_name',
    type: 'input',
    label: 'Flow Name',
    placeholder: 'Flow Name'
  },
  {
    key: 'flow_author',
    type: 'input',
    label: 'Flow Author',
    placeholder: 'Flow Author'
  },
  {
    key: 'status',
    type: 'select',
    label: 'Status',
    options: [
      { key: 'all',     value: '',         label: 'All' },
      { key: 'success', value: 'SUCCESS', label: 'Success' },
      { key: 'failure', value: 'FAILURE', label: 'Failure' },
      { key: 'pending', value: 'PENDING', label: 'Pending' },
      { key: 'running', value: 'RUNNING',  label: 'Running' },
    ],
    placeholder: 'Select Status'
  },
  {
    key: 'id',
    type: 'input',
    label: 'ID',
    placeholder: 'ID'
  },
  {
    key: 'transaction_id',
    type: 'input',
    label: 'Transaction ID',
    placeholder: 'Transaction ID'
  },
  {
    key: 'started_at',
    type: 'datepicker',
    label: 'Started At',
    placeholder: 'Started At'
  },
  {
    key: 'ended_at',
    type: 'datepicker',
    label: 'Ended At',
    placeholder: 'Ended At'
  },
];
