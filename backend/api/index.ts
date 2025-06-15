import { createServer, IncomingMessage, ServerResponse } from 'http';
import { bootstrap } from '../src/main';

let cachedServer: any = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(req, res);
}
