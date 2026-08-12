const contentFiles = ['conteudo/configuracao.json', 'conteudo/perfil.json', 'conteudo/trabalhos.json'];

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const linkAttrs = (url) => url && url.startsWith('http') ? ' target="_blank" rel="noreferrer"' : '';

async function loadContent() {
  const [config, profile, work] = await Promise.all(contentFiles.map((file) => fetch(file).then((response) => {
    if (!response.ok) throw new Error(`Não foi possível carregar ${file}`);
    return response.json();
  })));

  document.documentElement.style.setProperty('--ink', config.cores.tinta);
  document.documentElement.style.setProperty('--muted', config.cores.muted);
  document.documentElement.style.setProperty('--paper', config.cores.papel);
  document.documentElement.style.setProperty('--accent', config.cores.destaque);
  document.documentElement.style.setProperty('--line', config.cores.linha);
  document.title = profile.tituloPagina;
  document.querySelector('[data-site-title]').textContent = profile.tituloPagina;
  document.querySelector('[data-site-description]').content = profile.descricao;
  document.querySelector('[data-hero-eyebrow]').textContent = profile.capa.etiqueta;
  document.querySelector('[data-hero-title]').innerHTML = profile.capa.titulo;
  document.querySelector('[data-hero-intro]').textContent = profile.capa.introducao;
  document.querySelector('[data-hero-note]').innerHTML = profile.capa.nota;
  const image = document.querySelector('[data-profile-image]');
  image.src = profile.foto;
  image.alt = profile.fotoAlt;
  document.querySelector('[data-about-title]').innerHTML = profile.sobre.titulo;
  document.querySelector('[data-about-left]').textContent = profile.sobre.paragrafo1;
  document.querySelector('[data-about-right]').textContent = profile.sobre.paragrafo2;
  document.querySelector('[data-publications-period]').textContent = work.periodo;
  document.querySelector('[data-interests]').innerHTML = profile.pesquisa.map((item, index) => `<div class="interest-item"><span>${String(index + 1).padStart(2, '0')}</span><h3>${escapeHtml(item.titulo)}</h3><p>${escapeHtml(item.descricao)}</p></div>`).join('');
  document.querySelector('[data-publications]').innerHTML = work.publicacoes.map((item) => `<article class="publication"><span class="pub-type">${escapeHtml(item.tipo)} · ${escapeHtml(item.ano)}</span><h3>${escapeHtml(item.titulo)}</h3><p>${escapeHtml(item.detalhes)}</p><a href="${escapeHtml(item.link)}"${linkAttrs(item.link)}>${escapeHtml(item.linkTexto)} ↗</a></article>`).join('');
  document.querySelector('[data-education]').innerHTML = profile.formacao.map((item) => `<div class="timeline-item"><span>${escapeHtml(item.periodo)}</span><div><h3>${escapeHtml(item.titulo)}</h3><p>${escapeHtml(item.detalhes)}</p></div></div>`).join('');
  document.querySelector('[data-contact-copy]').textContent = profile.contato.texto;
  document.querySelector('[data-links]').innerHTML = profile.contato.links.map((item) => `<a href="${escapeHtml(item.url)}"${linkAttrs(item.url)}>${escapeHtml(item.nome)} ↗</a>`).join('');
  document.querySelector('[data-footer-copy]').textContent = `© ${new Date().getFullYear()} ${profile.nome}`;
}

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
menuButton?.addEventListener('click', () => { const isOpen = navigation.classList.toggle('is-open'); menuButton.setAttribute('aria-expanded', String(isOpen)); menuButton.textContent = isOpen ? 'Fechar' : 'Menu'; });
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { navigation.classList.remove('is-open'); menuButton?.setAttribute('aria-expanded', 'false'); if (menuButton) menuButton.textContent = 'Menu'; }));
loadContent().catch((error) => { console.error(error); document.querySelector('main').insertAdjacentHTML('afterbegin', '<p class="content-error">Não foi possível carregar o conteúdo. Verifique se o site está sendo aberto pelo GitHub Pages ou por um servidor local.</p>'); });

