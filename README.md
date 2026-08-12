# Site — Anthony Colares

Site currículo acadêmico responsivo, feito com HTML, CSS e JavaScript puros. Não precisa de Node, dependências ou processo de build: basta publicar a raiz do repositório no GitHub Pages.

## Onde editar

- `index.html`: estrutura da página. Evite editar este arquivo para alterar conteúdo.
- `styles.css`: cores padrão, tipografia, espaçamentos e comportamento responsivo.
- `script.js`: carrega os conteúdos e controla o menu mobile.
- `conteudo/perfil.json`: nome, biografia, pesquisa, formação, foto e links.
- `conteudo/trabalhos.json`: publicações e trabalhos apresentados no site.
- `conteudo/configuracao.json`: cores do site.
- `admin/`: painel visual do Decap CMS. Depois de configurar o repositório e a autenticação, ele estará disponível em `/admin/`.

## Como editar pelo GitHub

No repositório do GitHub, abra um arquivo dentro de `conteudo/`, clique no ícone de lápis, altere os valores mantendo as aspas e vírgulas, e use **Commit changes**. O GitHub Pages publicará a alteração automaticamente depois de alguns instantes.

Para trocar a foto, envie uma nova imagem para a raiz do repositório e altere o valor de `foto` em `conteudo/perfil.json`, por exemplo: `"foto": "nova-foto.jpg"`.

Não apague as chaves do JSON. Se um texto contiver aspas, use `\"` dentro do valor. As propriedades `titulo`, `nota` e `sobre.titulo` aceitam HTML simples para manter as quebras de linha e o destaque em itálico.

## Painel visual

O painel Decap CMS foi preparado em `admin/`. Para ativá-lo, edite `admin/config.yml` e substitua `SEU_USUARIO/site-anthony-colares` pelo caminho real do repositório. O login GitHub ainda precisa de um OAuth proxy; não coloque tokens secretos em arquivos públicos do site.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie estes arquivos para a branch `main`.
2. Em **Settings → Pages**, selecione **Deploy from a branch**.
3. Escolha a branch `main`, a pasta `/ (root)` e salve.

Depois, o GitHub exibirá o endereço público do site na mesma tela. Os textos entre colchetes são marcadores para substituir com Anthony.

