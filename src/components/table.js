import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */

export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // @todo: #1.2 — вывести дополнительные шаблоны до и после таблицы
  const clone_before = before
    .map((item) => {
      const row_before = cloneTemplate(item);
      return {
        id: item,
        node: row_before.container,
        elements: row_before.elements,
      };
    })
    .reverse();

  // Соберем элементы из дополнительных шаблонов
  let headerElements = {};
  let paginationElements = {};

  // Вставка перед таблицей
  clone_before.forEach(({ id, node, elements }) => {
    if (id === "header") headerElements = elements;
    root.container.prepend(node);
  });

  // После таблицы
  const clone_after = after.map((item) => {
    const row_after = cloneTemplate(item);
    if (item === "pagination") paginationElements = row_after.elements;
    return row_after.container;
  });
  root.container.append(...clone_after);

  // @todo: #1.3 —  обработать события и вызвать onAction()
  root.container.addEventListener("change", () => {
    onAction();
  });

  root.container.addEventListener("reset", () => {
    setTimeout(onAction);
  });

  root.container.addEventListener("submit", (e) => {
    e.preventDefault();
    onAction(e.submitter);
  });

  const render = (data) => {
    // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);
      Object.keys(item).forEach((key) => {
        if (row.elements[key]) {
          row.elements[key].textContent = item[key];
        }
      });
      return row.container;
    });
    root.elements.rows.replaceChildren(...nextRows);
  };

  return {
    ...root,
    render,
    header: { elements: headerElements },
    paginationElements,
  };
}