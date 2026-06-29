import type { KeyMode } from '@prisma/client';
import { Hono } from 'hono';
import { createApiKey, listApiKeys, revokeApiKey, rotateApiKey } from '../keys.js';
import { adminAuth } from '../middleware/admin.js';
import { webhookRoutes } from './webhooks.js';

const admin = new Hono();

admin.use('*', adminAuth);
admin.route('/webhooks', webhookRoutes);

admin.get('/keys', async (c) => {
  const keys = await listApiKeys();
  return c.json({ keys });
});

admin.post('/keys', async (c) => {
  const body = await c.req.json<{
    mode?: KeyMode;
    allowedOrigins?: string[];
    label?: string;
  }>();

  if (!body.mode || (body.mode !== 'live' && body.mode !== 'test')) {
    return c.json({ error: 'mode must be "live" or "test"' }, 400);
  }

  if (!Array.isArray(body.allowedOrigins) || body.allowedOrigins.length === 0) {
    return c.json({ error: 'allowedOrigins must be a non-empty array' }, 400);
  }

  for (const origin of body.allowedOrigins) {
    if (typeof origin !== 'string' || !origin.startsWith('http')) {
      return c.json({ error: 'each allowedOrigin must be a valid http(s) origin' }, 400);
    }
  }

  const key = await createApiKey({
    mode: body.mode,
    allowedOrigins: body.allowedOrigins,
    label: body.label,
  });

  return c.json({ key }, 201);
});

admin.post('/keys/:id/rotate', async (c) => {
  const id = c.req.param('id');
  const key = await rotateApiKey(id);

  if (!key) {
    return c.json({ error: 'key not found or revoked' }, 404);
  }

  return c.json({ key });
});

admin.post('/keys/:id/revoke', async (c) => {
  const id = c.req.param('id');
  const key = await revokeApiKey(id);

  if (!key) {
    return c.json({ error: 'key not found' }, 404);
  }

  return c.json({ key });
});

export { admin as adminRoutes };
