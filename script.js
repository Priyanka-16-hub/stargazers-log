const repoList = document.querySelector('#repo-list');
const statusRegion = document.querySelector('#status');

function setStatus(message, isError = false) {
  if (!statusRegion) {
    return;
  }

  statusRegion.textContent = message;
  statusRegion.setAttribute('aria-live', isError ? 'assertive' : 'polite');
}

function safeText(value, fallback) {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmedValue = value.trim();
  return trimmedValue || fallback;
}

function isSafeUrl(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return false;
  }

  try {
    const parsedUrl = new URL(trimmedValue);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

function createTextNode(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  element.textContent = text;
  return element;
}

function renderRepository(repo = {}) {
  const item = document.createElement('li');
  item.className = 'repo-item';

  const name = safeText(repo.name, 'Untitled repository');
  const description = safeText(repo.description, 'No description provided.');
  const language = safeText(repo.language, 'Unknown language');
  const stars = Number.isFinite(Number(repo.stars)) ? Number(repo.stars) : 0;
  const url = isSafeUrl(repo.url) ? repo.url : '#';

  const header = document.createElement('div');
  header.className = 'repo-header';

  const nameBlock = document.createElement('h2');
  nameBlock.className = 'repo-name';

  const nameLink = document.createElement('a');
  nameLink.href = url;
  nameLink.textContent = name;
  nameLink.target = '_blank';
  nameLink.rel = 'noreferrer';
  nameLink.setAttribute('aria-label', `${name} repository`);

  nameBlock.appendChild(nameLink);

  const starCount = createTextNode('span', 'repo-stars', `★ ${stars.toLocaleString()}`);

  header.appendChild(nameBlock);
  header.appendChild(starCount);

  const descriptionNode = createTextNode('p', 'repo-description', description);

  const meta = document.createElement('div');
  meta.className = 'repo-meta';

  const languageDot = document.createElement('span');
  languageDot.className = 'language-dot';
  languageDot.setAttribute('aria-hidden', 'true');

  const languageNode = createTextNode('span', '', language);

  meta.appendChild(languageDot);
  meta.appendChild(languageNode);

  item.appendChild(header);
  item.appendChild(descriptionNode);
  item.appendChild(meta);

  return item;
}

function renderEmptyState(message) {
  const item = document.createElement('li');
  item.className = 'empty-state';
  item.textContent = message;
  repoList.appendChild(item);
}

function renderError(message) {
  const item = document.createElement('li');
  item.className = 'error';
  item.textContent = message;
  repoList.appendChild(item);
}

setStatus('Loading starred repositories...');

fetch('events.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Unable to load starred repositories.');
    }

    return response.json();
  })
  .then((repos) => {
    repoList.innerHTML = '';

    if (!Array.isArray(repos) || repos.length === 0) {
      renderEmptyState('No starred repositories found.');
      setStatus('No starred repositories found.');
      return;
    }

    repos.forEach((repo) => {
      repoList.appendChild(renderRepository(repo));
    });

    setStatus(`${repos.length} starred repositories loaded.`);
  })
  .catch((error) => {
    repoList.innerHTML = '';
    const message = error?.message || 'Unable to load starred repositories.';
    renderError(message);
    setStatus(message, true);
  });
