/* StockFlow – Sales history view */
views.sales=function(q=''){
  const l=db.sales.filter(s=>(s.id+s.paymentMethod+day(s.date)).toLowerCase().includes(q.toLowerCase()));
  return `<h2>Sales history</h2><div class="bar"><input placeholder="Search ID, payment or date (YYYY-MM-DD)" value="${esc(q)}" oninput="go('sales',this.value)"></div><div class="card wrap">${salesTable(l)}</div>`};

function salesTable(l){return l.length?`<table><tr><th>ID</th><th>Date</th><th>Items</th><th>Payment</th><th>Total</th><th></th></tr>${l.map(s=>`<tr><td>${s.id}</td><td>${new Date(s.date).toLocaleString()}</td><td>${s.items.reduce((a,i)=>a+i.quantity,0)}</td><td>${s.paymentMethod}</td><td>${fmt(s.total)}</td><td><button class="b alt sm" onclick="receipt('${s.id}')">Receipt</button></td></tr>`).join('')}</table>`:'<p class="mute">No sales recorded yet. Complete a sale in the POS.</p>'}
