# OAuth proxy do Decap CMS

Este Worker faz somente a autenticação GitHub do painel Decap CMS. O site e os conteúdos continuam no GitHub Pages/GitHub.

## 1. Criar uma GitHub OAuth App

Em GitHub → Settings → Developer settings → OAuth Apps → New OAuth App:

- Homepage URL: `https://vmcolares.github.io/site-anthony-colares/`
- Authorization callback URL: `https://SEU-WORKER.workers.dev/callback`

O endereço final do Worker aparece depois do primeiro deploy. Se ele mudar, atualize a callback URL na OAuth App.

## 2. Instalar e autenticar o Wrangler

No PowerShell, dentro desta pasta:

```powershell
npx wrangler login
```

## 3. Fazer o primeiro deploy

```powershell
npx wrangler deploy
```

Depois do deploy, copie o endereço `workers.dev` exibido e complete a callback URL da OAuth App.

## 4. Adicionar os secrets

Ainda dentro de `oauth-worker`:

```powershell
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

O Wrangler solicita os valores de forma interativa. Eles não devem ser commitados no GitHub. O Cloudflare recomenda usar secrets para credenciais sensíveis. O plano gratuito é suficiente para o volume esperado deste site.

## 5. Ligar o Decap ao Worker

Depois de saber o endereço do Worker, edite `admin/config.yml`:

```yaml
backend:
  name: github
  repo: vmcolares/site-anthony-colares
  branch: main
  base_url: https://SEU-WORKER.workers.dev
  auth_endpoint: auth
  site_domain: vmcolares.github.io
```

Faça commit dessa alteração. O painel será acessado em `/admin/` e o botão de login abrirá o GitHub, retornando ao CMS depois da autorização.

