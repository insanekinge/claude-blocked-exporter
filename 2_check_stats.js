(() => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = JSON.parse(await file.text());
    console.table(data.map(c => ({
      Название: c.name,
      Создан: new Date(c.created_at).toLocaleString('ru-RU'),
      Обновлен: new Date(c.updated_at).toLocaleString('ru-RU'),
      Сообщений: (c.chat_messages || []).length
    })));
  };
  input.click();
})();
