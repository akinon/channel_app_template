import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TransactionModal from '@/pages/Log/components/TransactionModal';

const getFlowStepsMock = vi.fn();

vi.mock('@/api/flows', () => ({ getFlowSteps: (...a: any[]) => getFlowStepsMock(...a) }));
vi.mock('@akinon/ui-layout', () => ({ Row: ({ children }: any) => <div>{children}</div>, Col: ({ children }: any) => <div>{children}</div> }));
vi.mock('@akinon/ui-react', () => ({
  Card: ({ children }: any) => <div data-testid='card'>{children}</div>,
  Button: ({ children, onClick, disabled, title }: any) => <button title={title} disabled={disabled} onClick={onClick}>{children}</button>,
  Select: ({ value, onChange, options }: any) => (
    <select data-testid='select-step' value={value || ''} onChange={e => onChange(e.target.value)}>
      <option value=''>--</option>
      {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  ),
  Text: ({ children }: any) => <span>{children}</span>,
  Spin: () => <div data-testid='spin'>loading</div>
}));

// Stable translation mock (t reference stable across renders to avoid re-running effects endlessly)
const stableT = (k: string) => k;
vi.mock('@akinon/akilocale/react', () => ({ useTranslation: () => ({ t: stableT }) }));

// Clipboard + alert mocks (defineProperty for read-only navigator.clipboard)
if (!('clipboard' in navigator)) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn(() => Promise.resolve()) },
    configurable: true,
  });
} else if (!navigator.clipboard.writeText) {
  (navigator as any).clipboard.writeText = vi.fn(() => Promise.resolve());
}
const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('TransactionModal', () => {
  async function waitUntilSettled() {
    await waitFor(() => expect(getFlowStepsMock).toHaveBeenCalled());
    await new Promise(r => setTimeout(r, 0));
    await waitFor(() => {
      if (screen.queryByTestId('spin')) throw new Error('still loading');
    });
  }
  beforeEach(() => {
    getFlowStepsMock.mockReset();
    (navigator as any).clipboard.writeText = vi.fn(() => Promise.resolve());
    alertSpy.mockClear();
  });
  const flow = { id: 'FLOW1', flow_name: 'FlowName' } as any;

  it('loads steps and selects first then copy/download/refresh actions', async () => {
    // add small delay to guarantee spinner shows then hides
    getFlowStepsMock.mockImplementationOnce(() => new Promise(res => setTimeout(() => res([
      { id: '1', step_name: 'First', status: 'SUCCESS', payload: { a: 1 } },
      { id: '2', step_name: 'Second', status: 'FAILURE', error_message: 'ERR' }
    ]), 5)));

    render(<TransactionModal flow={flow} />);

    await waitUntilSettled();
    await waitFor(() => expect(screen.getByTestId('select-step').querySelectorAll('option').length).toBeGreaterThan(1));
    await waitFor(() => expect(screen.getByTitle('page.log.transaction_modal.copy')).not.toBeDisabled());

    fireEvent.click(screen.getByTitle('page.log.transaction_modal.copy'));
    expect((navigator.clipboard.writeText as any).mock.calls.length).toBeGreaterThan(0);
    fireEvent.click(screen.getByTitle('page.log.transaction_modal.download'));
    fireEvent.click(screen.getByTitle('page.log.transaction_modal.refresh'));
    await waitFor(() => expect(getFlowStepsMock).toHaveBeenCalledTimes(2));
  });

  it('copy fail path', async () => {
    (navigator as any).clipboard.writeText = vi.fn(() => Promise.reject(new Error('nope')));
    getFlowStepsMock.mockResolvedValueOnce([{ id: '1', step_name: 'Only', payload: { x: 2 } }]);
    render(<TransactionModal flow={flow} />);
    await waitUntilSettled();
    await waitFor(() => expect(screen.getByTitle('page.log.transaction_modal.copy')).not.toBeDisabled());
    fireEvent.click(screen.getByTitle('page.log.transaction_modal.copy'));
    await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('page.log.transaction_modal.copy_fail'));
  });

  it('error load path', async () => {
    getFlowStepsMock.mockRejectedValueOnce(new Error('loadFail'));
    render(<TransactionModal flow={flow} />);
    await waitUntilSettled();
    expect(screen.getByText('loadFail')).toBeInTheDocument();
  });

  it('no content path when step selected has no usable payload', async () => {
    getFlowStepsMock.mockResolvedValueOnce([{ id: '1', step_name: 'Empty', status: 'IN_PROGRESS' }]);
    render(<TransactionModal flow={flow} />);
    await waitUntilSettled();
    expect(screen.getByText('page.log.transaction_modal.no_content')).toBeInTheDocument();
  });

  it('handles step change selecting different id', async () => {
    getFlowStepsMock.mockResolvedValueOnce([
      { id: '10', step_name: 'A', status: 'SUCCESS', payload: { z: 9 } },
      { id: '20', step_name: 'B', status: 'FAILURE', exceptions: [{ type: 'E', message: 'm' }] }
    ]);
    render(<TransactionModal flow={flow} />);
    await waitUntilSettled();
    await waitFor(() => expect(screen.getByTestId('select-step').querySelectorAll('option').length).toBeGreaterThan(1));
    fireEvent.change(screen.getByTestId('select-step'), { target: { value: '20' } });
    await waitFor(() => expect(screen.getByText(/\[E\]/)).toBeInTheDocument());
  });

  it('shows loading spinner while fetching', async () => {
    getFlowStepsMock.mockReturnValueOnce(new Promise(() => {})); // pending
    render(<TransactionModal flow={flow} />);
    expect(screen.getByTestId('spin')).toBeInTheDocument();
  });

  it('circular payload falls back to String representation', async () => {
    const circ: any = { foo: 'bar' }; circ.self = circ;
    getFlowStepsMock.mockResolvedValueOnce([{ id: '1', step_name: 'Circ', status: 'SUCCESS', payload: circ }]);
    render(<TransactionModal flow={flow} />);
    await waitUntilSettled();
    await waitFor(() => expect(screen.getByTitle('page.log.transaction_modal.copy')).not.toBeDisabled());
    fireEvent.click(screen.getByTitle('page.log.transaction_modal.copy'));
    await waitFor(() => expect((navigator.clipboard.writeText as any).mock.calls.length).toBeGreaterThan(0));
    const calls = (navigator.clipboard.writeText as any).mock.calls;
    const copied = calls[calls.length - 1][0];
    // circular => JSON.stringify throws -> toText falls back to String(obj) => '[object Object]'
    expect(copied).toBe('[object Object]');
  });

  it('error_message precedence when payload absent', async () => {
    getFlowStepsMock.mockResolvedValueOnce([{ id: '1', step_name: 'Err', status: 'FAILURE', error_message: 'BoomMsg' }]);
    render(<TransactionModal flow={flow} />);
    await waitUntilSettled();
    await waitFor(() => expect(screen.getByTitle('page.log.transaction_modal.copy')).not.toBeDisabled());
    fireEvent.click(screen.getByTitle('page.log.transaction_modal.copy'));
    await waitFor(() => expect((navigator.clipboard.writeText as any).mock.calls.length).toBeGreaterThan(0));
    const calls = (navigator.clipboard.writeText as any).mock.calls;
    const copied = calls[calls.length - 1][0];
    expect(copied).toContain('BoomMsg');
  });
});
