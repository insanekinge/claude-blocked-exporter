(async () => {
  const orgs = await fetch('/api/organizations').then(r => r.json());
  const orgId = Array.isArray(orgs) ? orgs[0].uuid : orgs.uuid;
  const convs = await fetch(`/api/organizations/${orgId}/chat_conversations`).then(r => r.json());
  const fullData = [];

  for (let i = 0; i < convs.length; i++) {
    console.log(`Скачиваю полную версию ${i + 1} из ${convs.length}: ${convs[i].name}`);
    const url = `/api/organizations/${orgId}/chat_conversations/${convs[i].uuid}?tree=True&rendering_mode=messages&render_all_tools=true`;
    const detail = await fetch(url).then(r => r.json());
    fullData.push(detail);
    await new Promise(r => setTimeout(r, 300));
  }

  const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'claude_full_tools.json';
  a.click();
  console.log('Готово! Скачан claude_full_tools.json');
})();
