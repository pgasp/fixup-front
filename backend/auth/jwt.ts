import { createHmac, timingSafeEqual } from 'crypto';

export interface JwtPayload {
  sub: string;
  email: string;
  displayName: string;
  roles: string[];
  exp: number;
}

const base64UrlEncode = (data: string): string =>
  Buffer.from(data, 'utf8').toString('base64url');

const base64UrlDecode = (data: string): string =>
  Buffer.from(data, 'base64url').toString('utf8');

const getSecret = (): string =>
  process.env.JWT_SECRET ?? 'dev-insecure-change-me';

const getExpiresSeconds = (): number => {
  const raw = process.env.JWT_EXPIRES_IN;
  if (!raw) {
    return 60 * 60 * 24;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? 60 * 60 * 24 : parsed;
};

export const signJwt = (payload: Omit<JwtPayload, 'exp'>): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + getExpiresSeconds();
  const body: JwtPayload = { ...payload, exp };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(body));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac('sha256', getSecret()).update(data).digest('base64url');
  return `${data}.${signature}`;
};

export const verifyJwt = (token: string): JwtPayload => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token');
  }
  const [encodedHeader, encodedPayload, signature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const expected = createHmac('sha256', getSecret()).update(data).digest('base64url');
  const sigBuf = Buffer.from(signature, 'base64url');
  const expBuf = Buffer.from(expected, 'base64url');
  if (sigBuf.length !== expBuf.length) {
    throw new Error('Invalid signature');
  }
  if (!timingSafeEqual(sigBuf, expBuf)) {
    throw new Error('Invalid signature');
  }
  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload;
  if (payload.exp * 1000 < Date.now()) {
    throw new Error('Token expired');
  }
  return payload;
};
