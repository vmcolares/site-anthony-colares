const htmlHeaders = {
  'content-type': 'text/html; charset=UTF-8',
  'cache-control': 'no-store',
};

function page(script) {
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>CMS authentication</title></head><body><script>${script}</script></body></html>`, { headers: htmlHeaders });
}

function errorPage(message) {
  const safe = JSON.stringify(`authorization:github:error:${message}`);
  return page(`
    window.opener?.postMessage(${safe}, '*');
    document.body.textContent = ${JSON.stringify(message)};
  `);
}

function callbackMessage(payload, targetOrigin) {
  const message = JSON.stringify(`authorization:github:success:${JSON.stringify(payload)}`);
  return page(`
    const message = ${message};
    const target = ${JSON.stringify(targetOrigin)};
    let completed = false;
    function finish(origin) {
      if (completed || !window.opener) return;
      completed = true;
      window.opener.postMessage(message, origin || target);
      setTimeout(() => window.close(), 300);
    }
    window.addEventListener('message', (event) => {
      if (typeof event.data === 'string' && event.data.startsWith('authorizing:github')) finish(event.origin);
    });
    window.opener?.postMessage('authorizing:github', target);
    setTimeout(() => finish(target), 1200);
  `);
}

function getRedirectUri(request) {
  return `${new URL(request.url).origin}/callback`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/health') {
      return new Response('ok', { headers: { 'content-type': 'text/plain; charset=UTF-8' } });
    }

    if (request.method === 'GET' && url.pathname === '/auth') {
      if (!env.GITHUB_CLIENT_ID || !env.CMS_ORIGIN) return new Response('Worker is not configured.', { status: 500 });
      const state = crypto.randomUUID();
      const authUrl = new URL('https://github.com/login/oauth/authorize');
      authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', getRedirectUri(request));
      authUrl.searchParams.set('scope', url.searchParams.get('scope') || 'repo');
      authUrl.searchParams.set('state', state);
      return new Response(null, {
        status: 302,
        headers: {
          location: authUrl.toString(),
          'set-cookie': `oauth_state=${state}; Max-Age=600; Path=/; HttpOnly; Secure; SameSite=Lax`,
        },
      });
    }

    if (request.method === 'GET' && url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const returnedState = url.searchParams.get('state');
      const cookieState = request.headers.get('cookie')?.match(/(?:^|; )oauth_state=([^;]+)/)?.[1];
      if (url.searchParams.get('error')) return errorPage(url.searchParams.get('error_description') || url.searchParams.get('error'));
      if (!code || !returnedState || returnedState !== cookieState) return errorPage('OAuth state validation failed. Please try again.');
      if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET || !env.CMS_ORIGIN) return errorPage('Worker is not configured.');

      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { accept: 'application/json', 'content-type': 'application/json', 'user-agent': 'Anthony-Colares-CMS-OAuth' },
        body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, state: returnedState, redirect_uri: getRedirectUri(request) }),
      });
      const token = await tokenResponse.json();
      if (!token.access_token) return errorPage(token.error_description || 'GitHub did not return an access token.');
      return callbackMessage({ token: token.access_token, provider: 'github' }, env.CMS_ORIGIN);
    }

    return new Response('Not found', { status: 404 });
  },
};

