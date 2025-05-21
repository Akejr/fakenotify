const CACHE_NAME = 'notifications-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/nubank-icon.png',
  '/icons/picpay-icon.png',
  '/icons/mercadopago-icon.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Configurações dos apps
const apps = {
  nubank: {
    name: 'Nubank',
    color: '#8A05BE',
    icon: 'icons/nubank-icon.png'
  },
  picpay: {
    name: 'PicPay',
    color: '#11C76F',
    icon: 'icons/picpay-icon.png'
  },
  mercadopago: {
    name: 'Mercado Pago',
    color: '#009EE3',
    icon: 'icons/mercadopago-icon.png'
  }
};

// Instalação e cache de recursos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Estratégia de cache: Cache primeiro, depois rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - retorna resposta do cache
        if (response) {
          return response;
        }

        // Clone a solicitação
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Verificar se é uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone a resposta
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Atualização: remover caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Função auxiliar para obter o ícone do app selecionado ou o ícone padrão
function getAppIcon(appType) {
  if (appType && apps[appType]) {
    return apps[appType].icon;
  }
  return 'icons/icon-192x192.png'; // Ícone padrão
}

// Gerenciamento de notificações push
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    
    // Tentar obter o último app selecionado do localStorage ou usar o padrão
    let appIcon = data.icon || 'icons/icon-192x192.png';
    let appName = data.appName || '';
    
    // Se um appType foi fornecido, usar suas configurações
    if (data.appType && apps[data.appType]) {
      appIcon = apps[data.appType].icon;
      appName = apps[data.appType].name + ': ';
    }
    
    const options = {
      body: data.message,
      icon: appIcon,
      badge: appIcon,
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/',
        appType: data.appType
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(appName + data.title, options)
    );
  }
});

// Ação de clique na notificação
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // Redirecionar para a URL específica ou para a home
  const url = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.openWindow(url)
  );
}); 