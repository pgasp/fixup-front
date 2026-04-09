import { after, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AddressInfo } from 'node:net';
import { createApp } from '../../backend/app';

describe('backend users', () => {
  const app = createApp();
  const server = app.listen(0);
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  after(() => {
    server.close();
  });

  const login = async (email: string, password: string): Promise<string> => {
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    assert.equal(loginRes.status, 200);
    const { token } = (await loginRes.json()) as { token: string };
    return token;
  };

  it('allows administrator to list users', async () => {
    const token = await login('admin@fixup.local', 'admin123');
    const res = await fetch(`${baseUrl}/api/v1/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(res.status, 200);
    const users = (await res.json()) as unknown[];
    assert.ok(Array.isArray(users));
    assert.ok(users.length >= 1);
  });

  it('forbids non-admin from listing users', async () => {
    const token = await login('mecanicien@fixup.local', 'meca123');
    const res = await fetch(`${baseUrl}/api/v1/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(res.status, 403);
  });

  it('creates and deletes a user as admin', async () => {
    const token = await login('admin@fixup.local', 'admin123');
    const createRes = await fetch(`${baseUrl}/api/v1/users`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'temp-user-test@fixup.local',
        displayName: 'Temp Test',
        role: 'accountant',
        password: 'secret12',
      }),
    });
    assert.equal(createRes.status, 201);
    const created = (await createRes.json()) as { id: string; email: string };
    assert.equal(created.email, 'temp-user-test@fixup.local');

    const delRes = await fetch(`${baseUrl}/api/v1/users/${created.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(delRes.status, 204);
  });
});
