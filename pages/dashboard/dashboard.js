const COMPONENTS = [
    'pages/dashboard/dashboard.html',
    'components/card/card.html',
    'components/column/column.html',
    'components/button/button.html',
    'components/modal-field/modal-field.html',
    'components/modal/modal.html',
];

async function loadComponent(url) {
    const response = await fetch(url);
    const html = await response.text();
    document.body.insertAdjacentHTML('beforeend', html);
}

async function initDashboard() {
    await Promise.all(COMPONENTS.map(loadComponent));

    const { KanbanCard } = await import('../../components/card/card.js');
    const { KanbanColumn } = await import('../../components/column/column.js');
    const { initModal, openModal } = await import('../../components/modal/modal.js');
    const { renderButton } = await import('../../components/button/button.js');

    renderButton({
        variant: 'primary',
        label: 'Add Task',
        withIcon: true,
        id: 'add-task-btn',
        container: '#add-task-btn-container',
    });

    const toDoColumn = new KanbanColumn({ title: 'To Do', count: 2 });
    const inProgressColumn = new KanbanColumn({ title: 'In Progress', count: 2 });
    const doneColumn = new KanbanColumn({ title: 'Done', count: 2 });

    toDoColumn.render();
    inProgressColumn.render();
    doneColumn.render();

    const card1 = new KanbanCard({
        title: 'Kanban Card',
        status: 'To Do',
        description: 'This is a description of the Kanban Card',
        deadline: 'February 20, 2026',
    });
    card1.render('.kanban-column__cards:nth-of-type(1)');

    const card2 = new KanbanCard({
        title: 'Second Task',
        status: 'To Do',
        description: 'Another card in the column.',
        deadline: 'February 21, 2026',
    });
    card2.render('.kanban-column__cards:nth-of-type(1)');

    initModal({
        onSubmit: (data) => {
            const container = {
                'To Do': '.kanban-column__cards:nth-of-type(1)',
                'In Progress': '.kanban-column__cards:nth-of-type(2)',
                'Done': '.kanban-column__cards:nth-of-type(3)',
            }[data.status] || '.kanban-column__cards:nth-of-type(1)';
            const card = new KanbanCard({
                title: data.title,
                status: data.status,
                description: data.description || '',
            });
            card.render(container);
        },
    });

    document.body.addEventListener('click', (e) => {
        if (e.target.closest('#add-task-btn')) {
            e.preventDefault();
            openModal();
        }
    });
}

initDashboard();
