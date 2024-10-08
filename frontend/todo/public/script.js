const getTasks = async () => {
    try {
        const response = await fetch('/tasks/getTasks', {
            method: 'GET'
        });

        if(!response.ok) {
            throw new Error('Network response was not ok: ', response.statusText);
        }

        const data = await response.json();

        return data.data;

    } catch (err) {
        console.error('Fetch error:', err);
        alert(`Failed to fetch tasks: ${err.message}`);
        return [];
    }
}

const displayTasks = async () => {
    try {
        const tasks = await getTasks();

        if(tasks) {

            let list = document.getElementById('to-do__list');

            tasks.forEach(task => {
                let listItem = document.createElement('div');
                    listItem.classList.add('checkbox-wrapper-11');
                    listItem.classList.add('task-item');

                    let newTask = document.createElement('input');
                    newTask.type = 'checkbox';
                    newTask.id = task.taskid;
                    newTask.name = 'task';
                    newTask.value = task.taskname;

                    let label = document.createElement('label');
                    label.htmlFor = newTask.id;
                    label.textContent = task.taskname;

                    listItem.appendChild(newTask);
                    listItem.appendChild(label);

                    list.appendChild(listItem);

                    if(task.done === true) {
                        listItem.classList.add('task-done');
                        newTask.checked = true;
                    }

                    listItem.addEventListener('click', async(e) => {
                        if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
                            listItem.classList.toggle('task-done');
                            try {
                                await fetch(`/tasks/${newTask.id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ done: e.target.checked })
                                });
                            } catch (err) {
                                console.error('Error updating task status:', err);
                            }
                        }
                    });
            })
        }

    } catch(err) {
        console.error('Error while displaying tasks:', err);
        alert('Failed to display tasks. Please try again later.');
    }
}

const addTask = async () => {
    let form = document.getElementById('new-task-form');
    let list = document.getElementById('to-do__list');

    if (form && list) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            let formData = new FormData(form);
            let task = formData.get('newtask');

            if (task) {

                const randomId =  getRandomPostgresInteger();
                try {
                    await fetch('/tasks', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ taskname: task,
                                            taskid: randomId
                        })
                    }).then(res => res.json())


                    const listItem = document.createElement('div');
                    listItem.classList.add('checkbox-wrapper-11');
                    listItem.classList.add('task-item');

                    const newTask = document.createElement('input');
                    newTask.type = 'checkbox';
                    newTask.id = randomId;
                    newTask.name = 'task';
                    newTask.value = task;

                    const label = document.createElement('label');
                    label.htmlFor = newTask.id;
                    label.textContent = task;

                    listItem.appendChild(newTask);
                    listItem.appendChild(label);

                    list.appendChild(listItem);

                    form.reset();
                    form.classList.remove('visible');

                    listItem.addEventListener('click', async(e) => {
                        if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
                            listItem.classList.toggle('task-done');
                            try {
                                await fetch(`/tasks/${newTask.id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ done: e.target.checked })
                                });
                            } catch (err) {
                                console.error('Error updating task status:', err);
                            }
                        }
                    });
                }catch (error) {
                    console.error('Error adding task: ', error);
                }
            }
        });
    } else {
        console.log('Form or list element not found');
    }
};

const deleteTask = () => {
    let removeButton = document.getElementById('remove-button');

    if(removeButton) {
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

            if(delButton) {
                delButton.addEventListener('click', async () => {
                    let doneTasks = document.querySelectorAll('.task-done');
                    
                    if(doneTasks.length > 0) {

                        for (const task of doneTasks) {
                            try {
                                const response = await fetch(`/tasks/delTasks/${task.firstChild.id}`, {
                                    method: 'DELETE'
                                });
                                
                                if(!response.ok) {
                                    throw new Error('Error deleting the task on database ', response.statusText);
                                }
                            }catch (err) {
                                console.error(err);
                            }
                            task.remove();

                        }
                    }
                })
            }else {
                console.error('delButton not found');
            }
        })
    } else {
        console.error('removeButton not found');
    }
}

function getRandomPostgresInteger() {
    const min = 0;
    const max = 2147483647;
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener('DOMContentLoaded', () => {
    addTask();
    deleteTask();
    getTasks();
    displayTasks();
});

