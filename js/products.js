/* StockFlow – Product management */
views.products=function(q=''){
  const l=db.products.filter(p=>(p.name+p.sku+p.category).toLowerCase().includes(q.toLowerCase()));
  return `<h2>Products</h2><div class="bar"><input id="q" placeholder="Search name, SKU or category" value="${esc(q)}" oninput="searchP(this.value)"><span class="sp"></span><button class="b" onclick="productForm()">Add product</button></div>
  <div class="card wrap" id="ptable">${ptable(l)}</div>`};

function ptable(l){return l.length?`<table><tr><th>ID</th><th>Name</th><th>SKU</th><th>Category</th><th>Cost</th><th>Price</th><th>Qty</th><th>Status</th><th></th></tr>
 ${l.map(p=>`<tr><td>${p.id}</td><td>${esc(p.name)}</td><td>${esc(p.sku)}</td><td>${esc(p.category)}</td><td>${fmt(p.costPrice)}</td><td>${fmt(p.sellingPrice)}</td><td>${p.quantity}</td><td>${tag(p)}</td>
 <td style="white-space:nowrap"><button class="b alt sm" onclick="productForm('${p.id}')">Edit</button> <button class="b red sm" onclick="delProduct('${p.id}')">Delete</button></td></tr>`).join('')}</table>`:'<p class="mute">No products found. Add your first product to get started.</p>'}

function searchP(v){$('#ptable').innerHTML=ptable(db.products.filter(p=>(p.name+p.sku+p.category).toLowerCase().includes(v.toLowerCase())))}

function productForm(id){
  const p=db.products.find(x=>x.id===id)||{name:'',sku:'',category:'',costPrice:0,sellingPrice:0,quantity:0,minStock:db.settings.low,supplier:''};
  openDlg(`<h3>${id?'Edit':'Add'} product</h3><form onsubmit="saveProduct(event,'${id||''}')">
  <label>Name<input name="name" value="${esc(p.name)}" required></label><label>SKU<input name="sku" value="${esc(p.sku)}" required></label><label>Category<input name="category" value="${esc(p.category)}" required></label>
  <label>Cost price (KSh)<input name="cost" type="number" min="0" step="any" value="${p.costPrice}" required></label><label>Selling price (KSh)<input name="price" type="number" min="0" step="any" value="${p.sellingPrice}" required></label>
  ${id?'':`<label>Opening stock<input name="qty" type="number" min="0" step="1" value="0" required></label>`}<label>Minimum stock<input name="min" type="number" min="0" step="1" value="${p.minStock}" required></label>
  <label>Supplier<select name="supplier"><option value="">None</option>${db.suppliers.map(s=>`<option ${s.name===p.supplier?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label>
  <div class="bar"><button class="b">Save product</button><button type="button" class="b alt" onclick="closeDlg()">Cancel</button></div></form>`)}

function saveProduct(e,id){
  e.preventDefault();const f=Object.fromEntries(new FormData(e.target)),sku=f.sku.trim();
  if(!f.name.trim())return toast('Product name is required');
  if(db.products.some(p=>p.sku.toLowerCase()===sku.toLowerCase()&&p.id!==id))return toast('SKU already exists – use a unique SKU');
  if(+f.cost<0||+f.price<0||+f.min<0||+(f.qty||0)<0)return toast('Values cannot be negative');
  if(+f.price<+f.cost&&!confirm('Selling price is below cost price. Save anyway?'))return;
  const d={name:f.name.trim(),sku,category:f.category.trim(),costPrice:+f.cost,sellingPrice:+f.price,minStock:+f.min,supplier:f.supplier};
  if(id)Object.assign(db.products.find(p=>p.id===id),d);
  else{const p={id:pad('PRD',db.products),...d,quantity:0};db.products.push(p);if(+f.qty>0)move(p,'Opening stock',Math.floor(+f.qty))}
  save();closeDlg();go('products');toast('Product saved')}

function delProduct(id){if(confirm('Delete this product? Past sales records are kept.')){db.products=db.products.filter(p=>p.id!==id);save();go('products')}}
