const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, 'public');
const DATA = path.join(ROOT, 'data.json');
const sessions = new Map();

function seed() {
  return {
    settings: { name: 'Chat Noir Brasil', tagline: 'Site criado por fãs para fãs', accent: '#16f214', premiere: '2026-11-20T20:00:00-03:00', footer: 'Site criado por fãs para fãs, com o objetivo de reunir informações sobre a série de TV Miraculous: As Aventuras de Ladybug e Chat Noir.' },
    seasons: [
      { id: 0, name: 'Especiais', image: 'https://i.ibb.co/KjhYjLXx/CHRYSALIS.webp' },
      { id: 1, name: '1ª Temporada', image: '/images/VESPERIA.webp' },
      { id: 2, name: '2ª Temporada', image: '/images/CARAPACE.webp' },
      { id: 3, name: '3ª Temporada', image: 'https://i.ibb.co/vvksnyJ7/RENA-ROUGE.webp' },
      { id: 4, name: '4ª Temporada', image: 'https://i.ibb.co/qMGyg8pd/ARGOS.webp' },
      { id: 5, name: '5ª Temporada', image: 'https://i.ibb.co/WNgJxGQN/LADYBUG.webp' },
      { id: 6, name: '6ª Temporada', image: 'https://i.ibb.co/tMBY226B/CAT-NOIR.webp' },
      { id: 7, name: '7ª Temporada', image: 'https://i.ibb.co/XkkFTByK/s6.webp' }
    ],
    episodes: [
      { id: 1, seasonId: 6, number: 1, title: 'Rainha Tormenta', description: 'Adrien teme não ter uma paixão. Marinette tenta ajudá-lo, sem notar que alguém quer usar a popularidade dele para realizar seus próprios desejos.', language: 'pt-BR', date: '2025-05-09', poster: '/images/601.webp', sources: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'] },
      { id: 2, seasonId: 6, number: 2, title: 'A Desenhista', description: 'Ladybug e sua equipe enfrentam uma vilã cheia de imaginação.', language: 'pt-BR', date: '2025-05-16', poster: 'https://i.ibb.co/tMBY226B/CAT-NOIR.webp', sources: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'] },
      { id: 3, seasonId: 6, number: 3, title: 'Sublimação', description: 'Marinette tenta fazer uma nova amizade e descobre que nem todos precisam ser salvos.', language: 'pt-BR', date: '2025-05-23', poster: 'https://i.ibb.co/WNgJxGQN/LADYBUG.webp', sources: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'] },
      { id: 4, seasonId: 0, number: 3, title: 'Miraculous World: Paris - As Aventuras de Shadybug e Claw Noir', description: 'Shadybug e Claw Noir chegam de uma realidade paralela.', language: 'pt-BR', date: '2023-10-21', poster: '/images/pr.jpg', sources: ['https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'] }
    ],
    news: [
      { id: 1, title: 'Novo catálogo disponível', body: 'A sexta temporada já pode ser encontrada no catálogo.', date: '2026-09-21' },
      { id: 2, title: 'Estreia em breve', body: 'Acompanhe a contagem regressiva na página inicial.', date: '2026-09-18' }
    ],
    team: [{ id: 1, name: 'Tae', role: 'Fundador e editor' }, { id: 2, name: 'Equipe Miraculous Hub', role: 'Curadoria e comunidade' }]
  };
}
function readDB() { if (!fs.existsSync(DATA)) fs.writeFileSync(DATA, JSON.stringify(seed(), null, 2)); return JSON.parse(fs.readFileSync(DATA, 'utf8')); }
function writeDB(db) { fs.writeFileSync(DATA, JSON.stringify(db, null, 2)); }
function json(res, status, data) { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); res.end(JSON.stringify(data)); }
function body(req) { return new Promise((resolve,reject)=>{ let s=''; req.on('data',c=>{s+=c;if(s.length>1e6)req.destroy();}); req.on('end',()=>{try{resolve(s?JSON.parse(s):{});}catch(e){reject(e);}}); }); }
function auth(req) { const h=req.headers.authorization||''; return sessions.has(h.replace('Bearer ','')); }
function mime(p) { return ({'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'})[path.extname(p)]||'application/octet-stream'; }

async function api(req,res,u) {
  const db=readDB();
  if(req.method==='GET' && u.pathname==='/api/data') return json(res,200,db);
  if(req.method==='POST' && u.pathname==='/api/login') { const b=await body(req); if(b.username==='admin'&&b.password==='admin123'){const t=crypto.randomUUID();sessions.set(t,Date.now());return json(res,200,{token:t});} return json(res,401,{error:'Credenciais inválidas'}); }
  if(req.method==='GET' && u.pathname==='/api/session') return json(res,auth(req)?200:401,{ok:auth(req)});
  if(!auth(req)) return json(res,401,{error:'Não autorizado'});
  const m=u.pathname.match(/^\/api\/(seasons|episodes|news|team)(?:\/(\d+))?$/);
  if(m) {
    const key=m[1], id=Number(m[2]), b=req.method==='GET'?{}:await body(req);
    if(req.method==='POST'){b.id=Math.max(0,...db[key].map(x=>x.id))+1;db[key].push(b);writeDB(db);return json(res,201,b);}
    if(req.method==='PUT'&&id){const i=db[key].findIndex(x=>x.id===id);if(i<0)return json(res,404,{error:'Não encontrado'});db[key][i]={...db[key][i],...b,id};writeDB(db);return json(res,200,db[key][i]);}
    if(req.method==='DELETE'&&id){db[key]=db[key].filter(x=>x.id!==id);writeDB(db);return json(res,200,{ok:true});}
  }
  if(req.method==='PUT'&&u.pathname==='/api/settings'){db.settings={...db.settings,...await body(req)};writeDB(db);return json(res,200,db.settings);}
  return json(res,404,{error:'Rota não encontrada'});
}

const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');if(u.pathname.startsWith('/api/'))return await api(req,res,u);let file=path.join(PUBLIC,u.pathname==='/'?'index.html':u.pathname);if(!path.extname(file))file=path.join(PUBLIC,'index.html');if(!file.startsWith(PUBLIC)||!fs.existsSync(file))file=path.join(PUBLIC,'index.html');res.writeHead(200,{'Content-Type':mime(file)});fs.createReadStream(file).pipe(res);}catch(e){json(res,500,{error:e.message});}});
server.listen(PORT,()=>console.log(`Miraculous Hub: http://localhost:${PORT}`));
