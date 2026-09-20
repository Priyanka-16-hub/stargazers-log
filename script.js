const repoList = document.querySelector('#repo-list');

function renderRepository(repo) {
  const item = document.createElement('li');
  item.className = 'repo-item';

  const stars = Number(repo.stars || 0).toLocaleString();

  item.innerHTML = `
    <div class="repo-header">
      <h2 class="repo-name"><a href="${repo.url}" target="_blank" rel="noreferrer">${repo.name}</a></h2>
      <span class="repo-stars">★ ${stars}</span>
    </div>
    <p class="repo-description">${repo.description}</p>
    <div class="repo-meta">
      <span class="language-dot" aria-hidden="true"></span>
      <span>${repo.language}</span>
    </div>
  `;

  return item;
}

fetch('events.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Unable to load starred repositories.');
    }
    return response.json();
  })
  .then((repos) => {
    repoList.innerHTML = '';

    repos.forEach((repo) => {
      repoList.appendChild(renderRepository(repo));
    });
  })
  .catch((error) => {
    repoList.innerHTML = `<li class="error">${error.message}</li>`;
  });
