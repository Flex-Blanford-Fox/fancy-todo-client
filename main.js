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


function beforeLogin(){
    $("#Todos").hide()
    $("#AddTodos").hide()
    $("#Login").hide()
    $("#Logout").hide()
    $("#submitLogin").show()
    $("#submitTodo").hide()
    $("#table-todo").hide()
}

function afterLogin(){
    $("#Todos").show()
    $("#AddTodos").show()
    $("#Login").hide()
    $("#Logout").show()
    $("#submitLogin").hide()
    $("#table-todo").hide()
    $("#submitTodo").hide()
}

function addTodo(){
    $("#Todos").show()
    $("#AddTodos").show()
    $("#Login").hide()
    $("#Logout").show()
    $("#submitLogin").hide()
    $("#table-todo").hide()
    $("#submitTodo").show()

    $("#todo-title").val(``)
    $("#todo-description").val(``)
    $("#todo-duedate").val(``)
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
            alert(`Password Salah`)
        })
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
        alert(`Todo berhasil di tambahkan`)
        afterLogin()
        getTodos()
    })
    .fail(err=>{
        console.log(err.responseJSON.message);
        alert(err.responseJSON.message)
    })
}

function logout(){
    event.preventDefault()
    localStorage.removeItem(`token`)
    $(`.table-detail`).empty()
    beforeLogin()
}

function getTodos(){
    event.preventDefault()
    $(`.table-detail`).empty()
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
                </tr>
                `)
            });
            $("#table-todo").show()
        })
        .fail(err=>{
            console.log(err);
        })
}

$(document).ready(()=>{
    if (!localStorage.token) {
        beforeLogin()
    } else {
        afterLogin()
    }

    $("#submitLogin").submit(login)
    $("#submitTodo").submit(postTodo)
    $("#AddTodos").click(addTodo)
    $("#Todos").click(getTodos)
    $("#Logout").click(logout)
})