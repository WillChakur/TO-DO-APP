const getTasks = async () => {
    try {
        const response = await fetch('http://localhost:3000/tasks/getTasks', {
            method: 'GET'
        });

        if(!response.ok) {
            throw new Error('Network response was not ok', response.statusText);
        }

        const data = await response.json();
        
        console.log(data.data);

        return data.data;

    } catch (err) {
        console.error('Fetch error ', err);
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

                    listItem.addEventListener('click', (e) => {
                        if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
                            listItem.classList.toggle('task-done');
                        }
                    });
            })
        }

    } catch(err) {
        console.error('Erro while displaying the tasks', err);
    }
}

const addTask = async () => {
    let form = document.getElementById('new-task-form');
    let list = document.getElementById('to-do__list');

    if (form && list) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let formData = new FormData(form);
            let task = formData.get('newtask');

            if (task) {

                let randomId =  getRandomPostgresInteger();
                
                fetch('http://localhost:3000/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ taskname: task,
                                           taskid: randomId//Valor aleatorio
                     })
                }).then(res => res.json())


                let listItem = document.createElement('div');
                listItem.classList.add('checkbox-wrapper-11');
                listItem.classList.add('task-item');

                let newTask = document.createElement('input');
                newTask.type = 'checkbox';
                newTask.id = randomId;
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

        delButton.addEventListener('click', async () => {
            let doneTasks = document.querySelectorAll('.task-done');
            
            if(doneTasks.length > 0) {

                for (const task of doneTasks) {
                    try {
                        const response = await fetch(`http://localhost:3000/tasks/delTasks/${task.firstChild.id}`, {
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
    })
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

