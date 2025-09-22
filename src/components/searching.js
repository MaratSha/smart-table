import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // #5.1 — настраиваем компаратор для поиска
    const comparator = createComparison(
        {
            [searchField]: rules.skipEmptyTargetValues
        },
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    );

    return (data, state, action) => {
        // #5.2 — применяем компаратор для фильтрации данных
        if (!state.searchQuery || state.searchQuery.trim() === '') {
            return data;
        }

        const searchTerm = state.searchQuery.trim();
        
        return data.filter(item => {
            // Создаем тестовый объект для сравнения
            const testObject = {[searchField]: searchTerm};
            return comparator(item, testObject);
        });
    };
}