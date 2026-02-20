const TEMPLATE_ID = 'column-template';
const DEFAULT_CONTAINER = '.app';

export class KanbanColumn {
    constructor({ title = '', count = 0 } = {}) {
        this.title = title;
        this.count = count;
    }

    render(container = DEFAULT_CONTAINER) {
        const template = document.getElementById(TEMPLATE_ID);
        if (!template?.content) {
            console.error(`[KanbanColumn] Template "${TEMPLATE_ID}" not found. Load components first.`);
            return null;
        }

        const column = template.content.cloneNode(true);
        this._populateColumn(column);

        const target = document.querySelector(container);
        if (target) target.appendChild(column);
        return column;
    }

    _populateColumn(column) {
        const titleEl = column.querySelector('.kanban-column__title');
        const countEl = column.querySelector('.kanban-column__counter-label');

        if (titleEl) titleEl.textContent = this.title;
        if (countEl) countEl.textContent = this.count;
    }
}
