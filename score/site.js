(() => {
  const gameData = {
    '': ['Placeholder 1', 'Placeholder 2', 'Placeholder 3'],
    'A Feast for Odin': [
      'Ships',
      'Emigration',
      'Animals',
      'English Crown',
      'Houses',
      'Exploration',
      'Final Income',
      'Silver',
      'Occupations',
      'Negative Points',
      'VP Tokens',
      'Penalty Tokens',
    ],
    Agricola: [
      'Fields',
      'Pastures',
      'Fenced Stables',
      'Unused Spaces',
      'Grain',
      'Vegetables',
      'Sheeps',
      'Wild Boars',
      'Cattles',
      'Clay Rooms',
      'Stone Rooms',
      'Family Members',
      'Card Points',
      'Bonus Points',
      'Begging Tokens',
    ],
    Earth: [
      'Card Points',
      'Events',
      'Compost',
      'Sprouts',
      'Growths',
      'Terrain Bonus',
      'Shared Ecosystem',
      'Personal Ecosystem',
      'Fauna Bonus',
      'First to Complete',
    ],
    Evacuation: [
      'Lowest Production',
      'Goal Card 1',
      'Goal Card 2',
      'Goal Card 3',
      'Happy Face Bonus',
      'Old World Sites',
      'Old World Populations',
      'Missing Stadiums',
      'Penalty Chips',
    ],
    'Gaia Project': ['VP Track', 'Research Track Bonus', 'Final Scoring Tiles', 'Resources'],
    Keyflower: ['Tile Points', 'Autumn Tiles', 'Winter Tiles', 'Boat Tiles', 'Turn Order Tiles', 'Golds'],
    Nusfjord: ['Boats', 'Buildings', 'Unused Spaces', 'Owned Shares', 'Unissued Shares', 'Golds'],
    'Rising Sun': ['VP Track', 'Province Tokens', 'Province Set Bonus', 'Winter Upgrades'],
  };

  const tableContainer = document.getElementById('scoreTable');
  let table;
  let numPlayers = 1;

  function createElm(tag, className, attributes = {}) {
    const element = document.createElement(tag);
    element.className = className;
    Object.entries(attributes).forEach(([key, value]) => (element[key] = value));
    return element;
  }

  function createInput(type, className, value, onfocus, onblur) {
    return createElm('input', className, { type, value, onfocus, onblur });
  }

  function createScoreRow(numPlayers, categoryName = '') {
    const row = createElm('tr');
    row
      .appendChild(createElm('td'))
      .appendChild(createInput('text', 'p-2 text-start', categoryName, (e) => e.target.select()));
    for (let i = 1; i <= numPlayers; i++) {
      row
        .appendChild(createElm('td'))
        .appendChild(createInput('tel', 'p-2 text-end', '0', (e) => e.target.select(), updateTotals));
    }
    return row;
  }

  function createTotalRow(numPlayers) {
    const row = createElm('tr');
    row.appendChild(createElm('th', 'p-2 text-start')).innerText = 'Total';
    for (let i = 1; i <= numPlayers; i++) {
      row.appendChild(createElm('th', 'p-2 text-end')).innerText = '0';
    }
    return row;
  }

  function generateTable() {
    table = createElm('table', 'table');
    const headerRow = createElm('tr');
    headerRow.appendChild(createElm('th', 'p-2')).innerText = 'Category';
    for (let i = 1; i <= numPlayers; i++) {
      headerRow.appendChild(createElm('th', 'p-2 text-end')).innerText = `P${i}`;
    }
    table.appendChild(headerRow);
    table.appendChild(createTotalRow(numPlayers));
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
    loadCategories('');
  }

  function populateGameDropdown() {
    const gameSelect = document.getElementById('gameSelect');
    Object.keys(gameData).forEach((game) => {
      if (!game) return;
      const option = createElm('option');
      option.value = game;
      option.textContent = game;
      gameSelect.appendChild(option);
    });
  }

  function loadCategories(selectedGame) {
    const categories = gameData[selectedGame];
    while (table.rows.length > 2) table.deleteRow(1);
    categories.forEach((category) => table.insertBefore(createScoreRow(numPlayers, category), table.lastChild));
    updateTotals();
  }

  function updateTotals() {
    const numRows = table.rows.length;
    for (let player = 1; player <= numPlayers; player++) {
      const sum = Array.from(table.rows)
        .slice(1, -1)
        .reduce((acc, row) => {
          const input = row.cells[player].firstChild;
          const value = parseInt(input.value) || 0;
          input.value = value;
          return acc + value;
        }, 0);
      table.rows[numRows - 1].cells[player].innerText = sum;
    }
  }

  function addRow() {
    const numCategories = table.rows.length - 2;
    if (numCategories >= 20) return;
    table.insertBefore(createScoreRow(numPlayers, `Category ${numCategories + 1}`), table.lastChild);
  }

  function addColumn() {
    if (numPlayers >= 20) return;
    numPlayers++;
    table.rows[0].appendChild(createElm('th', 'p-2 text-end')).innerText = `P${numPlayers}`;
    for (let i = 1; i < table.rows.length - 1; i++) {
      table.rows[i]
        .appendChild(createElm('td'))
        .appendChild(createInput('tel', 'p-2 text-end', '0', (e) => e.target.select(), updateTotals));
    }
    table.rows[table.rows.length - 1].appendChild(createElm('th', 'total p-2 text-end')).innerText = '0';
    updateTotals();
  }

  generateTable();
  populateGameDropdown();
  document.getElementById('gameSelect').addEventListener('change', (e) => loadCategories(e.target.value));
  document.getElementById('addRowBtn').addEventListener('click', addRow);
  document.getElementById('addColumnBtn').addEventListener('click', addColumn);
})();
