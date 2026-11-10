/* StockFlow – Reports, charts and CSV export */
views.reports=function(){
  const now=new Date(),t=day(now),rows=(f)=>db.sales.filter(f);
  const per={Today:rows(s=>day(s.date)===t),'Last 7 days':rows(s=>(now-new Date(s.date))<7*864e5),'This month':rows(s=>{const d=new Date(s.date);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear()})};
  const cogs=a=>a.reduce((x,s)=>x+s.items.reduce((y,i)=>y+i.quantity*i.unitCost,0),0);
  const best={},pay={};
  db.sales.forEach(s=>{pay[s.paymentMethod]=(pay[s.paymentMethod]||0)+s.total;s.items.forEach(i=>best[i.name]=(best[i.name]||0)+i.quantity)});
  const top=Object.entries(best).sort((a,b)=>b[1]-a[1]).slice(0,5);
  return `<h2>Reports</h2><div class="bar"><span class="sp"></span><button class="b alt" onclick="exportCSV()">Export sales CSV</button></div>
  <div class="card wrap"><table><tr><th>Period</th><th>Sales</th><th>Revenue</th><th>COGS</th><th>Gross profit</th></tr>
  ${Object.entries(per).map(([k,a])=>{const r=a.reduce((x,s)=>x+s.total,0),c=cogs(a);return `<tr><td>${k}</td><td>${a.length}</td><td>${fmt(r)}</td><td>${fmt(c)}</td><td class="ok">${fmt(r-c)}</td></tr>`}).join('')}</table>
  <p class="mute" style="font-size:13px">Gross profit = revenue − cost of goods sold. It is not net profit, as rent, salaries and other expenses are not included.</p></div>
  <div class="two"><div class="card"><h3>Best-selling products</h3>${top.length?`<table>${top.map(([n,q])=>`<tr><td>${esc(n)}</td><td>${q} sold</td></tr>`).join('')}</table>`:'<p class="mute">No sales yet.</p>'}</div>
  <div class="card"><h3>Sales by payment method</h3>${Object.keys(pay).length?`<table>${Object.entries(pay).map(([n,v])=>`<tr><td>${n}</td><td>${fmt(v)}</td></tr>`).join('')}</table>`:'<p class="mute">No sales yet.</p>'}</div></div>
  <div class="card"><h3>Revenue, last 7 days</h3>${chart7()}</div>`};

function chart7(){
  const days=[...Array(7)].map((_,i)=>{const d=new Date(Date.now()-(6-i)*864e5);return {k:day(d),l:d.toLocaleDateString('en',{weekday:'short'})}});
  const v=days.map(d=>db.sales.filter(s=>day(s.date)===d.k).reduce((a,s)=>a+s.total,0)),m=Math.max(...v,1);
  return `<div class="chart">${days.map((d,i)=>`<div title="${fmt(v[i])}"><i style="height:${v[i]/m*100}%"></i>${d.l}</div>`).join('')}</div>`}

function exportCSV(){
  const q=v=>'"'+String(v).replace(/"/g,'""')+'"',rows=[['Sale ID','Date','Product','Qty','Unit price','Unit cost','Payment','Line total']];
  db.sales.forEach(s=>s.items.forEach(i=>rows.push([s.id,s.date,i.name,i.quantity,i.unitPrice,i.unitCost,s.paymentMethod,i.quantity*i.unitPrice])));
  download('stockflow-sales.csv',rows.map(r=>r.map(q).join(',')).join('\n'),'text/csv')}
