document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const appTypeSelect = document.getElementById('app-type');
    const notificationTypeSelect = document.getElementById('notification-type');
    const nameInput = document.getElementById('name');
    const amountInput = document.getElementById('amount');
    const delayInput = document.getElementById('delay');
    const createBtn = document.getElementById('create-notification');
    const previewContainer = document.getElementById('preview-container');
    const namePreview = document.querySelector('.name-preview');
    const amountPreview = document.querySelector('.amount-preview');
    
    // Configurações dos apps
    const apps = {
        nubank: {
            name: 'Nubank',
            color: '#8A05BE',
            icon: 'icons/nubank-icon.png',
            notifications: {
                'pix-recebido': {
                    title: 'Pix recebido',
                    template: 'Você recebeu um Pix de R$ {amount} de {name}.'
                },
                'transferencia': {
                    title: 'Transferência recebida',
                    template: 'Você recebeu uma transferência de R$ {amount} de {name}.'
                },
                'cashback': {
                    title: 'Cashback recebido',
                    template: 'Você recebeu R$ {amount} de cashback da sua compra.'
                }
            }
        },
        picpay: {
            name: 'PicPay',
            color: '#11C76F',
            icon: 'icons/picpay-icon.png',
            notifications: {
                'pix-recebido': {
                    title: 'Pix recebido!',
                    template: '{name} te enviou R$ {amount} via Pix.'
                },
                'transferencia': {
                    title: 'Transferência concluída',
                    template: '{name} transferiu R$ {amount} para você.'
                },
                'cashback': {
                    title: 'Cashback na conta!',
                    template: 'Você recebeu R$ {amount} de volta. Seu cashback está disponível!'
                }
            }
        },
        mercadopago: {
            name: 'Mercado Pago',
            color: '#009EE3',
            icon: 'icons/mercadopago-icon.png',
            notifications: {
                'pix-recebido': {
                    title: 'Pix recebido',
                    template: 'Você recebeu um Pix de R$ {amount} de {name}.'
                },
                'transferencia': {
                    title: 'Dinheiro recebido',
                    template: '{name} enviou R$ {amount} para você.'
                },
                'cashback': {
                    title: 'Cashback creditado',
                    template: 'Um cashback de R$ {amount} foi creditado na sua conta.'
                }
            }
        }
    };

    // Função para formatar valor em Real
    function formatCurrency(value) {
        return parseFloat(value).toFixed(2).replace('.', ',');
    }

    // Atualizar preview da notificação
    function updatePreview() {
        const selectedApp = appTypeSelect.value;
        const selectedNotificationType = notificationTypeSelect.value;
        const name = nameInput.value || 'João Silva';
        const amount = amountInput.value || '100,00';
        
        // Atualizar classes e conteúdo do preview
        previewContainer.className = `notification ${selectedApp}`;
        
        // Atualizar ícone
        const appIcon = previewContainer.querySelector('.app-icon');
        appIcon.src = apps[selectedApp].icon;
        
        // Atualizar título do app
        const appTitle = previewContainer.querySelector('.notification-app-title');
        appTitle.textContent = apps[selectedApp].name;
        
        // Atualizar título da notificação
        const notificationTitle = previewContainer.querySelector('.notification-title');
        notificationTitle.textContent = apps[selectedApp].notifications[selectedNotificationType].title;
        
        // Atualizar mensagem
        const message = apps[selectedApp].notifications[selectedNotificationType].template
            .replace('{name}', name)
            .replace('{amount}', formatCurrency(amount));
        
        const notificationMessage = previewContainer.querySelector('.notification-message');
        notificationMessage.textContent = message;
        
        // Atualizar previews
        namePreview.textContent = name;
        amountPreview.textContent = formatCurrency(amount);
    }

    // Criar e mostrar notificação
    function showNotification() {
        const selectedApp = appTypeSelect.value;
        const selectedNotificationType = notificationTypeSelect.value;
        const name = nameInput.value || 'João Silva';
        const amount = amountInput.value || '100,00';
        const delay = parseInt(delayInput.value) || 5;
        
        // Verificar suporte a notificações
        if (!("Notification" in window)) {
            alert("Este navegador não suporta notificações!");
            return;
        }

        // Configurar a notificação
        const title = apps[selectedApp].notifications[selectedNotificationType].title;
        const message = apps[selectedApp].notifications[selectedNotificationType].template
            .replace('{name}', name)
            .replace('{amount}', formatCurrency(amount));
        
        // Se permissão já foi concedida
        if (Notification.permission === "granted") {
            scheduleNotification(selectedApp, title, message, delay);
        }
        // Se permissão ainda não foi solicitada
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    scheduleNotification(selectedApp, title, message, delay);
                }
            });
        }
        // Alternativa para fallback (para dispositivos que não suportam notificações nativas)
        else {
            showToastNotification(selectedApp, title, message, delay);
        }
    }

    // Agendar notificação após o atraso
    function scheduleNotification(app, title, message, delay) {
        setTimeout(() => {
            try {
                // Tentar criar notificação nativa
                const notification = new Notification(apps[app].name + ": " + title, {
                    body: message,
                    icon: apps[app].icon,
                    badge: apps[app].icon,
                    vibrate: [200, 100, 200]
                });
            } catch (e) {
                // Fallback para notificação personalizada
                showToastNotification(app, title, message, 0);
            }
        }, delay * 1000);
        
        // Feedback para o usuário
        alert(`Notificação agendada! Aparecerá em ${delay} segundos.`);
    }

    // Notificação alternativa no formato de toast (fallback)
    function showToastNotification(app, title, message, delay) {
        setTimeout(() => {
            // Criar elemento de notificação
            const toast = document.createElement('div');
            toast.className = `notification notification-toast ${app}`;
            
            // Estrutura HTML
            toast.innerHTML = `
                <div class="notification-header">
                    <img src="${apps[app].icon}" alt="App Icon" class="app-icon">
                    <div class="notification-app-title">${apps[app].name}</div>
                    <div class="notification-time">agora</div>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
            `;
            
            // Adicionar ao DOM
            document.body.appendChild(toast);
            
            // Remover após 5 segundos
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 5000);
        }, delay * 1000);
    }

    // Event listeners
    appTypeSelect.addEventListener('change', updatePreview);
    notificationTypeSelect.addEventListener('change', updatePreview);
    nameInput.addEventListener('input', updatePreview);
    amountInput.addEventListener('input', updatePreview);
    createBtn.addEventListener('click', showNotification);

    // Inicializar preview
    updatePreview();
}); 