# Chat Noir Brasil

Réplica autorizada do portal CNBR com catálogo, player, busca, favoritos, progresso e painel administrativo. Usa apenas Node.js, sem dependências externas.

## Executar

```powershell
npm start
```

Abra `http://localhost:4173`.

Painel: `http://localhost:4173/admin`

- Usuário: `admin`
- Senha: `admin123`

## Vídeos do YouTube

Ao criar ou editar um episódio, cole no campo de fontes um link do YouTube (`youtube.com`, `youtu.be`, Shorts ou Live) ou uma URL direta de vídeo. Use uma linha por fonte; cada linha aparece como uma opção no player.

Troque essas credenciais em `server.js` antes de publicar. Os dados são persistidos em `data.json`, criado automaticamente na primeira execução.
