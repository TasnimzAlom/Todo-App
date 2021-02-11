class task {
    constructor(text, completed = false) {
        this.text = text;
        this.completed = completed;
        this.id = (Math.floor(Math.random()*1000000000)).toString();
    }
}
var filters = [document.querySelectorAll(".all"), document.querySelectorAll(".active"), document.querySelectorAll(".completed")];
var selected = [true, false, false];
var task_format_1 = '<div class=\"item '; 
var task_format_2 = '\" id=\"';
var task_format_3 = '\"><span class=\"check\"></span><p class=\"text\">';
var task_format_4 = '</p><span class=\"delete\"></span></div>';
var tasks = [];
if (localStorage.getItem("tasks")){
    tasks = JSON.parse(localStorage.getItem("tasks"));
    document.querySelector(".counter span").textContent = countRemaining();
    showTasks(tasks);
}
document.querySelector(".form").addEventListener("submit", (e)=>{
    e.preventDefault();
    tasks.push(new task(e.target.task.value))
    e.target.task.value = "";
    localStorage.setItem("tasks", JSON.stringify(tasks));
    filterSelection(0);
    showTasks(tasks);
});
function countRemaining(){
    let i = 0;
    tasks.forEach(task=>{
        if(!task.completed)
            i++;
    })
    return i;
}
function filterSelection(index){
    for(i=0;i<3;i++)
        selected[i] = false;
    selected[index] = true;
    document.querySelectorAll(".filter > *").forEach(element =>{
        element.classList.remove("selected");
    });
    filters[index].forEach(button => {
        button.classList.add("selected");
    });
}
function showTasks(tasks){
    var temp = [];
    if(selected[0]){
        temp = tasks;
    }
    else if(selected[1]){
        tasks.forEach(task =>{
            if(!task.completed)
                temp.push(task);
        });
    }
    else{
        tasks.forEach(task =>{
            if(task.completed)
                temp.push(task);
        });
    }
    var data = "";
    temp.forEach(task=>{
        data = data + task_format_1 + (task.completed?"completed":"") + task_format_2 + task.id + task_format_3 + task.text + task_format_4;
    }); 
    document.querySelector(".tasks").innerHTML = data;
    var check_button = document.querySelectorAll(".tasks .item .check");
    var delete_button = document.querySelectorAll(".tasks .item .delete");
    check_button.forEach(button => {
        button.addEventListener("click", ()=>{
            var id = button.parentElement.id;
            for(let num=0;num<tasks.length;num++){
                if(tasks[num].id == id){
                    if(tasks[num].completed){
                        button.parentElement.classList.remove("completed");
                    }
                    else{
                        button.parentElement.classList.add("completed");
                    }
                    tasks[num].completed = !tasks[num].completed;
                    document.querySelector(".counter span").textContent = countRemaining();
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                    break;
                }
            }
        });
    });
    delete_button.forEach(button =>{
        button.addEventListener("click", ()=>{
            let id = button.parentElement.id;
            tasks = tasks.filter(task => task.id != id);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            showTasks(tasks);
        });
    });
    document.querySelector(".counter span").textContent = countRemaining();
}
document.querySelector(".clear").addEventListener("click", ()=>{
    tasks = tasks.filter(task => !task.completed)
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks(tasks);
});
document.querySelector(".theme-switch").addEventListener("click", ()=>{
    if(document.body.classList.contains("light"))
        document.body.classList.remove("light");
    else
        document.body.classList.add("light");
});
filters.forEach((filter,index) =>{
    filter.forEach(button =>{
        button.addEventListener("click", ()=>{
            filterSelection(index);
            showTasks(tasks);
        });
    });
});