const socket = io();
let username = '';
let userList = [];

let loginPage = document.querySelector('#loginPage')
let chatPage = document.querySelector('#chatPage')

let loginInput = document.querySelector('#loginNameInput')
let textInput = document.querySelector('#chatTextInput')

loginPage.style.display = 'flex';
chatPage.style.display = 'none'

loginInput.addEventListener('keyup', (event)=>{
    if(event.keyCode === 13){
        let name = loginInput.value.trim();
        if (name != ''){
            username = name;
            document.title = `Chat (${username})`
            socket.emit('entrada-tentativa', username)
        }
    }
})

textInput.addEventListener('keyup', (event)=>{
    if(event.keyCode === 13){
        let mensagem = textInput.value.trim();
        if (mensagem == '') return
        AddStatus('send-message',username,mensagem)
        socket.emit('user-send-message',{
            user:username,
            msg:mensagem
        })
    }
})


function ShowuserList() {
    let ul = document.querySelector('.userList')
    const newLi = document.createElement('li')
    userList.forEach( i =>{
        newLi.innerText = i
        ul.append(newLi)
    })
}

function AddStatus (type,username,msg){
    const ul = document.querySelector('.chatList')
    const newLi = document.createElement('li')

    switch(type){
        case 'msg': {
            newLi.innerText = msg
            newLi.classList.add('m-status')
            ul.append(newLi)
        }
        break
        case 'joined': {

            //utilizando innerHTML pois o servidor já passou o validator no username
            newLi.innerHTML += `<li class="m-status">${username} se conectou no chat</li>`
            ul.append(newLi)
        }
        break
        case 'left': {
            newLi.innerHTML += `<li class="m-status">${username} saiu do chat</li>`
            ul.append(newLi)
            
        }
        break
        case 'send-message': {
            const spantext = document.createElement('span')
            spantext.innerText = `${username} (Eu): `
            spantext.classList.add('me')
            newLi.append(spantext)
            newLi.append(msg)
            newLi.classList.add('m-txt')
            ul.append(newLi)

        }
        break
        case 'message-received': {
            const spantext = document.createElement('span')
            spantext.innerText = `${username}: `
            newLi.append(spantext)
            newLi.append(msg)
            newLi.classList.add('m-txt')
            ul.append(newLi)
        }
        break
    }
    ul.scrollTop = ul.scrollHeight

}


socket.on('conectados',(users_list)=>{
    loginPage.style.display = 'none';
    chatPage.style.display = 'flex'
    textInput.focus()
    userList = users_list
    AddStatus('msg',null,'Conectado!')
    ShowuserList()

})

socket.on('users-updated', (data)=>{
    userList = data.list;
    if (data.joined){
        AddStatus('joined',data.joined,null)
    }

    if (data.left){
        AddStatus('left',data.left,null)
    }

    ShowuserList()
})

socket.on('message-receive',(data)=>{
    if (data.user){
        AddStatus('message-received',data.user,data.msg)
    }
})