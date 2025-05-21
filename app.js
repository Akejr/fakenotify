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
    const themeColorMeta = document.getElementById('theme-color');
    
    // Verificar suporte a SVG e detectar iOS
    const supportsSvg = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    // Se iOS e o script de notificações iOS estiver disponível, inicializá-lo
    if (isIOS && window.iosNotifications) {
        window.iosNotifications.init({
            supportsSvg: supportsSvg,
            isIOS: isIOS
        });
    }
    
    // Configurações dos apps com fallback para PNG
    const apps = {
        nubank: {
            name: 'Nubank',
            color: '#8A05BE',
            icon: 'icons/icone verdadeiro.png', // Ícone verdadeiro do Nubank
            iosIcon: 'icons/icone verdadeiro.png', // Ícone verdadeiro também para iOS
            notifications: {
                'pix-recebido': {
                    title: 'Pix recebido',
                    template: 'Você recebeu um Pix de R$ {amount} de {name}.'
                },
                'transferencia': {
                    title: 'Transfêrencia recebida',
                    template: 'Você recebeu uma transferência de\nR$ {amount} de {name}.'
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
            icon: supportsSvg ? 'icons/picpay-icon.svg' : 'icons/picpay-icon.png',
            iosIcon: 'icons/ios/apple-icon-120.png', // Usar o mesmo ícone do app
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
            icon: supportsSvg ? 'icons/mercadopago-icon.svg' : 'icons/mercadopago-icon.png',
            iosIcon: 'icons/ios/apple-icon-120.png', // Usar o mesmo ícone do app
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
    
    // Ícones da app
    const appIcons = {
        default: supportsSvg ? 'icons/icon-192x192.svg' : 'icons/icon-192x192.png',
        large: supportsSvg ? 'icons/icon-512x512.svg' : 'icons/icon-512x512.png',
        ios: 'icons/ios/apple-icon-180.png'
    };

    // Função para formatar valor em Real
    function formatCurrency(value) {
        // Converter para número, adicionar separador de milhar e substituir ponto decimal por vírgula
        return parseFloat(value)
            .toFixed(2)
            .replace('.', ',')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Atualizar preview da notificação
    function updatePreview() {
        const selectedApp = appTypeSelect.value;
        const selectedNotificationType = notificationTypeSelect.value;
        const name = nameInput.value || 'João Silva';
        const amount = amountInput.value || '157,90';
        
        // Atualizar classes e conteúdo do preview
        previewContainer.className = `notification ${selectedApp}`;
        
        // Atualizar ícone - usar ícone específico do iOS se estiver no iOS
        const appIcon = previewContainer.querySelector('.app-icon');
        appIcon.src = isIOS ? apps[selectedApp].iosIcon : apps[selectedApp].icon;
        
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
        
        // Atualizar favicon dinamicamente
        updateFavicon(selectedApp);
        
        // Atualizar cor do tema
        updateThemeColor(selectedApp);
        
        // Atualizar botão para refletir a cor do app
        updateButtonColor(selectedApp);
    }
    
    // Função para atualizar o favicon dinamicamente
    function updateFavicon(appType) {
        // No iOS, não tentamos mudar o favicon
        if (isIOS) return;
        
        // Remover favicon antigo
        const oldLink = document.querySelector('link[rel="icon"]');
        if (oldLink) {
            document.head.removeChild(oldLink);
        }
        
        // Adicionar novo favicon
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = apps[appType].icon;
        link.id = 'favicon';
        
        // Especificar o tipo correto
        if (supportsSvg) {
            link.type = 'image/svg+xml';
        } else {
            link.type = 'image/png';
        }
        
        document.head.appendChild(link);
    }
    
    // Função para atualizar a cor do tema para corresponder ao app
    function updateThemeColor(appType) {
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', apps[appType].color);
        }
    }
    
    // Função para atualizar a cor do botão para corresponder ao app
    function updateButtonColor(appType) {
        createBtn.style.backgroundColor = apps[appType].color;
        
        // Ajustar a cor de hover via CSS inline
        const style = document.createElement('style');
        style.textContent = `.primary-button:hover { background-color: ${adjustBrightness(apps[appType].color, -20)}; }`;
        
        // Remover estilos antigos
        const oldStyle = document.getElementById('dynamic-button-style');
        if (oldStyle) {
            document.head.removeChild(oldStyle);
        }
        
        style.id = 'dynamic-button-style';
        document.head.appendChild(style);
    }
    
    // Função auxiliar para ajustar o brilho de uma cor (para o efeito hover)
    function adjustBrightness(hex, percent) {
        // Converte hex para RGB
        let r = parseInt(hex.substring(1, 3), 16);
        let g = parseInt(hex.substring(3, 5), 16);
        let b = parseInt(hex.substring(5, 7), 16);
        
        // Ajusta o brilho
        r = Math.max(0, Math.min(255, r + percent));
        g = Math.max(0, Math.min(255, g + percent));
        b = Math.max(0, Math.min(255, b + percent));
        
        // Converte de volta para hex
        return `#${(r.toString(16).padStart(2, '0'))}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    // Criar e mostrar notificação
    function showNotification() {
        const selectedApp = appTypeSelect.value;
        const selectedNotificationType = notificationTypeSelect.value;
        const name = nameInput.value || 'João Silva';
        const amount = amountInput.value || '157,90';
        const delay = parseInt(delayInput.value) || 5;
        
        // Configurar a notificação
        const title = apps[selectedApp].notifications[selectedNotificationType].title;
        const message = apps[selectedApp].notifications[selectedNotificationType].template
            .replace('{name}', name)
            .replace('{amount}', formatCurrency(amount));
        
        // Para iOS, usar o sistema de notificações especial para iOS
        if (isIOS && window.iosNotifications) {
            // Agenda com o delay
            setTimeout(() => {
                window.iosNotifications.showNotification(selectedApp, title, message);
            }, delay * 1000);
            
            // Feedback ao usuário
            alert(`Notificação agendada! Aparecerá em ${delay} segundos.`);
            
            // Armazenar a configuração atual em localStorage
            localStorage.setItem('lastSelectedApp', selectedApp);
            return;
        }
        
        // Para outros navegadores, verificar suporte a notificações nativas
        if (!("Notification" in window)) {
            alert("Este navegador não suporta notificações!");
            return;
        }

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
        
        // Armazenar a configuração atual em localStorage
        localStorage.setItem('lastSelectedApp', selectedApp);
    }

    // Agendar notificação após o atraso
    function scheduleNotification(app, title, message, delay) {
        setTimeout(() => {
            try {
                // Tentar criar notificação nativa com o ícone do app selecionado
                const notification = new Notification(title, {
                    body: message,
                    icon: apps[app].icon,
                    badge: apps[app].icon,
                    vibrate: [200, 100, 200],
                    data: {
                        appType: app  // Passar o tipo de app para o service worker
                    }
                });
            } catch (e) {
                console.error("Erro ao criar notificação:", e);
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
    
    // Recuperar app selecionado anteriormente
    const lastSelectedApp = localStorage.getItem('lastSelectedApp');
    if (lastSelectedApp && apps[lastSelectedApp]) {
        appTypeSelect.value = lastSelectedApp;
        updatePreview();
    }
    
    // Log para depuração
    console.log(`Suporte a SVG: ${supportsSvg ? 'Sim' : 'Não'}`);
    console.log(`Dispositivo iOS: ${isIOS ? 'Sim' : 'Não'}`);
    console.log(`Usando ícones: ${supportsSvg ? 'SVG' : 'PNG'}`);
}); 