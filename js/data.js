/* StockFlow – Sample data used on first run */
function seed(){
  const s={v:1,settings:{name:'My Shop',phone:'',low:5},suppliers:[{id:'SUP-001',name:'ABC Electronics',phone:'0712345678',email:'abc@example.com'}],products:[],sales:[],moves:[]};
  [['Samsung Charger','SAM-CH-001','Electronics',500,800,25],['Earphones','EAR-001','Electronics',700,1200,12],['USB Cable','USB-001','Electronics',150,300,40],['Phone Case','CAS-001','Accessories',200,450,3]].forEach(r=>{
    const p={id:pad('PRD',s.products),name:r[0],sku:r[1],category:r[2],costPrice:r[3],sellingPrice:r[4],quantity:r[5],minStock:5,supplier:'ABC Electronics'};
    s.products.push(p);s.moves.push({date:new Date().toISOString(),productId:p.id,name:p.name,type:'Opening stock',qty:p.quantity,after:p.quantity});
  });return s;
}
