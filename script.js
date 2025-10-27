document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addTaskButton = document.getElementById("add-task-btn");
  const todoList = document.getElementById("todo-list");

  let tasks = [];
  if (localStorage.length != 0) {
    //check if previous tasks were entered and load them
    extractedTasks = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      extractedTasks.push(JSON.parse(value));
    }
    tasks = extractedTasks;
    tasks.sort((a, b) => a.id - b.id); // sorting order based on id whihc is based on date
    console.log(extractedTasks);
  }

  tasks.forEach((task) => {
    //loop and pull data based on data in localstorage and update html
    renderTask(task);
  });

  addTaskButton.addEventListener("click", () => {
    const taskText = todoInput.value.trim(); //remove trailing spaces on string
    if (taskText === "") return; //if string empty do nothing

    const newTask = {
      id: Date.now(), //use date as unique id
      text: taskText,
      completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    todoInput.value = ""; //clear input
    renderTask(newTask);
    //console.log(tasks);
  });

  function renderTask(task) {
    //display all stored tasks previously entered by adjusting html for list item
    //console.log(task);
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    if (task.completed) li.classList.add("completed");
    li.innerHTML = `<span>${task.text}</span>
    <button>Delete</button>`;
    todoList.appendChild(li);

    li.addEventListener("click", (e) => {
      // event bubbline etc, the e parameter needed here since we want to be more granulary to define action based on how or where the button was click not just that it was clicked
      if (e.target.tagName === "BUTTON") return;
      task.completed = !task.completed;
      li.classList.toggle("completed");
      saveTasks();
    });

    li.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation(); //prevent parents elements from recivign event, i.e. prevent clicking delete from triggering strikethrough
      tasks.filter((t) => t.id !== task.id); // take out deleted element from array

      // for (let i = 0; i < localStorage.length; i++) {
      //   const key = localStorage.key(i);
      //   const value = localStorage.getItem(key);
      //   extractedTasks.filter((e_t) => e_t.id != task_id);
      // }

      li.remove(); //remove li element when its corresponding delete is pressed
      saveTasks();
    }); //querySelector acts like getelement
  }

  function saveTasks() {
    //generate a taskid key for each tasks
    localStorage.setItem(
      "tasks" + String(tasks.length - 1),
      JSON.stringify(tasks[tasks.length - 1]) //the objects has to be converted to a string since the value side of the localstorage only accepts strings
    );
  }
});
