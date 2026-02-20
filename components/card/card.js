const TEMPLATE_ID = 'card-template';
const DEFAULT_CONTAINER = '.app';

export class KanbanCard {
    constructor({ title = '', status = '', description = '', deadline = '' } = {}) {
        this.title = title;
        this.status = status;
        this.description = description;
        this.deadline = deadline;
    }

    render(container = DEFAULT_CONTAINER) {
        const template = document.getElementById(TEMPLATE_ID);
        if (!template?.content) {
            console.error(`[KanbanCard] Template "${TEMPLATE_ID}" not found. Load components first.`);
            return null;
        }

        const card = template.content.cloneNode(true);
        this._populateCard(card);

        const target = document.querySelector(container);
        if (target) target.appendChild(card);
        return card;
    }

    _populateCard(card) {
        const titleEl = card.querySelector('.kanban-card__title');
        const statusEl = card.querySelector('.kanban-card__status-label');
        const descEl = card.querySelector('.kanban-card__description');
        const deadlineEl = card.querySelector('.kanban-card__deadline');

        if (titleEl) titleEl.textContent = this.title;
        if (statusEl) statusEl.textContent = this.status;
        if (descEl) descEl.textContent = this.description;
        if (deadlineEl) deadlineEl.textContent = this.deadline;
    }
}
