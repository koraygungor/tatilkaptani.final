 document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatHistory = document.getElementById('chat-history');

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
        messageElement.textContent = message;
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight; // Otomatik aşağı kaydır
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        addMessage('user', message);
        userInput.value = '';

        // AI'dan yanıt beklerken kullanıcı arayüzünü devre dışı bırak
        userInput.disabled = true;
        sendButton.disabled = true;

        try {
            // Buraya AI API çağrısı gelecek
            // Şimdilik bir placeholder yanıtı ekleyelim
            const aiResponse = await simulateAIResponse(message);
            addMessage('ai', aiResponse);
        } catch (error) {
            console.error('AI yanıtı alınırken hata oluştu:', error);
            addMessage('ai', 'Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        } finally {
            // AI yanıtı alındıktan sonra kullanıcı arayüzünü etkinleştir
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
        }
    }

    // AI yanıtını simüle eden geçici fonksiyon
    function simulateAIResponse(userMessage) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(`AI: '${userMessage}' hakkında ne bilmek istersiniz?`);
            }, 1500);
        });
    }
});