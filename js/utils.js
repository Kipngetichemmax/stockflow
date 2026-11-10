/* StockFlow – Shared helpers, formatting and UI utilities */
const $=s=>document.querySelector(s);

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const fmt=n=>'KSh '+Number(n).toLocaleString('en-KE');

const day=d=>new Date(d).toLocaleDateString('en-CA');

const pad=(p,arr)=>p+'-'+String(arr.reduce((m,x)=>Math.max(m,parseInt(x.id.split('-')[1])||0),0)+1).padStart(3,'0');

function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(t.h);t.h=setTimeout(()=>t.style.display='none',2800)}

const status=p=>p.quantity<=0?'out':p.quantity<=p.minStock?'low':'in';

const tag=p=>{const s=status(p);return `<span class="tag ${s}">${{in:'In stock',low:'Low stock',out:'Out of stock'}[s]}</span>`};

function openDlg(h){$('#dlg').innerHTML=h;$('#dlg').showModal()}

const closeDlg=()=>$('#dlg').close();

function download(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}

const views={};
