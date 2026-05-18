import { expect, test, vi } from 'vitest';

vi.mock('@/lib/appwrite/admin', () => ({
  createAdminClient: vi.fn(),
}));

vi.mock('@/config/appwrite', () => ({
  DATABASE_ID: 'test_db',
  COLLECTIONS: {
    SESSIONS: 'sessions_col',
  },
}));

import { getAllSessions, upsertSession } from '@/lib/actions/academic';
import { createAdminClient } from '@/lib/appwrite/admin';

test('getAllSessions returns sessions in descending order', async () => {
  const mockDatabases = {
    listDocuments: vi.fn().mockResolvedValue({
      documents: [
        { $id: 's2', sessionName: '2026-2027', isActive: true },
        { $id: 's1', sessionName: '2025-2026', isActive: true },
      ],
      total: 2
    }),
  };

  (createAdminClient as any).mockResolvedValue({ databases: mockDatabases });

  const result = await getAllSessions();

  expect(result.success).toBe(true);
  expect(result.sessions[0].sessionName).toBe('2026-2027');
  expect(mockDatabases.listDocuments).toHaveBeenCalledWith(
    'test_db',
    'sessions_col',
    expect.arrayContaining([expect.anything()]) // Query verification
  );
});

test('upsertSession handles both create and update', async () => {
  const mockDatabases = {
    createDocument: vi.fn().mockResolvedValue({ $id: 'new_id' }),
    updateDocument: vi.fn().mockResolvedValue({ $id: 'existing_id' }),
  };

  (createAdminClient as any).mockResolvedValue({ databases: mockDatabases });

  // Test Create
  const createRes = await upsertSession({
    sessionName: '2027-2028',
    isActive: true,
    isCurrent: false
  });
  expect(createRes.success).toBe(true);
  expect(mockDatabases.createDocument).toHaveBeenCalled();

  // Test Update
  const updateRes = await upsertSession({
    sessionName: '2027-2028-Updated',
    isActive: true,
    isCurrent: true,
    docId: 'existing_id'
  });
  expect(updateRes.success).toBe(true);
  expect(mockDatabases.updateDocument).toHaveBeenCalledWith(
    'test_db',
    'sessions_col',
    'existing_id',
    expect.objectContaining({ sessionName: '2027-2028-Updated' })
  );
});
