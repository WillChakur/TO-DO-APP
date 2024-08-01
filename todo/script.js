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

const addNewTask = () => {
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

                let newTask = document.createElement('input');
                newTask.type = 'checkbox';
                newTask.id = `task-${Date.now()}`;
                newTask.name = 'task';
                newTask.value = task;

                let label = document.createElement('label');
                label.htmlFor = newTask.id;
                label.textContent = task;

                newTask.addEventListener('change', () => {
                    if (newTask.checked) {
                        label.classList.add('completed');
                    } else {
                        label.classList.remove('completed');
                    }
                });

                listItem.appendChild(newTask);
                listItem.appendChild(label);

                list.appendChild(listItem);

                form.reset();
                form.classList.remove('visible');
            }
        });
    } else {
        console.log('Form or list element not found');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    displayForm();
    addNewTask();
});

