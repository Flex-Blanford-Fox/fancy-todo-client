// yang bisa bikin page refresh kalao kita
// 1. submit form
// 2. tag anchor. (ktika suati di click <a>)

/**
 * fungsi utama jquery
 * 1. event handler seperti click
 * 2. DOM manipualtion (hide/show), css, isi content pake .text
 * 3. AJAX. $....
 * 
 * AJAX adalah package yangbantu untuk melakukan http request.
 */

function clearAll(){
    $("#regName").val(``)
    $("#regEmail").val(``)
    $("#regPassword").val(``)
   
    $("#email").val(``)
    $("#password").val(``)

    $("#todo-title").val(``)
    $("#todo-description").val(``)
    $("#todo-duedate").val(``)
}

function registerPage(){
    $("#nav-mytodos").hide()
    $("#nav-addtodos").hide()
    $("#nav-register").show()
    $("#nav-login").show()
    $("#nav-logout").hide()

    $("#submitRegister").show()
    $("#submitLogin").hide()
    $("#submitTodo").hide()
    $("#table-todo").hide()

}

function loginPage(){
    $("#nav-mytodos").hide()
    $("#nav-addtodos").hide()
    $("#nav-register").show()
    $("#nav-login").show()
    $("#nav-logout").hide()

    $("#submitRegister").hide()
    $("#submitLogin").show()
    $("#submitTodo").hide()
    $("#table-todo").hide()
}

function afterLogin(){
    $("#nav-mytodos").show()
    $("#nav-addtodos").show()
    $("#nav-register").hide()
    $("#nav-login").hide()
    $("#nav-logout").show()

    $("#submitRegister").hide()
    $("#submitLogin").hide()
    $("#table-todo").hide()
    $("#submitTodo").hide()
}

function addTodo(){
    $("#nav-mytodos").show()
    $("#nav-addtodos").show()
    $("#nav-register").hide()
    $("#nav-login").hide()
    $("#nav-logout").show()
    
    $("#submitRegister").hide()
    $("#submitLogin").hide()
    $("#table-todo").hide()
    $("#submitTodo").show()

}

function register(event){
    event.preventDefault()
    let name = $("#regName").val()
    let email = $("#regEmail").val()
    let password = $("#regPassword").val()
    let type = "normal"
 
    let user = {name, email, type, password}

    // console.log(user);
    $.ajax({
        url: "http://localhost:3000/register", 
        method: "post",
        data: user
    })
        .done(data=>{
            loginPage()
        })
        .fail(err=>{
            alert(err.responseJSON.message)
        })
}

function login(event){
    event.preventDefault()
    let email = $("#email").val()
    let password = $("#password").val()

    let user = {email, password}

    // console.log(user);
    $.ajax({
        url: "http://localhost:3000/login", 
        method: "post",
        data: user
    })
        .done(data=>{
            localStorage.setItem(`token`, data.token)
            afterLogin()
        })
        .fail(err=>{
            alert(err.responseJSON.message)
        })
}

function logout(event){
    event.preventDefault()
    localStorage.removeItem(`token`)
    $(`.table-detail`).empty()
    registerPage()
}


function postTodo(event){
    event.preventDefault()
    let title = $("#todo-title").val()
    let description = $("#todo-description").val()
    let status = "Not Done"
    let due_date = $("#todo-duedate").val()

    let newTodo = {title, description, status, due_date}

    $.ajax({
        url: "http://localhost:3000/todos", 
        method: "post",
        headers: {
            token: localStorage.token
        },
        data: newTodo
    })
    .done(data=>{
        getTodos()
    })
    .fail(err=>{
        // console.log(err.responseJSON.message);
        alert(err.responseJSON.message)
    })
}

function deleteTodo(id){
    $.ajax({
        url: `http://localhost:3000/todos/${id}`,
        method: "delete",
        headers:{
            token: localStorage.token
        }
    })
    .done(data=>{
        getTodos()
    })
    .fail(err=>{
        // console.log(err.responseJSON.message);
        alert(err.responseJSON.message)
    })
}

function doneTodo(id, status){
    $.ajax({
        url: `http://localhost:3000/todos/${id}`,
        method: "patch",
        headers:{
            token: localStorage.token
        },
        data:{
            status: status
        }
    })
    .done(data=>{
        getTodos()
    })
    .fail(err=>{
        // console.log(err.responseJSON.message);
        alert(err.responseJSON.message)
    })
}

function editTodo(id){
    $.ajax({
        url: `http://localhost:3000/todos/${id}`, 
        method: "get",
        headers: {
            token: localStorage.getItem(`token`)
        }
    })
        .done(data=>{
            data.due_date = data.due_date.toString().slice(0,10)
            $("#todo-title").val(`${data.title}`)
            $("#todo-description").val(`${data.description}`)
            $("#todo-duedate").val(`${data.due_date}`)
            addTodo()
        })
        .fail(err=>{
            console.log(err);
        })
}


function getTodos(){
    event.preventDefault()
    $(`.table-detail`).empty()
    clearAll()
    $.ajax({
        url: "http://localhost:3000/todos", 
        method: "get",
        headers: {
            token: localStorage.getItem(`token`)
        }
    })
        .done(data=>{
            data.forEach((todo, index) => {
                // console.log(todo.title);
                todo.due_date = todo.due_date.toString().slice(0,10)
                $(`#table-todo`).append(`
                <tr class="table-detail">
                    <td>${index+1}</td>
                    <td>${todo.title}</td>
                    <td>${todo.description}</td>
                    <td>${todo.status}</td>
                    <td>${todo.due_date}</td>
                    <td> <button  onclick="doneTodo(${todo.id}, '${todo.status === "Not Done" ? 'Done' : 'Not Done'}')" type="button"> ${todo.status === "Not Done" ? "Complete" : "Uncomplete"}</button></td>
                    <td> <button onclick="editTodo(${todo.id})" type="button" >Edit</button> | <button onclick="deleteTodo(${todo.id})" type="button" >Delete</button></td>
                </tr>
                `)
            });

            $("#submitTodo").hide()
            $("#table-todo").show()
        })
        .fail(err=>{
            console.log(err);
        })
}

// 
/* <td> ${todo.status} === "Not Done" ? <button onclick="doneTodo(${todo.id})" type="button" >Complete</button> : <button onclick="undoneTodo(${todo.id})" type="button" >Un-Complete</button></td> */


$(document).ready(()=>{
    if (!localStorage.token) {
        registerPage()
    } else {
        afterLogin()
    }
    
    $("#nav-mytodos").click(getTodos)
    $("#nav-addtodos").click(addTodo)
    $("#nav-register").click(registerPage)
    $("#nav-login").click(loginPage)
    $("#nav-logout").click(logout)

    $("#submitRegister").submit(register)
    $("#submitLogin").submit(login)
    $("#submitTodo").submit(postTodo)
})