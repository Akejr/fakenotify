/**
 * iOS Notifications Helper
 * 
 * Este script fornece funcionalidades específicas para lidar com notificações no iOS,
 * que não suporta completamente a API de Notificações da Web.
 */

class IOSNotifications {
    constructor() {
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        this.appConfig = null;
        this.lastApp = localStorage.getItem('lastSelectedApp') || 'nubank';
    }

    /**
     * Inicializa o handler de notificações iOS
     * @param {Object} appConfig Configuração da aplicação
     */
    init(appConfig) {
        if (!this.isIOS) return; // Só executa no iOS
        
        this.appConfig = appConfig;
        
        // Configurar listener para o botão de compartilhamento
        this.setupShareTip();
    }
    
    /**
     * Mostra uma dica de instalação para iOS
     */
    setupShareTip() {
        // Verifica se o usuário já está usando a versão instalada
        if (window.navigator.standalone) {
            console.log('App já está instalado no iOS');
            return;
        }
        
        // Verifica se já mostrou a dica antes
        if (localStorage.getItem('iosShareTipShown')) {
            return;
        }
        
        // Criar elemento de dica
        const tipContainer = document.createElement('div');
        tipContainer.className = 'ios-share-tip';
        tipContainer.innerHTML = `
            <div class="tip-content">
                <p>Para instalar este app no seu iPhone:</p>
                <p>1. Toque em <span class="share-icon">⎙</span> <strong>Compartilhar</strong></p>
                <p>2. Escolha <strong>"Adicionar à Tela de Início"</strong></p>
                <button class="close-tip">Entendi</button>
            </div>
        `;
        
        // Estilizar o container
        Object.assign(tipContainer.style, {
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            right: '10px',
            backgroundColor: '#8A05BE',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            zIndex: '1000',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        });
        
        // Estilizar o botão
        const closeButton = tipContainer.querySelector('.close-tip');
        Object.assign(closeButton.style, {
            backgroundColor: 'white',
            color: '#8A05BE',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '5px',
            marginTop: '10px',
            fontWeight: 'bold',
            cursor: 'pointer'
        });
        
        // Adicionar ao body
        document.body.appendChild(tipContainer);
        
        // Configurar evento de fechamento
        closeButton.addEventListener('click', () => {
            document.body.removeChild(tipContainer);
            localStorage.setItem('iosShareTipShown', 'true');
        });
    }
    
    /**
     * Cria uma notificação estilo iOS
     * @param {string} app App selecionado (nubank, picpay, etc)
     * @param {string} title Título da notificação
     * @param {string} message Mensagem da notificação
     */
    showNotification(app, title, message) {
        if (!this.isIOS) return; // Só executa no iOS
        
        // Se o app não estiver instalado, mostrar alerta normal
        if (!window.navigator.standalone) {
            // iOS limita o uso de alert() em algumas situações, então vamos criar uma notificação visual
            this.showVisualNotification(app, title, message);
            return;
        }
        
        // Dentro do app instalado, criar uma notificação personalizada
        const notification = document.createElement('div');
        notification.className = 'ios-notification';
        
        // Determinar a cor do app
        let appColor = '#8A05BE'; // Nubank default
        let appName = 'Nubank';
        let iconPath = app === 'nubank' ? 'icons/icone verdadeiro.png' : 'icons/ios/apple-icon-120.png';
        
        switch(app) {
            case 'picpay':
                appColor = '#11C76F';
                appName = 'PicPay';
                break;
            case 'mercadopago':
                appColor = '#009EE3';
                appName = 'Mercado Pago';
                break;
        }
        
        // Estrutura da notificação
        notification.innerHTML = `
            <div class="notification-container" style="width: 90%; max-width: 400px; background-color: rgba(250, 250, 250, 0.95); border-radius: 14px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); margin: 0 auto; overflow: hidden;">
                <div class="notification-header" style="display: flex; align-items: center; padding: 10px 12px;">
                    <img src="${iconPath}" style="width: 20px; height: 20px; border-radius: 5px; margin-right: 6px;" />
                    <span style="font-weight: bold; font-size: 14px;">${appName}</span>
                    <span style="margin-left: auto; color: #888; font-size: 12px;">agora</span>
                </div>
                <div class="notification-content" style="padding: 0 12px 12px 12px;">
                    <div style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">${title}</div>
                    <div style="font-size: 14px; color: #333;">${message}</div>
                </div>
            </div>
        `;
        
        // Estilização principal da notificação
        Object.assign(notification.style, {
            position: 'fixed',
            top: '10px',
            left: '0',
            right: '0',
            zIndex: '9999',
            padding: '10px',
            animation: 'slideInDown 0.3s forwards'
        });
        
        // Adicionar estilo para animação
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInDown {
                from { transform: translateY(-100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideOutUp {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(-100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Adicionar ao body
        document.body.appendChild(notification);
        
        // Remover após 5 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutUp 0.3s forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    /**
     * Cria uma notificação visual para iOS quando não instalado
     */
    showVisualNotification(app, title, message) {
        const toast = document.createElement('div');
        toast.className = `notification notification-toast ${app}`;
        
        // Determinar o ícone
        let iconPath = app === 'nubank' ? 'icons/icone verdadeiro.png' : 'icons/ios/apple-icon-120.png';
        let appName = app.charAt(0).toUpperCase() + app.slice(1);
        
        // Estrutura HTML
        toast.innerHTML = `
            <div class="notification-header">
                <img src="${iconPath}" alt="App Icon" class="app-icon">
                <div class="notification-app-title">${appName}</div>
                <div class="notification-time">agora</div>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        // Estilização
        Object.assign(toast.style, {
            position: 'fixed',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '9999',
            width: '90%',
            maxWidth: '400px',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            animation: 'slideInDownIOS 0.3s forwards'
        });
        
        // Adicionar estilo para a animação
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInDownIOS {
                from { transform: translate(-50%, -100%); opacity: 0; }
                to { transform: translate(-50%, 0); opacity: 1; }
            }
            @keyframes slideOutUpIOS {
                from { transform: translate(-50%, 0); opacity: 1; }
                to { transform: translate(-50%, -100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Adicionar ao DOM
        document.body.appendChild(toast);
        
        // Remover após 5 segundos
        setTimeout(() => {
            toast.style.animation = 'slideOutUpIOS 0.3s forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }
}

// Exportar para uso global
window.iosNotifications = new IOSNotifications(); 