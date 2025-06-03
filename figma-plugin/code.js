// Основная логика плагина Figma для чата с Claude AI

// Показываем UI плагина
figma.showUI(__html__, { 
  width: 400, 
  height: 600,
  title: "Claude AI Chat"
});

// Обработка сообщений от UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'api-response') {
    // Получаем ответ от API через UI и обрабатываем его
    if (msg.success) {
      // Отправляем успешный ответ обратно в UI для отображения
      figma.ui.postMessage({
        type: 'message-response',
        success: true,
        reply: msg.reply
      });
    } else {
      // Отправляем ошибку в UI
      figma.ui.postMessage({
        type: 'message-response',
        success: false,
        error: msg.error || 'Произошла ошибка при обработке запроса.'
      });
    }
  }

  if (msg.type === 'insert-text') {
    // Создаем текстовый узел с ответом Claude
    const textNode = figma.createText();
    
    // Загружаем шрифт по умолчанию
    await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
    
    textNode.characters = msg.text;
    textNode.fontSize = 16;
    textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    
    // Позиционируем текст в центре экрана
    textNode.x = figma.viewport.center.x;
    textNode.y = figma.viewport.center.y;
    
    // Добавляем в текущую страницу
    figma.currentPage.appendChild(textNode);
    
    // Выделяем созданный текст
    figma.currentPage.selection = [textNode];
    figma.viewport.scrollAndZoomIntoView([textNode]);
    
    figma.ui.postMessage({
      type: 'text-inserted',
      success: true
    });
  }

  if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }
};

// Уведомляем UI о готовности плагина
figma.ui.postMessage({
  type: 'plugin-ready'
});