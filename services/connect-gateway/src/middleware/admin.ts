import type { Context, Next } from 'hono';

export async function adminAuth(c: Context, next: Next): Promise<Response | void> {
  const expectedToken = process.env.GATEWAY_ADMIN_TOKEN;
  if (!expectedToken) {
    return c.json({ error: 'admin token not configured' }, 503);
  }

  const authorization = c.req.header('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return c.json({ error: 'admin authorization required' }, 401);
  }

  const token = authorization.slice('Bearer '.length).trim();
  if (token !== expectedToken) {
    return c.json({ error: 'invalid admin token' }, 401);
  }

  await next();
}
