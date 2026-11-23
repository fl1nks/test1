import fs from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');
const CONTENT_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { name: string } }) {
  const { name } = params;
  // Строгая валидация: uuid + расширение, без путей
  if (!/^[A-Za-z0-9-]+\.(jpg|jpeg|png|webp)$/.test(name)) {
    return new Response('Not found', { status: 404 });
  }
  const file = path.join(UPLOAD_DIR, name);
  let data: Buffer;
  try {
    data = fs.readFileSync(file);
  } catch {
    return new Response('Not found', { status: 404 });
  }
  const ext = name.split('.').pop()!.toLowerCase();
  return new Response(new Uint8Array(data), {
    status: 200,
    headers: {
      'Content-Type': CONTENT_TYPES[ext] ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
