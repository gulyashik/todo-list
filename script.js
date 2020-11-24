let url = " https://todo-hapi-postgres.herokuapp.com/";
window.onload = function () {
    fetch(url).then(function(response){
        if(response.ok){
            response.json().then((data)=>{
                data.forEach((element)=>{
                    var new_task = element.title;
                    newTask(new_task,element);
                })
            })
        }
    })
}
function addTask(e){
    var new_task = document.getElementById("addToDo").value;
    let task_Json = {
        title : new_task
    };
    fetch(url, {
        method: "Post",
        body:  JSON.stringify(task_Json)
    }).then((response)=>{
        if(response.ok){
            response.json().then((element)=> {
                newTask(new_task,element);
            })
        }else {
            alert("Network error, couldn't add task.")
        }
    })
    return false;
}

function deleteTask(e) {
    var li = e.parentNode;
    let id = li.getAttribute("id")
    li.remove();
    fetch(url+id,{
        method:'DELETE'
    }).then((response)=>{
        if (response.ok){
            alert("success!")
        }
    })
}
function doneTask(event) {
    let id = event.parentNode.getAttribute("id");
    if(!event.checked){
        fetch(url + id,{
            method: 'PATCH',
            body: JSON.stringify({
                completed: false
            })
        }).then((response)=>{
            if (response.ok){
                alert("completed: false");
            }else{
                console.log(response);
            }
        });
    }else {
        fetch(url + id, {
            method: 'PATCH',
            body: JSON.stringify({
                completed: true
            })
        }).then((response) => {
            if (response.ok) {
                alert("completed: true");
            } else {
                console.log(response);
            }
        });
    }
}
function clearAllTasks() {
    var ul = document.getElementsByClassName("all-tasks");
    let ulArray = Array.from( ul[0].children);
    let num = 0;
    ulArray.forEach((element)=> {
        let id = element.getAttribute("id");
        fetch(url + id, {
            method: "DELETE"
        }).then((response) => {
            if (response.ok) {
                num++;
            }
        }).then(() => {
            if (num == ulArray.length) {
                alert("success delete all elements");
                ul[0].replaceChildren();
            }
        });
    })
}
function saveAllTasks() {
    var ul = document.getElementsByClassName("all-tasks");
    var new_ul = document.getElementsByClassName("all-saved-tasks");
    let li = ul[0].cloneNode(true).getElementsByTagName("label");
    var array =  Array.prototype.slice.call(li);
    array.forEach((li)=>{
        li.getElementsByTagName("i")[0].remove();
        new_ul[0].append(li);
    });
    ul[0].replaceChildren();
}
function openTips() {
    var tips = document.getElementsByClassName("tips")[0];
    tips.classList.toggle("is-open")
}
function newTask(new_task,element){
    var ul = document.getElementsByClassName("all-tasks");
    var li = document.createElement("label");
    li.className = 'task';
    li.appendChild(document.createElement('input'));
    li.appendChild( document.createElement('span'));
    li.appendChild(document.createTextNode(new_task + " "));
    li.appendChild( document.createElement('i'));
    var icon = li.getElementsByTagName('i');
    let check = li.getElementsByTagName('input');
    let span = li.getElementsByTagName('span');
    check[0].setAttribute("type","checkbox");
    check[0].setAttribute("class","task-checkbox");
    check[0].setAttribute("onclick", "doneTask(this)");
    icon[0].setAttribute("class","fas fa-trash-alt");
    icon[0].setAttribute("onclick","deleteTask(this)");
    span[0].setAttribute("class","checkmark");
    li.setAttribute("id", element.id);
    if (element.completed){
        check[0].checked = true;
    }
    ul[0].append(li);
}