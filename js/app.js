/* StockFlow – Navigation, theme and application start-up */
let cur='dashboard';

function go(v,arg){
  cur=v;const keep=document.activeElement&&document.activeElement.id==='q';
  $('#view').innerHTML=views[v](arg);
  $('#nav').innerHTML=`<h1>StockFlow</h1>`+Object.keys(views).map(k=>`<button class="${k===v?'on':''}" onclick="go('${k}')">${k[0].toUpperCase()+k.slice(1)}</button>`).join('')+`<button onclick="theme()">Toggle theme</button>`;
  if(keep){const i=$('#q');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}}}

function theme(){const r=document.documentElement,d=r.dataset.theme==='dark'?'light':'dark';r.dataset.theme=d;try{localStorage.setItem('sf_theme',d)}catch(e){}}

try{document.documentElement.dataset.theme=localStorage.getItem('sf_theme')||''}catch(e){}

go('dashboard');
