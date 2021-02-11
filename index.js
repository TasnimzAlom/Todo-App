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
var tasks = [
    new task("Complete online JavaScript course", true),
    new task("Jog around the park 3x"),
    new task("10 minutes meditation"),
    new task("Read for 1 hour"),
    new task("Pick up groceries"),
    new task("Complete ToDo App on Frontend Mentor"),
];
showTasks();
if (localStorage.getItem("tasks")){
    tasks = JSON.parse(localStorage.getItem("tasks"));
    document.querySelector(".counter").textContent = countRemaining();
    showTasks();
}
function countRemaining(){
    let i = 0;
    if(tasks.length > 0){
        tasks.forEach(task=>{
            if(!task.completed)
                i++;
        })
    }
    if(i>1)
        return i+" items left";
    return i+" item left";
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
function showTasks(){
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
    if(temp.length>0){
        temp.forEach(task=>{
            data = data + task_format_1 + (task.completed?"completed":"") + task_format_2 + task.id + task_format_3 + task.text + task_format_4;
        }); 
    }
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
                    document.querySelector(".counter").textContent = countRemaining();
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
            showTasks();
            document.querySelector(".counter").textContent = countRemaining();
        });
    });
    document.querySelector(".counter").textContent = countRemaining();
}
document.querySelector(".form").addEventListener("submit", (e)=>{
    e.preventDefault();
    tasks.push(new task(e.target.task.value))
    e.target.task.value = "";
    localStorage.setItem("tasks", JSON.stringify(tasks));
    filterSelection(0);
    showTasks();
});
document.querySelector(".clear").addEventListener("click", ()=>{
    tasks = tasks.filter(task => !task.completed)
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showTasks();
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
            showTasks();
        });
    });
});