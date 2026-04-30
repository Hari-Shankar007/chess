function loadCategory(category) {
  const container = document.getElementById('boardContainer');
  container.innerHTML = '';

  let fens = [];

  if (category === 'custom') {
    const fenInput = document.getElementById('fenInput').value.trim();
    if (fenInput) {
      fens = fenInput.split(/\s*\n\s*/).filter(f => f.length > 0);
    }
  } else {
    fens = puzzles[category] || [];
  }

  if (fens.length === 0) return;

  fens.forEach(function(fen, index) {
    const wrapper = document.createElement('div');
    wrapper.className = 'board-wrapper';

    const label = document.createElement('p');
    label.className = 'board-label';
    label.textContent = 'Puzzle ' + (index + 1) + ' — ' + (fen.split(' ')[1] === 'w' ? 'White' : 'Black') + ' to move';

    const boardDiv = document.createElement('div');
    boardDiv.id = 'board-' + index;
    boardDiv.className = 'board';

    wrapper.appendChild(label);
    wrapper.appendChild(boardDiv);
    container.appendChild(wrapper);

    Chessboard('board-' + index, {
      position: fen,
      pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    });
  });
}