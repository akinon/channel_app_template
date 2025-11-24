import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import FlowDetailModal from '@/pages/Log/components/FlowDetailModal';

const getFlowStepsMock = vi.fn();

vi.mock('@/api/flows', () => ({
  getFlowSteps: (...a: any[]) => getFlowStepsMock(...a)
}));

vi.mock('@akinon/ui-layout', () => ({
  Row: ({ children }: any) => <div data-testid="row">{children}</div>,
  Col: ({ children }: any) => <div data-testid="col">{children}</div>,
}));

vi.mock('@akinon/ui-react', () => ({
  Card: ({ children, title }: any) => <div data-testid="card"><div>{title}</div>{children}</div>,
  Text: ({ children, ...rest }: any) => <span data-testid="text" {...rest}>{children}</span>,
  Select: ({ value, onChange, options, placeholder }: any) => (
    <select data-testid="select" value={value || ''} onChange={e => onChange(e.target.value)} aria-label={placeholder}>
      {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  ),
  Spin: () => <div data-testid="spin">loading</div>
}));

vi.mock('@akinon/akitable', () => ({
  Akitable: ({ data, columns }: any) => (
    <table data-testid="steps-table">
      <tbody>
        {data.map((row: any) => (
          <tr key={row.id}>
            {columns.map((c: any) => <td key={c.key}>{c.render ? c.render(row[c.dataIndex as any], row, 0) : row[c.dataIndex]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}));

vi.mock('@akinon/icons', () => ({
  Icon: ({ onClick }: any) => <span data-testid="icon" onClick={onClick}>icon</span>
}));

vi.mock('@akinon/akilocale/react', () => ({
  useTranslation: () => ({ t: (k: string) => k })
}));

describe('FlowDetailModal', () => {
  beforeEach(() => getFlowStepsMock.mockReset());

  const baseFlow = { id: 'F1', flow_name: 'FLOW1' } as any;

  it('does nothing when no flow id provided', () => {
    render(<FlowDetailModal flow={null} onOpenPayload={vi.fn()} />);
    expect(getFlowStepsMock).not.toHaveBeenCalled();
  });

  it('loads steps success and shows stats + filter works', async () => {
    getFlowStepsMock.mockResolvedValueOnce([
      { id: 'S1', status: 'SUCCESS', step_name: 'A', start_time: '2024-01-01T00:00:00Z', end_time: '2024-01-01T00:05:00Z' },
      { id: 'S2', status: 'FAILURE', step_name: 'B', start_time: '2024-01-01T00:10:00Z', end_time: '2024-01-01T00:20:00Z' },
      { id: 'S3', status: 'IN_PROGRESS', step_name: 'C' },
    ]);

    render(<FlowDetailModal flow={baseFlow} onOpenPayload={vi.fn()} />);

    await waitFor(() => expect(getFlowStepsMock).toHaveBeenCalled());

    // table rows
    expect(screen.getAllByTestId('steps-table').length).toBe(1);

    // stats labels present
    expect(screen.getAllByText('page.log.flow_detail.total_steps').length).toBeGreaterThan(0);

    // filter to SUCCESS only
    fireEvent.change(screen.getByTestId('select'), { target: { value: 'SUCCESS' } });
    // SUCCESS badge text present
    expect(screen.getAllByText('SUCCESS').length).toBeGreaterThan(0);
  });

  it('handles error path', async () => {
    getFlowStepsMock.mockRejectedValueOnce(new Error('boom'));
    render(<FlowDetailModal flow={baseFlow} onOpenPayload={vi.fn()} />);
    await waitFor(() => expect(getFlowStepsMock).toHaveBeenCalled());
    expect(screen.getAllByText('boom').length).toBeGreaterThan(0);
  });

  it('calls onOpenPayload when payload icon clicked', async () => {
    getFlowStepsMock.mockResolvedValueOnce([
      { id: 'S1', status: 'SUCCESS', step_name: 'A' }
    ]);
    const handler = vi.fn();
    render(<FlowDetailModal flow={baseFlow} onOpenPayload={handler} />);
    await waitFor(() => expect(getFlowStepsMock).toHaveBeenCalled());
    // click icon in table
    fireEvent.click(screen.getByTestId('icon'));
    expect(handler).toHaveBeenCalled();
  });

  it('shows loading spinner while fetching', async () => {
    getFlowStepsMock.mockReturnValueOnce(new Promise(() => {}));
    render(<FlowDetailModal flow={baseFlow} onOpenPayload={vi.fn()} />);
    expect(screen.getByTestId('spin')).toBeInTheDocument();
  });

  it('shows no data message when steps empty', async () => {
    getFlowStepsMock.mockResolvedValueOnce([]);
    render(<FlowDetailModal flow={baseFlow} onOpenPayload={vi.fn()} />);
    await waitFor(() => expect(getFlowStepsMock).toHaveBeenCalled());
    expect(screen.getAllByText('page.log.flow_detail.no_data').length).toBeGreaterThan(0);
  });
});
