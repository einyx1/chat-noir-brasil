# Chat Noir Brasil

fiz essa replica em revolta por conta que o bygrilinho tirou o javascript

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

Links diretos, HLS (`.m3u8`) e DASH (`.mpd`) usam o Shaka Player local, com qualidade automática, seletor de resolução, velocidade, repetição, download, tela cheia e picture-in-picture. Links do YouTube continuam usando o player incorporado oficial.

Troque essas credenciais em `server.js` antes de publicar. Os dados são persistidos em `data.json`, criado automaticamente na primeira execução.
