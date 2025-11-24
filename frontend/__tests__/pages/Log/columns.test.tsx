import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeLogColumns } from '@/pages/Log/Table/columns';
import { render } from '@testing-library/react';

vi.mock('@akinon/icons', () => ({
  Icon: ({ onClick }: any) => <span data-testid="icon" onClick={onClick}>ico</span>
}));

describe('makeLogColumns', () => {
  const base: any = {
    id: 123,
    flow_name: 'FLOW_X',
    flow_author: 'author',
    started_at: new Date('2024-01-01T10:00:00Z').toISOString(),
    ended_at: new Date('2024-01-01T11:00:00Z').toISOString(),
    status: 'SUCCESS',
    transaction_id: 'TX-9'
  };

  let runSpy: any; let payloadSpy: any;
  beforeEach(() => { runSpy = vi.fn(); payloadSpy = vi.fn(); });

  it('renders id cell clickable and triggers handleOpenRun', () => {
    const cols = makeLogColumns({ handleOpenRun: runSpy, handleOpenPayload: payloadSpy });
    const idCol = cols.find(c => c.key === 'id')!;
  const ui = idCol.render!(base.id, base, 0);
    const { getByText } = render(ui as any);
    getByText('123').click();
    expect(runSpy).toHaveBeenCalledWith(base);
  });

  it('renders payload icon and triggers handleOpenPayload', () => {
    const cols = makeLogColumns({ handleOpenRun: runSpy, handleOpenPayload: payloadSpy });
    const payloadCol = cols.find(c => c.key === 'payload')!;
  const ui = payloadCol.render!(null, base, 0);
    const { getByTestId } = render(ui as any);
    getByTestId('icon').click();
    expect(payloadSpy).toHaveBeenCalledWith(base);
  });

  it('renders date columns correctly', () => {
    const cols = makeLogColumns({ handleOpenRun: runSpy, handleOpenPayload: payloadSpy });
    const startedCol = cols.find(c => c.key === 'started_at')!;
    const endedCol = cols.find(c => c.key === 'ended_at')!;
  const r1 = startedCol.render!(base.started_at, base, 0) as any;
  const r2 = endedCol.render!(base.ended_at, base, 0) as any;
    expect(typeof r1).toBe('string');
    expect(typeof r2).toBe('string');
  });

  it('renders status variants', () => {
    const cols = makeLogColumns({ handleOpenRun: runSpy, handleOpenPayload: payloadSpy });
    const statusCol = cols.find(c => c.key === 'status')!;
  const success = statusCol.render!('SUCCESS' as any, base, 0) as any;
  const failure = statusCol.render!('FAILURE' as any, base, 0) as any;
  const other = statusCol.render!('IN_PROGRESS' as any, base, 0) as any;
    const { getAllByText, rerender } = render(success);
    expect(getAllByText('SUCCESS').length).toBeGreaterThan(0);
    rerender(failure as any);
    expect(getAllByText('FAILURE').length).toBeGreaterThan(0);
    rerender(other as any);
    expect(getAllByText('IN_PROGRESS').length).toBeGreaterThan(0);
  });
});
