const socket = io('http://127.0.0.1:3000');
const msgForm = document.getElementById('send-container')
const msginput = document.getElementById('message-input')
// const receiveCont = document.getElementById('receive-container')
const chatBody = document.getElementById('chat-body')

// Receive Message
socket.on('receive msg',data=> {
    appendMsg(data)
})

// Send Message
msgForm.addEventListener('submit',e => {
    e.preventDefault();
    const msg = msginput.value
    socket.emit('send msg',msg)
    sendMsg(msg)
    msginput.value = ''
})

function appendMsg(message){
    const receiveRow = document.createElement('div')
    receiveRow.classList.add('row')

    const receiveCol= document.createElement('div')
    receiveCol.classList.add('col-6', 'col-sm-7', 'col-md-7')

    const receiveElem = document.createElement('p')
    receiveElem.innerText = message
    receiveElem.classList.add('receive')
    
    chatBody.append(receiveRow)
    receiveRow.append(receiveCol)
    receiveCol.append(receiveElem)
    
}

function sendMsg(message){
    const sentRow = document.createElement('div')
    sentRow.classList.add('row', 'justify-content-end')

    const sentCol= document.createElement('div')
    sentCol.classList.add('col-6', 'col-sm-7', 'col-md-7')

    const sentElem = document.createElement('p')
    sentElem.innerText = message
    sentElem.classList.add('sent','float-right')
    
    chatBody.append(sentRow)
    sentRow.append(sentCol)
    sentCol.append(sentElem)
    
}