
class Chatbox {
    constructor() {
        this.args = {
            openButton: document.getElementById('chatbox-toggle'),
            chatBox: document.querySelector('.chatbox'),
            sendButton: document.querySelector('.send__button'),
            inputField: document.getElementById('chatbox-input'),
            messagesContainer: document.querySelector('.chatbox__messages'),
            chatboxButton: document.querySelector('.chatbox__button'),
            closeButton: document.querySelector('.chatbox__close--button'),
            helpText: document.querySelector('.chatbox__button--text')
        };

        this.state = false;
        this.messages = [];
    }

    display() {
        this.setupEventListeners();
        this.setupDocumentClickListener();
    }

    setupEventListeners() {
        const { openButton, chatBox, sendButton, inputField, chatboxButton, closeButton, helpText } = this.args;

        openButton.addEventListener('click', (event) => {
            event.stopPropagation();
            chatBox.classList.toggle('show');

            if (this.messages.length === 0) this.greetUser();

            this.toggleState(chatBox);
            if (this.state) {
                chatboxButton.classList.add('no-animation');
                helpText.style.opacity = 0;
                helpText.style.pointerEvents = 'none';
            } else {
                chatboxButton.classList.remove('no-animation');
                helpText.style.opacity = 1;
                helpText.style.pointerEvents = 'auto';
            }
        });

        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.onSendButton(chatBox);
            }
        });

        document.addEventListener('click', function (event) {
            if (!chatBox.contains(event.target) && !openButton.contains(event.target)) {
                chatBox.classList.remove('show');
                chatboxButton.classList.remove('no-animation');
                helpText.style.opacity = 1;
                helpText.style.pointerEvents = 'auto';
            }
        });

        closeButton.addEventListener('click', () => {
            chatBox.classList.remove('show');
            this.toggleState(chatBox);
            chatboxButton.classList.remove('no-animation');
            helpText.style.opacity = 1;
            helpText.style.pointerEvents = 'auto';
        });
    }

    setupDocumentClickListener() {
        document.addEventListener('click', (event) => {
            const { chatBox, chatboxButton } = this.args;
            if (!chatBox.contains(event.target) && !chatboxButton.contains(event.target)) {
                chatBox.classList.remove('chatbox--active');
                chatboxButton.classList.remove('no-animation');
                this.state = false;
            }
        });
    }

    greetUser() {
        const { messagesContainer } = this.args;

        setTimeout(() => {
            let msg = 'Hi. Welcome to Prince Solution. How can I help you?';
            const replyElement = document.createElement('div');
            replyElement.classList.add('chatbot_response', 'message--visitor');
            replyElement.innerHTML = `<div class="message__bubble">${msg}</div>`;

            messagesContainer.appendChild(replyElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            this.messages.push(msg);
        }, 1000);
    }

    toggleState(chatBox) {
        this.state = !this.state;

        // show or hides the box
        if (this.state) {
            chatBox.classList.add('chatbox--active', 'show');
        } else {
            chatBox.classList.remove('chatbox--active', 'show');
        }
    }





    onSendButton(chatBox) {
        const { inputField, messagesContainer } = this.args;
        const messageText = inputField.value.trim();
        if (messageText === "") {
            return;
        }
        this.messages.push(messageText)

        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'message--operator');
        messageElement.innerHTML = `<div class="message__bubble">${messageText}</div>`;
        messagesContainer.appendChild(messageElement);
        inputField.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Simulating sending message to backend and getting a response
        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: messageText }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(r => r.json())
            .then(r => {
                const replyElement = document.createElement('div');
                replyElement.classList.add('chatbot_response', 'message--visitor');
                replyElement.innerHTML = `<div class="message__bubble" >${'hello this is'}</div>`;
                messagesContainer.appendChild(replyElement);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }).catch((error) => {
                const replyElement = document.createElement('div');
                replyElement.classList.add('chatbot_response', 'message--visitor');
                replyElement.innerHTML = `<div class="message__bubble" >${error.message}</div>`;
                messagesContainer.appendChild(replyElement);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;


                // console.error('Error:', error);
                // window.alert(error.message)
            });
    }
}

const chatbox = new Chatbox();
chatbox.display();
