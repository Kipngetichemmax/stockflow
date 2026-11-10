/* StockFlow – Point of sale, cart, checkout and receipts */
views.pos=function(q=''){
  const l=db.products.filter(p=>(p.name+p.sku).toLowerCase().includes(q.toLowerCase()));
  const tot=cart.reduce((a,c)=>a+c.qty*c.p.sellingPrice,0);
  return `<h2>Point of sale</h2><div class="pos"><div class="card"><input id="q" placeholder="Search product or SKU" value="${esc(q)}" oninput="go('pos',this.value)" style="margin-bottom:12px">
  <div class="pgrid">${l.map(p=>`<button class="pitem" ${p.quantity<=0?'disabled':''} onclick="addCart('${p.id}')"><b>${esc(p.name)}</b><br>${fmt(p.sellingPrice)}<br><small class="mute">${p.quantity} in stock</small></button>`).join('')}</div></div>
  <div class="card"><h3>Cart</h3>${cart.length?`<table>${cart.map((c,i)=>`<tr><td>${esc(c.p.name)}</td><td><input type="number" min="1" max="${c.p.quantity}" value="${c.qty}" style="width:64px" onchange="setQty(${i},this.value)"></td><td>${fmt(c.qty*c.p.sellingPrice)}</td><td><button class="b alt sm" onclick="cart.splice(${i},1);go('pos')" aria-label="Remove">✕</button></td></tr>`).join('')}</table>
  <p style="font-size:20px"><b>Total: ${fmt(tot)}</b></p><label>Payment method<select id="pay"><option>Cash</option><option>M-Pesa</option><option>Card</option></select></label>
  <button class="b" style="width:100%" onclick="checkout()">Complete sale</button>`:'<p class="mute">Select products to start a sale.</p>'}</div></div>`};

let cart=[],busy=false;

function addCart(id){
  const p=db.products.find(x=>x.id===id),c=cart.find(x=>x.p.id===id);
  if(c){if(c.qty>=p.quantity)return toast('Only '+p.quantity+' in stock');c.qty++}else cart.push({p,qty:1});
  go('pos',$('#q')?.value||'')}

function setQty(i,v){const c=cart[i];v=Math.max(1,Math.floor(+v)||1);if(v>c.p.quantity){toast('Only '+c.p.quantity+' in stock');v=c.p.quantity}c.qty=v;go('pos')}

function checkout(){
  if(busy||!cart.length)return;busy=true;
  try{
    const bad=cart.find(c=>c.qty>db.products.find(p=>p.id===c.p.id).quantity);
    if(bad)return toast('Not enough stock for '+bad.p.name);
    const sale={id:pad('SALE',db.sales),date:new Date().toISOString(),paymentMethod:$('#pay').value,total:0,items:[]};
    cart.forEach(c=>{const p=db.products.find(x=>x.id===c.p.id);
      sale.items.push({productId:p.id,name:p.name,quantity:c.qty,unitPrice:p.sellingPrice,unitCost:p.costPrice});
      sale.total+=c.qty*p.sellingPrice;move(p,'Sale',-c.qty)});
    db.sales.unshift(sale);save();cart=[];go('pos');receipt(sale.id);toast('Sale completed')
  }finally{busy=false}}

function receipt(id){
  const s=db.sales.find(x=>x.id===id);
  openDlg(`<div class="receipt"><h3 style="text-align:center">${esc(db.settings.name)}</h3><p style="text-align:center;margin:0">${esc(db.settings.phone)}</p><p>${s.id}<br>${new Date(s.date).toLocaleString()}</p>
  <table>${s.items.map(i=>`<tr><td>${esc(i.name)}</td><td>${i.quantity} × ${i.unitPrice}</td><td style="text-align:right">${i.quantity*i.unitPrice}</td></tr>`).join('')}</table>
  <hr><p><b>TOTAL ${fmt(s.total)}</b><br>Paid by ${s.paymentMethod}</p><p style="text-align:center">Thank you for shopping with us.</p></div>
  <div class="bar noprint"><button class="b" onclick="print()">Print</button><button class="b alt" onclick="closeDlg()">Close</button></div>`)}
