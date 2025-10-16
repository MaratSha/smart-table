//Здесь импортируем объект sortMap
import { sortMap } from "../lib/sort.js";

// функция принимает массив columns (столбцов таблицы) и возвращает функцию, которая обрабатывает сортировку.
export function initSorting(columns) {
  return (query, state, action) => {
    let field = null;
    let order = null;
    //Обработка действия
    if (action && action.name === "sort") {
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;

      columns.forEach((column) => {
        if (column.dataset.field !== action.dataset.field) {
          column.dataset.value = "none";
        }
      });
    } else {
      columns.forEach((column) => {
        if (column.dataset.value !== "none") {
          field = column.dataset.field;
          order = column.dataset.value;
        }
      });
    }

    const sort = field && order !== "none" ? `${field}:${order}` : null;
    return sort ? Object.assign({}, query, { sort }) : query;
  };
}