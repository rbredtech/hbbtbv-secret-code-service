import { createHash } from 'crypto';

import config from 'config';
import express, { Request } from 'express';
import morgan from 'morgan';

const app = express();
app.use(morgan('tiny'));
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-store');
  res.header('Access-Control-Allow-Origin', config.get('ALLOW_ORIGIN'));
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});

let delayLock = false;

function getAuthenticationToken(req: Request) {
  const hash = createHash('sha256');
  hash.update(req.ip);
  hash.update(req.get('User-Agent') || '');
  hash.update(config.get('AUTHENTICATION_SALT'));
  return hash.digest('hex');
}

app.get('/keys/:keys', (req, res) => {
  const allKeys: Record<string, string> = config.get('SECRET_KEYS');
  try {
    if (!delayLock && allKeys[req.params.keys]) {
      res.set('Content-Type', 'text/html; charset=utf-8');
      res.write(allKeys[req.params.keys]);
      // add access token as URL-parameter
      res.write(-1 === allKeys[req.params.keys].indexOf('?') ? '?' : '&');
      res.write('a=');
      res.write(getAuthenticationToken(req));
      res.status(200);
      res.send();
    } else {
      res.sendStatus(404);
      if (!delayLock) {
        delayLock = true;
        setTimeout(() => { delayLock = false; }, config.get('BLOCK_DELAY'));
      }
    }
  } catch (ex) {
    res.sendStatus(500);
  }
});

app.listen(config.get('PORT'));
