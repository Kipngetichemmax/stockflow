/* StockFlow – Dashboard view */
views.dashboard=function(){
  const t=day(new Date()),ts=db.sales.filter(s=>day(s.date)===t),cnt={in:0,low:0,out:0};
  db.products.forEach(p=>cnt[status(p)]++);
  const val=db.products.reduce((a,p)=>a+p.quantity*p.costPrice,0),rev=db.sales.reduce((a,s)=>a+s.total,0);
  const lows=db.products.filter(p=>status(p)!=='in');
  return `<h2>Dashboard</h2><div class="grid">
  <div class="stat"><b>${db.products.length}</b><span>Products</span></div>
  <div class="stat"><b>${fmt(val)}</b><span>Stock value (at cost)</span></div>
  <div class="stat"><b>${fmt(ts.reduce((a,s)=>a+s.total,0))}</b><span>Today's sales</span></div>
  <div class="stat"><b>${fmt(rev)}</b><span>Total revenue</span></div>
  <div class="stat"><b class="ok">${cnt.in}</b><span>In stock</span></div>
  <div class="stat"><b style="color:var(--warn)">${cnt.low}</b><span>Low stock</span></div>
  <div class="stat"><b class="bad">${cnt.out}</b><span>Out of stock</span></div></div>
  <div class="two"><div class="card"><h3>Last 7 days</h3>${chart7()}</div>
  <div class="card"><h3>Needs restocking</h3>${lows.length?`<table>${lows.map(p=>`<tr><td>${esc(p.name)}</td><td>${p.quantity} left</td><td>${tag(p)}</td></tr>`).join('')}</table>`:'<p class="mute">All products are above their minimum stock.</p>'}</div></div>
  <div class="card"><h3>Recent transactions</h3>${salesTable(db.sales.slice(0,5))}</div>`};
