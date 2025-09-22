import "./fonts/ys-display/fonts.css";
import "./style.css";

import { initPagination } from "./components/pagination.js";
import { initSearching } from "./components/searching.js";
import { initSorting } from "./components/sorting.js";
import { initTable } from "./components/table.js";
import { initData } from "./data.js";
import { data as sourceData } from "./data/dataset_1.js";
import { processFormData } from "./lib/utils.js";

// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage);
  const page = parseInt(state.page ?? 1);

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
  let state = collectState();
  let result = [...data];
  console.log("Initial data:", result.length, "items");

  // Поиск применяется ПЕРЕД фильтрацией (но фильтрации пока нет)
  result = applySearching(result, state, action);
  console.log("After searching:", result.length, "items");

  result = applySorting(result, state, action);
  console.log("After sorting:", result.length, "items");

  result = applyPagination(result, state, action);
  console.log("After pagination:", result.length, "items");
  console.log("Pagination result:", result);

  sampleTable.render(result);
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

// @todo: инициализация

const applyPagination = initPagination(
  {
    pages: sampleTable.paginationElements.pages,
    fromRow: sampleTable.paginationElements.fromRow,
    toRow: sampleTable.paginationElements.toRow,
    totalRows: sampleTable.paginationElements.totalRows,
  },
  (el, page, isCurrent) => {
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);
const applySorting = initSorting(
  [
    sampleTable.header.elements?.sortByDate,
    sampleTable.header.elements?.sortByTotal,
  ].filter(Boolean)
);
const applySearching = initSearching("search");

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

render();