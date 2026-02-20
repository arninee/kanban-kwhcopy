const TEMPLATE_ID = 'column-template';
const DEFAULT_CONTAINER = '.app';

export class KanbanColumn {
    constructor({ title = '', count = 0 } = {}) {
        this.title = title;
        this.count = count;
        this.element = null;
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
        if (target) {
            target.appendChild(column);
            this.element = target.lastElementChild;
        }
        return this.element;
    }

    _populateColumn(column) {
        const titleEl = column.querySelector('.kanban-column__title');
        const countEl = column.querySelector('.kanban-column__counter-label');

        if (titleEl) titleEl.textContent = this.title;
        if (countEl) countEl.textContent = this.count;
    }

    getCardsContainer() {
        if (!this.element) return null;
        return this.element.querySelector('.kanban-column__cards');
    }

    getCardCount() {
        const container = this.getCardsContainer();
        return container ? container.children.length : 0;
    }

    updateCounter(count) {
        if (!this.element) return;
        const countEl = this.element.querySelector('.kanban-column__counter-label');
        if (countEl) countEl.textContent = count;
    }

    setAddTaskListener(callback) {
        if (!this.element) return;
        const header = this.element.querySelector('.kanban-column__header');
        if (header) {
            header.addEventListener('click', () => {
                callback(this.title);
            });
        }
    }

    setDropZoneListeners(onDragOver, onDragLeave, onDrop) {
        const container = this.getCardsContainer();
        if (!container) return;

        // Add drag over effect to the entire column
        const columnElement = this.element;
        const contentElement = columnElement.querySelector('.kanban-column__content');

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            // Add visual snapping feedback
            container.classList.add('is-drag-over');
            if (contentElement) {
                contentElement.classList.add('is-drag-active');
            }
            onDragOver?.(this.title);
        });

        container.addEventListener('dragleave', (e) => {
            // Only remove if leaving the container entirely
            if (e.target === container) {
                container.classList.remove('is-drag-over');
                if (contentElement) {
                    contentElement.classList.remove('is-drag-active');
                }
            }
            onDragLeave?.();
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            container.classList.remove('is-drag-over');
            if (contentElement) {
                contentElement.classList.remove('is-drag-active');
            }
            const taskId = e.dataTransfer.getData('text/plain');
            onDrop?.(this.title, taskId);
        });

        // Add drag leave for content area
        if (contentElement) {
            contentElement.addEventListener('dragleave', (e) => {
                if (e.target === contentElement) {
                    container.classList.remove('is-drag-over');
                    contentElement.classList.remove('is-drag-active');
                }
            });
        }
    }
}
