/* StockFlow – Inventory view, stock adjustments and movement records */
views.inventory=function(){
  return `<h2>Inventory</h2><div class="card wrap"><table><tr><th>Product</th><th>Stock</th><th>Min</th><th>Status</th><th></th></tr>
  ${db.products.map(p=>`<tr><td>${esc(p.name)}</td><td>${p.quantity}</td><td>${p.minStock}</td><td>${tag(p)}</td><td><button class="b sm" onclick="adjustForm('${p.id}')">Adjust stock</button></td></tr>`).join('')}</table></div>
  <div class="card wrap"><h3>Stock movements</h3>${db.moves.length?`<table><tr><th>Date</th><th>Product</th><th>Type</th><th>Change</th><th>Balance</th></tr>${db.moves.slice(0,40).map(m=>`<tr><td>${new Date(m.date).toLocaleString()}</td><td>${esc(m.name)}</td><td>${esc(m.type)}</td><td class="${m.qty<0?'bad':'ok'}">${m.qty>0?'+':''}${m.qty}</td><td>${m.after}</td></tr>`).join('')}</table>`:'<p class="mute">No movements yet.</p>'}</div>`};

function move(p,type,qty){p.quantity+=qty;db.moves.unshift({date:new Date().toISOString(),productId:p.id,name:p.name,type,qty,after:p.quantity})}

function adjustForm(id){
  const p=db.products.find(x=>x.id===id);
  openDlg(`<h3>Adjust stock: ${esc(p.name)}</h3><p class="mute">Current stock: ${p.quantity}</p><form onsubmit="adjust(event,'${id}')">
  <label>Reason<select name="type"><option>Purchase/restock</option><option>Customer return</option><option>Damaged goods</option><option>Manual adjustment</option></select></label>
  <label>Quantity (use a negative number only for manual adjustment)<input name="qty" type="number" step="1" required></label>
  <div class="bar"><button class="b">Save adjustment</button><button type="button" class="b alt" onclick="closeDlg()">Cancel</button></div></form>`)}

function adjust(e,id){
  e.preventDefault();const f=Object.fromEntries(new FormData(e.target)),p=db.products.find(x=>x.id===id);let q=Math.trunc(+f.qty);
  if(!q)return toast('Enter a quantity');
  if(f.type!=='Manual adjustment')q=Math.abs(q);
  if(f.type==='Damaged goods')q=-q;
  if(p.quantity+q<0)return toast('Stock cannot go below zero');
  move(p,f.type,q);save();closeDlg();go('inventory');toast('Stock updated')}
