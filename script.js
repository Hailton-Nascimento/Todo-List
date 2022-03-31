const $taskInput = document.querySelector('.task-input input');
const $listTask = document.querySelector('.task-box');
const $filterSpan = document.querySelectorAll('.filters span');
const $clearAll = document.querySelector('.clear-btn');

let todos = getTaskLocalStorage();
let editID;
let isEditingTask = false;
let filter = "all";


const trocaStatus = statusTask => {
    return statusTask === "completed" ? 'pending' : 'completed'
}

const updadeStatus = selectedTask => {
    const { id } = selectedTask;
    const { statusTask } = todos[id]
    todos[id].statusTask = trocaStatus(statusTask);

    console.log(selectedTask.closest('.task'));
    updateTodos();
}

const checkedTaskValid = (key, nomeTask) => {
    return (key === 'Enter' && nomeTask.length >= 5)
};

const deleteTask = selectedTask => {
    const taskDelete = selectedTask.closest('.task');
    const { id } = taskDelete.dataset;
    todos = todos.filter((_, index) => index !== Number(id));
    updateTodos();
};
const clearAll = () => {
    console.log("apagando tudo");
    todos.splice(0, todos.length);
    console.log(todos);
    updateTodos();
}

const editeTaks = (id, nomeTask) => {
    $taskInput.value = nomeTask
    $taskInput.focus();
    editID = id;
    isEditingTask = true;
}

const handleTask = (listaTask) => {
    $listTask.innerHTML = '';
    let liTags = '';
    listaTask.forEach(({ nomeTask, statusTask }, id) => {
        const isCompleted = statusTask === 'completed' ? 'checked' : '';
        if (statusTask === filter || filter === 'all') {
            liTags += `
                    <li class="task" data-id='${id}'>
                        <label for="${id}">
                            <input type="checkbox" ${isCompleted} onclick="updadeStatus(this)" id='${id}'>
                            <p>${nomeTask}</p>
                        </label>
                        <div class="settings">
                            <i class="fa-solid fa-ellipsis"></i>
                            <ul class="task-menu">
                                <li onclick="editeTaks(${id},'${nomeTask}')"><i class="fa-solid fa-pencil"></i></i>Editar</li>
                                <li onclick="deleteTask(this)"><i class="fa-solid fa-trash-can"></i>Deletar</li>
                            </ul>
                        </div>
                    </li>
            `
        }
    });
    $listTask.innerHTML = liTags || `<li class="warning">Você não tem nenhuma tarefa aqui</li>`
}

const formatNomeTask = (string) => {
    string = string.trim();
    string = string[0].toUpperCase() + string.slice(1);
    return string;
}

const createTask = ({ key, target: { value } }) => {
    const nomeTask = formatNomeTask(value);
    const isTaskValid = checkedTaskValid(key, nomeTask);

    if (!isTaskValid) {
        return;
    }
    if (isEditingTask) {
        todos[editID].nomeTask = formatNomeTask(value);
        $taskInput.value = '';
        updateTodos();
        $taskInput.focus();
        isEditingTask = false;
        return;
    }

    const statusTask = 'pending'
    const taskInfo = { nomeTask, statusTask };
    todos.push(taskInfo);
    $taskInput.value = '';
    updateTodos();
}

function updateTodos() {
    setTaskLocalStorage();
    handleTask(todos);
}

function getTaskLocalStorage() {
    const todos = JSON.parse(localStorage.getItem('todos-lis')) || [];
    return todos;
}

function setTaskLocalStorage() {
    localStorage.setItem('todos-lis', JSON.stringify(todos));
}
const filteringTasks = ({ target: { classList, dataset } }) => {
    const isActive = classList.contains('active')
    if (isActive) {
        filter = dataset.status;
        return
    };
    document.querySelector('span.active').classList.remove('active');
    classList.toggle('active');
    filter = dataset.status;
    handleTask(todos);
}


$filterSpan.forEach($span => {
    $span.addEventListener('click', filteringTasks)
})
$taskInput.addEventListener('keyup', createTask);
console.log($clearAll);
$clearAll.addEventListener('click', clearAll)

handleTask(todos);