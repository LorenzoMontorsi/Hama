// Script migliorato per ASP.NET: previene reload/form submit indesiderato

function gestioneSelezione() {
    const checkbox = document.getElementById('squaredThree');
    const testoCheckbox = document.querySelector('.descrizionecheckbox');
    const table = document.querySelector('table');

    function toggleAll(e) {
        // Previeni postback/submit
        if (e) { e.preventDefault(); e.stopPropagation(); }
        const cells = document.querySelectorAll('td:not(:first-child)');
        const shouldSelect = !checkbox.checked;
        cells.forEach(cell => {
            cell.classList.toggle('selected', shouldSelect);
        });
        checkbox.checked = shouldSelect;
        testoCheckbox.textContent = shouldSelect ? 'Deseleziona tutto' : 'Seleziona tutto';
    }

    function updateCheckboxState() {
        const cells = document.querySelectorAll('td:not(:first-child)');
        const tutteSelezionate = Array.from(cells).every(cell => cell.classList.contains('selected'));
        checkbox.checked = tutteSelezionate;
        testoCheckbox.textContent = tutteSelezionate ? 'Deseleziona tutto' : 'Seleziona tutto';
    }

    document.addEventListener('click', function (e) {
        const target = e.target;

        // Colonna
        if (target.tagName === 'TH' && target.parentElement.rowIndex === 0 && target.cellIndex > 0) {
            e.preventDefault();
            const colIndex = target.cellIndex;
            const rows = table.rows;
            let celleSelezionate = 0;
            let totCelle = 0;
            for (let r = 1; r < rows.length; r++) {
                const cell = rows[r].cells[colIndex];
                if (cell?.classList.contains('selected')) celleSelezionate++;
                if (cell) totCelle++;
            }
            const shouldSelect = celleSelezionate !== totCelle;
            for (let r = 1; r < rows.length; r++) {
                const cell = rows[r].cells[colIndex];
                if (cell) cell.classList.toggle('selected', shouldSelect);
            }
            updateCheckboxState();
            return;
        }

        // Riga
        if (target.tagName === 'TD' && target.cellIndex === 0 && target.parentElement.rowIndex > 0) {
            e.preventDefault();
            const row = target.parentElement;
            let celleSelezionate = 0;
            let totCelle = 0;
            for (let col = 1; col < row.cells.length; col++) {
                const cell = row.cells[col];
                if (cell?.classList.contains('selected')) celleSelezionate++;
                if (cell) totCelle++;
            }
            const shouldSelect = celleSelezionate !== totCelle;
            for (let col = 1; col < row.cells.length; col++) {
                const cell = row.cells[col];
                if (cell) cell.classList.toggle('selected', shouldSelect);
            }
            updateCheckboxState();
            return;
        }

        // Cella singola
        if (target.tagName === 'TD' && target.cellIndex > 0) {
            e.preventDefault();
            target.classList.toggle('selected');
            updateCheckboxState();
        }
    });

    // Usiamo 'click' anche per checkbox e label (non mousedown)
    checkbox.addEventListener('click', toggleAll);
    const label = document.querySelector('label[for="squaredThree"]');
    if (label) label.addEventListener('click', toggleAll);

    // Hover come prima
    if (table) {
        table.addEventListener('mouseover', function (e) {
            const target = e.target;
            if (target.tagName === 'TH' && target.parentElement.rowIndex === 0 && target.cellIndex > 0) {
                const colIndex = target.cellIndex;
                const rows = table.rows;
                for (let r = 1; r < rows.length; r++) {
                    const cell = rows[r].cells[colIndex];
                    if (cell) cell.classList.add('highlight-hover');
                }
                target.classList.add('highlight-hover');
            }
            if (target.tagName === 'TD' && target.cellIndex === 0 && target.parentElement.rowIndex > 0) {
                const row = target.parentElement;
                for (let c = 1; c < row.cells.length; c++) {
                    row.cells[c].classList.add('highlight-hover');
                }
                target.classList.add('highlight-hover');
            }
            if (target.tagName === 'TD' && target.cellIndex > 0) {
                target.classList.add('highlight-hover');
            }
        });
        table.addEventListener('mouseout', function () {
            const cells = table.querySelectorAll('.highlight-hover');
            cells.forEach(cell => cell.classList.remove('highlight-hover'));
        });
    }
}

// Funzione reset migliorata
function reset(e) {
    if (e) e.preventDefault();
    const cells = document.querySelectorAll('td:not(:first-child)');
    cells.forEach(cell => cell.classList.remove('selected'));
    const checkbox = document.getElementById('squaredThree');
    checkbox.checked = false;
    const testoCheckbox = document.querySelector('.descrizionecheckbox');
    testoCheckbox.textContent = 'Seleziona tutto';
}

// Assicurati che il bottone reset NON abbia type="submit"
const resetBtn = document.querySelector('.reset');
if (resetBtn) {
    resetBtn.addEventListener('click', reset);
    if (resetBtn.tagName === 'BUTTON' && !resetBtn.hasAttribute('type')) {
        resetBtn.setAttribute('type', 'button');
    }
}

const style = document.createElement('style');
style.textContent = `
.selected {
  background-color: var(--color-primary) !important;
}
td:not(:first-child), th:not(:first-child) {
  cursor: pointer;
}
td:first-child, th:first-child {
  cursor: pointer;
}
.highlight-hover {
  background-color: var(--color-primary) !important;
}
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', gestioneSelezione);
