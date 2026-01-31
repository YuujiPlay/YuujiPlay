// === Botão de copiar PIX ===
document.addEventListener('DOMContentLoaded', () => {
  // Email obfuscado (invertido)
  const obfuscatedEmail = 'moc.liamg@9209ijuuyayustat'.split('').reverse().join('');
  // Insere o email no elemento
  const pixEmailElement = document.getElementById('pixEmail');
  if (pixEmailElement) {
    pixEmailElement.textContent = obfuscatedEmail;
  }
  // Botão de copiar PIX (copia da variável, não do DOM)
  const copyPixBtn = document.getElementById('copyPixBtn');
  if (copyPixBtn) {
    copyPixBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(obfuscatedEmail).then(() => {
        const msg = document.createElement('div');
        msg.className = 'pix-copied-msg';
        msg.textContent = 'Chave PIX copiada!';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
      }).catch(err => console.error('Erro ao copiar:', err));
    });
  }
});
// === Função para abrir modal com conteúdo da seção central ===
function openModalForSection(button, contentId) {
  const content = document.getElementById(contentId);
  if (!content) return;
  // Clona o conteúdo da seção
  const clone = content.cloneNode(true);
  clone.classList.add('open');
  clone.style.padding = '5px'; // Organiza com padding consistente
  clone.style.display = 'flex'; // Garante flex para grids internas
  clone.style.flexDirection = 'column';
  clone.style.gap = '15px';
  // Limpa e popula o body do modal
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = '';
  // Cria header fixo com título e busca
  const header = document.createElement('div');
  header.className = 'modal-header';
  const title = document.createElement('h2');
  title.textContent = button.closest('.section-header').querySelector('h2').textContent;
  header.appendChild(title);
  // Adiciona barra de pesquisa
  const searchWrap = document.createElement('div');
  searchWrap.className = 'modal-search-wrap';
  const searchInputModal = document.createElement('input');
  searchInputModal.type = 'text';
  searchInputModal.placeholder = 'Pesquisar nesta seção...';
  searchInputModal.id = 'modalSearchSection';
  searchWrap.appendChild(searchInputModal);
  const clearBtn = document.createElement('button');
  clearBtn.textContent = '✖';
  clearBtn.title = 'Limpar busca';
  searchWrap.appendChild(clearBtn);
  header.appendChild(searchWrap);
  modalBody.appendChild(header);
  // Adiciona o clone do conteúdo
  modalBody.appendChild(clone);
  // Mostra o overlay/modal
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('open'), 10);
  document.body.classList.add('modal-open');
  // Atualiza ARIA
  button.setAttribute('aria-expanded', 'true');
  // Evento para filtro na busca do modal da seção
  searchInputModal.addEventListener('input', () => {
    const query = normalizeText(searchInputModal.value.trim());
    const items = clone.querySelectorAll('.game-item, .texture-item, .project-item');
    items.forEach(item => {
      const title = normalizeText(item.dataset.title || item.textContent);
      item.style.display = title.includes(query) ? '' : 'none';
    });
  });
  // Limpar busca
  clearBtn.addEventListener('click', () => {
    searchInputModal.value = '';
    const items = clone.querySelectorAll('.game-item, .texture-item, .project-item');
    items.forEach(item => item.style.display = '');
  });
  // Adiciona event listeners aos botões de lançamento no clone
  clone.querySelectorAll('.game-item .launch-btn').forEach(button => {
    button.addEventListener('click', () => {
      const gameCard = button.previousElementSibling;
      if (gameCard && gameCard.tagName === 'A') {
        window.open(gameCard.href, '_blank', 'noopener,noreferrer');
      }
    });
  });
  // Equaliza larguras para modals específicos
  const sectionId = button.closest('.section').id;
  if (['texturas', 'adicional', 'template', 'temas', 'projetos'].includes(sectionId)) {
    equalizeCardWidths(clone, sectionId);
  }
}
// Função para igualar larguras dos cards
function equalizeCardWidths(clone, sectionId) {
  let cardSelector;
  switch(sectionId) {
    case 'texturas':
    case 'adicional':
    case 'template':
    case 'temas':
      cardSelector = '.texture-item';
      break;
    case 'projetos':
      cardSelector = '.project-item';
      break;
    default:
      return;
  }
  const cards = clone.querySelectorAll(cardSelector);
  if (cards.length === 0) return;
  let maxWidth = 0;
  // Resetar larguras para calcular natural
  cards.forEach(card => {
    card.style.width = 'auto';
    const width = card.offsetWidth;
    if (width > maxWidth) maxWidth = width;
  });
  // Aplicar max width
  cards.forEach(card => {
    card.style.width = `${maxWidth}px`;
  });
}
// === Função para abrir modal com conteúdo da lista ===
function openModalForList(button, listId) {
  const list = document.getElementById(listId);
  if (!list) return;
  // Clona o conteúdo da lista
  const clone = list.cloneNode(true);
  clone.classList.add('open');
  clone.style.display = 'grid';
  clone.style.gap = '15px';
  clone.style.padding = '15px';
  // Limpa e popula o body do modal
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = '';
  // Cria header fixo com título e busca
  const header = document.createElement('div');
  header.className = 'modal-header';
  const title = document.createElement('h2');
  title.textContent = button.textContent;
  header.appendChild(title);
  // Adiciona barra de pesquisa
  const searchWrap = document.createElement('div');
  searchWrap.className = 'modal-search-wrap';
  const searchInputModal = document.createElement('input');
  searchInputModal.type = 'text';
  searchInputModal.placeholder = 'Pesquisar nesta seção...';
  searchInputModal.id = 'modalSearchList';
  searchWrap.appendChild(searchInputModal);
  const clearBtn = document.createElement('button');
  clearBtn.textContent = '✖';
  clearBtn.title = 'Limpar busca';
  searchWrap.appendChild(clearBtn);
  header.appendChild(searchWrap);
  modalBody.appendChild(header);
  // Adiciona o clone da lista
  modalBody.appendChild(clone);
  // Adiciona a classe .members-modal ao .modal-content apenas para o modal de membros ou decks
  const modalContent = document.querySelector('.modal-content');
  if (listId === 'membersList' || listId === 'decksList') {
    modalContent.classList.add('members-modal');
  }
  // Mostra o overlay/modal
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('open'), 10);
  document.body.classList.add('modal-open');
  // Atualiza ARIA
  button.setAttribute('aria-expanded', 'true');
  // Evento para filtro na busca do modal da lista
  searchInputModal.addEventListener('input', () => {
    const query = normalizeText(searchInputModal.value.trim());
    const items = clone.querySelectorAll('.member-item, .banlist-item');
    items.forEach(item => {
      const textContent = normalizeText(item.textContent);
      item.style.display = textContent.includes(query) ? 'flex' : 'none';
    });
  });
  // Filtro específico para modal MEMBROS ou DECKS
  if (listId === 'membersList') {
    searchInputModal.addEventListener('input', () => {
      const query = normalizeText(searchInputModal.value.trim());
      const cards = clone.querySelectorAll('.profile-card');
      cards.forEach(card => {
        const nome = normalizeText(card.querySelector('.player-name')?.textContent || '');
        const guilda = normalizeText(card.querySelector('.info-cards .info-card:nth-child(1) .info-value')?.textContent || '');
        const comunidade = normalizeText(card.querySelector('.info-cards .info-card:nth-child(2) .info-value')?.textContent || '');
        const status = normalizeText(card.querySelector('.info-cards .info-card:nth-child(3) .info-value')?.textContent || '');
        const rank = normalizeText(card.querySelector('.rank-badge')?.textContent || '');
        const isMale = card.classList.contains('male');
        const isFemale = card.classList.contains('female');
        const classMatch = (isMale && (query.includes('male') || query.includes('player-name male') || query.includes('info-value male'))) ||
                           (isFemale && (query.includes('female') || query.includes('player-name female') || query.includes('info-value female')));
        card.style.display = (nome.includes(query) || guilda.includes(query) || comunidade.includes(query) || status.includes(query) || rank.includes(query) || classMatch) ? 'block' : 'none';
      });
    });
  } else if (listId === 'decksList') {
    searchInputModal.addEventListener('input', () => {
      const query = normalizeText(searchInputModal.value.trim());
      const cards = clone.querySelectorAll('.profile-card');
      cards.forEach(card => {
        const nome = normalizeText(card.querySelector('.stat-number')?.textContent || '');
        const archetype = normalizeText(card.querySelector('.archetype-card')?.textContent || '');
        const deckTag = normalizeText(card.querySelector('.deck-tag')?.textContent || '');
        const isMale = card.classList.contains('male');
        const isFemale = card.classList.contains('female');
        const classMatch = (isMale && (query.includes('stat-number male') || query.includes('archetype-card male'))) ||
                           (isFemale && (query.includes('stat-number female') || query.includes('archetype-card female')));
        card.style.display = (nome.includes(query) || archetype.includes(query) || deckTag.includes(query) || classMatch) ? 'block' : 'none';
      });
    });
  }
  // Limpar busca
  clearBtn.addEventListener('click', () => {
    searchInputModal.value = '';
    const items = clone.querySelectorAll('.member-item');
    items.forEach(item => item.style.display = 'flex');
  });
  if (listId === 'membersList' || listId === 'decksList') {
    const clonedContainer = clone.querySelector('#profileContainer');
    if (clonedContainer) {
      clonedContainer.id = 'clonedProfileContainer'; // rename to avoid duplicate
      sortProfilesByScore(clonedContainer);
      observeScoreChanges(clonedContainer);
    }
  }
}
// === Função para fechar o modal ===
function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('open');
  setTimeout(() => {
    overlay.classList.add('hidden');
    document.getElementById('modalBody').innerHTML = '';
    // Remove a classe .members-modal do .modal-content
    const modalContent = document.querySelector('.modal-content');
    modalContent.classList.remove('members-modal');
  }, 300);
  document.body.classList.remove('modal-open');
  // Reseta ARIA para todos os botões da sidebar direita e central
  document.querySelectorAll('.sidebar.sidebar-direita .launch-btn, .main-sections .toggle-btn').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
  });
}
// === Inicialização dos eventos de clique para seções centrais (agora abrindo modals) ===
document.querySelectorAll('.toggle-btn').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    openModalForSection(button, targetId);
  });
});
// === Event listeners para botões da sidebar ESQUERDA (expansão local) ===
document.querySelectorAll('.sidebar:not(.sidebar-direita) .launch-btn').forEach(button => {
  button.addEventListener('click', () => {
    const list = button.nextElementSibling;
    if (list && (list.classList.contains('members-list') || list.classList.contains('paginas-list'))) {
      list.classList.toggle('open');
      button.classList.toggle('active');
      button.setAttribute('aria-expanded', list.classList.contains('open'));
    }
  });
});
// === Event listeners para botões da sidebar DIREITA (modals) ===
document.querySelectorAll('.sidebar.sidebar-direita .launch-btn').forEach(button => {
  button.addEventListener('click', () => {
    const list = button.nextElementSibling;
    if (list && (list.classList.contains('members-list') || list.classList.contains('paginas-list') || list.classList.contains('decks-list'))) {
      openModalForList(button, list.id);
    }
  });
});
// === Event listeners para botões dos cards ===
document.querySelectorAll('.game-item .launch-btn').forEach(button => {
  button.addEventListener('click', () => {
    const gameCard = button.previousElementSibling;
    if (gameCard && gameCard.tagName === 'A') {
      window.open(gameCard.href, '_blank', 'noopener,noreferrer');
    }
  });
});
// === Event listeners para fechar o modal ===
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target.id === 'modalOverlay') {
    closeModal();
  }
});
// Fecha com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !document.getElementById('modalOverlay').classList.contains('hidden')) {
    closeModal();
  }
});
// === Inicialização de seções e listas ===
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.section-content').forEach(content => {
    content.classList.remove('open');
    const button = content.previousElementSibling.querySelector('.toggle-btn');
    if (button) {
      button.textContent = 'ABRIR';
    }
  });
  document.querySelectorAll('.sidebar:not(.sidebar-direita) .members-list, .sidebar:not(.sidebar-direita) .paginas-list').forEach(list => {
    list.classList.remove('open');
    const button = list.previousElementSibling;
    if (button) {
      button.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    }
  });
  document.querySelectorAll('.sidebar.sidebar-direita .members-list, .sidebar.sidebar-direita .paginas-list, .sidebar.sidebar-direita .decks-list').forEach(list => {
    list.classList.remove('open');
    const button = list.previousElementSibling;
    if (button) {
      button.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    }
  });
  document.querySelectorAll('.sidebar.right-sidebar2 .members-list, .sidebar.right-sidebar2 .paginas-list').forEach(list => {
    list.classList.remove('open');
    const button = list.previousElementSibling;
    if (button) {
      button.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    }
  });
});
// Scripts para os novos cards de membros
function syncScoreButtons(container) {
  container.querySelectorAll('.profile-card').forEach(card => {
      const score = card.dataset.score;
      const button = card.querySelector('.cta-button[data-auto-sync="true"]');
      if (button && score) {
          button.textContent = parseInt(score).toLocaleString();
      }
  });
}
function sortProfilesByScore(container) {
  const cards = Array.from(container.querySelectorAll('.profile-card'));
  cards.sort((a, b) => {
      const scoreA = parseInt(a.dataset.score) || 0;
      const scoreB = parseInt(b.dataset.score) || 0;
      return scoreB - scoreA;
  });
  container.innerHTML = '';
  cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.2}s`;
      container.appendChild(card);
      setTimeout(() => {
          card.classList.add('sorted');
      }, 100);
  });
  syncScoreButtons(container);
}
function observeScoreChanges(container) {
  const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      mutations.forEach(mutation => {
          if (mutation.type === 'attributes' &&
              mutation.attributeName === 'data-score') {
              needsUpdate = true;
          }
      });
      if (needsUpdate) {
          syncScoreButtons(container);
          setTimeout(() => sortProfilesByScore(container), 100);
      }
  });
  container.querySelectorAll('.profile-card').forEach(card => {
      observer.observe(card, {
          attributes: true,
          attributeFilter: ['data-score']
      });
  });
}
function updateScore(playerName, newScore) {
  const cards = document.querySelectorAll(`[data-name="${playerName}"]`);
  cards.forEach(card => {
      card.dataset.score = newScore;
      console.log(`✅ ${playerName}: Pontuação atualizada para ${newScore.toLocaleString()}`);
  });
}
// Expõe funções globalmente
window.updateScore = updateScore;
window.sortProfilesByScore = sortProfilesByScore;
// === Inicialização do menu hambúrguer ===
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenuBtn = document.querySelector('.close-menu-btn');
hamburgerBtn.addEventListener('click', () => {
  mobileMenu.classList.add('open');
});
closeMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
});
// === Inicialização do botão back to top ===
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
  if (mobileMenu.classList.contains('open')) {
    backToTopBtn.classList.remove('visible');
  }
});
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
// === Manipulação de decks ===
function toggleDetails(btn) {
  const content = btn.nextElementSibling;
  content.classList.toggle('open');
}
function toggleDeck(btn) {
  const content = btn.nextElementSibling;
  content.classList.toggle('open');
}
function toggleFullDeck(header) {
  const card = header.parentElement;
  card.classList.toggle('open');
  const content = header.nextElementSibling;
  content.classList.toggle('open');
}