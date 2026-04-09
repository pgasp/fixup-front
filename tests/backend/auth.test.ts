import { after, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AddressInfo } from 'node:net';
import { createApp } from '../../backend/app';

describe('backend auth', () => {
  const app = createApp();
  const server = app.listen(0);
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  after(() => {
    server.close();
  });

  it('rejects clients without token', async () => {
    const response = await fetch(`${baseUrl}/api/v1/clients`);
    assert.equal(response.status, 401);
  });

  it('logs in and accesses protected route', async () => {
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@fixup.local', password: 'admin123' }),
    });
    assert.equal(loginRes.status, 200);
    const { token } = await loginRes.json() as { token: string };
    assert.ok(typeof token === 'string' && token.length > 0);

    const clientsRes = await fetch(`${baseUrl}/api/v1/clients`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(clientsRes.status, 200);
    const payload = await clientsRes.json() as unknown[];
    assert.ok(Array.isArray(payload));
  });

  it('rejects wrong password', async () => {
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@fixup.local', password: 'wrong' }),
    });
    assert.equal(loginRes.status, 401);
  });

  it('lists technician-role app users when section allowed', async () => {
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@fixup.local', password: 'admin123' }),
    });
    assert.equal(loginRes.status, 200);
    const { token } = (await loginRes.json()) as { token: string };

    const res = await fetch(`${baseUrl}/api/v1/auth/technician-app-users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(res.status, 200);
    const list = (await res.json()) as Array<{ id: string; email: string; roles: string[] }>;
    assert.ok(Array.isArray(list));
    assert.ok(list.some((u) => u.email === 'mecanicien@fixup.local' && u.roles.includes('mechanic')));
  });

  it('forbids technician-app-users for role without technicians section', async () => {
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'comptable@fixup.local', password: 'compta123' }),
    });
    assert.equal(loginRes.status, 200);
    const { token } = (await loginRes.json()) as { token: string };

    const res = await fetch(`${baseUrl}/api/v1/auth/technician-app-users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(res.status, 403);
  });
});
