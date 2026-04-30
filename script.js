function isValidFEN(fen) {
  if (!fen || typeof fen !== 'string') return false;
  const parts = fen.trim().split(/\s+/);
  if (parts.length < 4) return false;
  if (!/^[prnbqkPRNBQK1-8\/]+$/.test(parts[0])) return false;
  return true;
}

function buildWorksheet(fens) {
  const container = document.getElementById('boardContainer');
  container.innerHTML = '';

  const title = document.getElementById('wsTitle').value || 'Chess Puzzle Worksheet';
  const contact = document.getElementById('wsContact').value || '';
  const sub = document.getElementById('wsSub') ? document.getElementById('wsSub').value : '';
  const logo = window.logoData || null;

  var pages = [];
  for (var i = 0; i < fens.length; i += 9) {
    pages.push(fens.slice(i, i + 9));
  }

  var boardsToRender = [];

  pages.forEach(function(pageFens, pageIdx) {
    var page = document.createElement('div');
    page.className = 'ws-page';

    var logoHtml = logo
      ? '<img src="' + logo + '" alt="logo">'
      : '<div class="logo-placeholder">LOGO</div>';

    var headerHtml =
      '<div class="ws-header">' +
        '<div class="ws-logo">' + logoHtml + '</div>' +
        '<div class="ws-title-block">' +
          '<h2>' + title + '</h2>' +
          (sub ? '<p>' + sub + '</p>' : '') +
        '</div>' +
        '<div class="ws-contact">' + contact + '</div>' +
      '</div>' +
      '<div class="ws-grid"></div>';

    page.innerHTML = headerHtml;
    var grid = page.querySelector('.ws-grid');

    pageFens.forEach(function(fen, idx) {
      var puzzleNum = pageIdx * 9 + idx + 1;
      var cell = document.createElement('div');
      cell.className = 'ws-cell';

      if (!isValidFEN(fen)) {
        cell.innerHTML = '<div class="error-fen">Invalid FEN #' + puzzleNum + '</div>';
        grid.appendChild(cell);
        return;
      }

      var turn = fen.trim().split(/\s+/)[1] === 'b' ? 'Black' : 'White';
      var boardId = 'board-p' + pageIdx + '-' + idx;

      cell.innerHTML =
        '<div class="ws-puzzle-num">Puzzle ' + puzzleNum + '</div>' +
        '<div id="' + boardId + '" class="ws-board"></div>' +
        '<div class="ws-turn">' + turn + ' to move</div>';

      grid.appendChild(cell);
      boardsToRender.push({ id: boardId, fen: fen });
    });

    container.appendChild(page);
  });

  setTimeout(function() {
    boardsToRender.forEach(function(item) {
      Chessboard(item.id, {
        position: item.fen,
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
        draggable: false
      });
    });
  }, 80);
}

function loadFensArray(fens) {
  var valid = fens.map(function(f) { return f.trim(); }).filter(Boolean);
  if (valid.length === 0) return;
  buildWorksheet(valid);
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('loadCustomBtn').addEventListener('click', function() {
    var raw = document.getElementById('fenInput').value.trim();
    if (!raw) { alert('Paste FENs into the text area first'); return; }
    var lines = raw.split(/\r?\n/).map(function(l) { return l.trim(); }).filter(Boolean);
    loadFensArray(lines);
  });
});