const displayForm = () => {
    let addBtn = document.getElementById('add-button');
    let form = document.getElementById('to-do__form');
    let formcloseBtn = document.getElementById('form-close');


    if(addBtn && form && formcloseBtn) {
        addBtn.addEventListener('click', () => {
            form.classList.add('visible');
        });

        formcloseBtn.addEventListener('click', () => {
            form.classList.remove('visible')
        });

    } else {
        console.log('Element not found');
    }
};

const addTask = () => {
    let form = document.getElementById('new-task-form');
    let list = document.getElementById('to-do__list');

    if (form && list) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let formData = new FormData(form);
            let task = formData.get('newtask');

            if (task) {
                let listItem = document.createElement('div');
                listItem.classList.add('checkbox-wrapper-11');
                listItem.classList.add('task-item');

                let newTask = document.createElement('input');
                newTask.type = 'checkbox';
                newTask.id = `task-${Date.now()}`;
                newTask.name = 'task';
                newTask.value = task;

                let label = document.createElement('label');
                label.htmlFor = newTask.id;
                label.textContent = task;

                listItem.appendChild(newTask);
                listItem.appendChild(label);

                list.appendChild(listItem);

                form.reset();
                form.classList.remove('visible');

                listItem.addEventListener('click', (e) => {
                    if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
                        listItem.classList.toggle('task-done');
                    }
                });
            }
        });
    } else {
        console.log('Form or list element not found');
    }
};

const deleteTask = () => {
    let removeButton = document.getElementById('remove-button');

    removeButton.addEventListener('click', (e) => {
        e.preventDefault();

        removeButton.classList.add('not-visible');

        let buttons = document.querySelectorAll('.btn-rm');

        if(buttons.length > 0) {
            buttons.forEach(button => {
                button.classList.add('visible');
                button.addEventListener('click', () => {
                    removeButton.classList.remove('not-visible');
                    buttons.forEach(btn => {
                        btn.classList.remove('visible');
                    })
                })
            })
        }

        let delButton = document.getElementById('remove-button-del')

        delButton.addEventListener('click', () => {
            let doneTasks = document.querySelectorAll('.task-done');
            
            if(doneTasks.length > 0) {
                doneTasks.forEach(task => {
                    task.remove();
                })
            }
        })
    })
}

document.addEventListener('DOMContentLoaded', () => {
    displayForm();
    addTask();
    deleteTask();
});

