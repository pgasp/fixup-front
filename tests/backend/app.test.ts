import { after, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AddressInfo } from 'node:net';
import { createApp } from '../../backend/app';

describe('backend app', () => {
  const app = createApp();
  const server = app.listen(0);
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  after(() => {
    server.close();
  });

  it('serves health endpoint', async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    assert.equal(response.status, 200);
    const payload = await response.json() as { status: string; version: string; uptimeMs: number };
    assert.equal(payload.status, 'ok');
    assert.ok(typeof payload.version === 'string');
    assert.ok(payload.uptimeMs >= 0);
  });

  it('serves clients endpoint', async () => {
    const response = await fetch(`${baseUrl}/api/v1/clients`);
    assert.equal(response.status, 200);
    const payload = await response.json() as unknown[];
    assert.ok(Array.isArray(payload));
  });
});
