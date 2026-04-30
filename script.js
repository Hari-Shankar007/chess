// Basic FEN validator (checks 6 fields roughly)
function isValidFEN(fen) {
  if (!fen || typeof fen !== 'string') return false;
  const parts = fen.trim().split(/\s+/);
  if (parts.length < 4) return false;
  if (!/^[prnbqkPRNBQK1-8\/]+$/.test(parts[0])) return false;
  return true;
}

function clearBoards() {
  document.getElementById('boardContainer').innerHTML = '';
}

function renderBoard(elementId, fen) {
  Chessboard(elementId, {
    position: fen,
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
    draggable: false
  });
}

function loadFensArray(fens) {
  clearBoards();
  const container = document.getElementById('boardContainer');
  fens.forEach(function(fen, idx) {
    fen = fen.trim();
    if (!fen) return;
    if (!isValidFEN(fen)) {
      const warn = document.createElement('div');
      warn.style.color = 'red';
      warn.style.margin = '8px';
      warn.textContent = 'Invalid FEN at line ' + (idx + 1) + ': ' + fen;
      container.appendChild(warn);
      return;
    }
    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-block';
    wrapper.style.margin = '8px';
    wrapper.style.verticalAlign = 'top';

    const label = document.createElement('p');
    label.style.textAlign = 'center';
    label.style.fontWeight = '700';
    label.style.fontSize = '12px';
    label.style.margin = '4px 0';
    const turn = (fen.split(' ')[1] === 'b') ? 'Black' : 'White';
    label.textContent = 'Puzzle ' + (idx + 1) + ' — ' + turn + ' to move';

    const boardDiv = document.createElement('div');
    boardDiv.id = 'board-' + idx;
    boardDiv.className = 'board';
    boardDiv.style.width = '200px';

    wrapper.appendChild(label);
    wrapper.appendChild(boardDiv);
    container.appendChild(wrapper);

    renderBoard('board-' + idx, fen);
  });
}

// UI wiring
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('loadCategoryBtn').addEventListener('click', function() {
    const sel = document.getElementById('categoryMenu').value;
    if (!sel) { alert('Choose a category first'); return; }
    const fens = puzzles[sel] || [];
    loadFensArray(fens);
  });

  document.getElementById('loadCustomBtn').addEventListener('click', function() {
    const raw = document.getElementById('fenInput').value.trim();
    if (!raw) { alert('Paste FENs into the text area first'); return; }
    const lines = raw.split(/\r?\n/).map(function(l) { return l.trim(); }).filter(Boolean);
    loadFensArray(lines);
  });
});