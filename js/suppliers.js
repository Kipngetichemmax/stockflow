/* StockFlow – Supplier management */
views.suppliers=function(){
  return `<h2>Suppliers</h2><div class="bar"><span class="sp"></span><button class="b" onclick="supplierForm()">Add supplier</button></div><div class="card wrap"><table><tr><th>Name</th><th>Phone</th><th>Email</th><th>Products supplied</th><th></th></tr>
  ${db.suppliers.map(s=>`<tr><td>${esc(s.name)}</td><td>${esc(s.phone)}</td><td>${esc(s.email)}</td><td>${db.products.filter(p=>p.supplier===s.name).length}</td><td><button class="b red sm" onclick="delSupplier('${s.id}')">Delete</button></td></tr>`).join('')}</table></div>`};

function supplierForm(){openDlg(`<h3>Add supplier</h3><form onsubmit="saveSupplier(event)"><label>Name<input name="name" required></label><label>Phone<input name="phone"></label><label>Email<input name="email" type="email"></label>
  <div class="bar"><button class="b">Save supplier</button><button type="button" class="b alt" onclick="closeDlg()">Cancel</button></div></form>`)}

function saveSupplier(e){e.preventDefault();const f=Object.fromEntries(new FormData(e.target));db.suppliers.push({id:pad('SUP',db.suppliers),...f});save();closeDlg();go('suppliers')}

function delSupplier(id){if(confirm('Delete this supplier?')){db.suppliers=db.suppliers.filter(s=>s.id!==id);save();go('suppliers')}}
