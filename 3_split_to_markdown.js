(() => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = JSON.parse(await file.text());

    for (let idx = 0; idx < data.length; idx++) {
      const chat = data[idx];
      const safeName = (chat.name || `chat_${idx + 1}`).replace(/[\\/:*?"<>|]/g, '_').slice(0, 50);
      let md = `# ${chat.name || 'Без названия'}\n\n`;

      (chat.chat_messages || []).forEach(msg => {
        const role = msg.sender === 'human' ? 'Вы' : 'Claude';
        let parts = [];

        if (Array.isArray(msg.content) && msg.content.length > 0) {
          msg.content.forEach(c => {
            if (c.type === 'text' && c.text && !c.text.includes('not supported on your current device')) {
              parts.push(c.text);
            } else if (c.type === 'tool_use' && c.input) {
              const title = c.input.title || c.input.path || c.input.command || c.name || 'Инструмент';
              const body = c.input.content || c.input.code || c.input.new_str || JSON.stringify(c.input, null, 2);
              const lang = c.input.language || '';
              parts.push(`**[Действие: ${title}]**\n\`\`\`${lang}\n${body}\n\`\`\``);
            }
          });
        }

        let fallback = (msg.text || '')
          .replace(/```\s*This block is not supported on your current device yet\.\s*```/g, '')
          .trim();

        const finalBody = parts.length > 0 ? parts.join('\n\n') : fallback;
        if (finalBody) {
          md += `### ${role}:\n${finalBody}\n\n---\n\n`;
        }
      });

      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${idx + 1}_${safeName}.md`;
      a.click();
      await new Promise(r => setTimeout(r, 250));
    }

    console.log('Все отдельные файлы успешно сохранены!');
  };
  input.click();
})();
