/* StockFlow – Settings, backup and restore */
views.settings=function(){
  const s=db.settings;
  return `<h2>Settings</h2><div class="card" style="max-width:480px"><form onsubmit="saveSettings(event)"><label>Business name<input name="name" value="${esc(s.name)}" required></label><label>Phone<input name="phone" value="${esc(s.phone)}"></label>
  <label>Default minimum stock<input name="low" type="number" min="0" value="${s.low}"></label><button class="b">Save settings</button></form></div>
  <div class="card" style="max-width:480px"><h3>Backup and restore</h3><p class="mute">Data lives in this browser only. Export a backup regularly.</p>
  <div class="bar"><button class="b alt" onclick="backup()">Export JSON backup</button><label class="b alt" style="margin:0">Import backup<input type="file" accept=".json" hidden onchange="restore(this.files[0])"></label>
  <button class="b red" onclick="resetAll()">Reset all data</button></div></div>`};

function saveSettings(e){e.preventDefault();const f=Object.fromEntries(new FormData(e.target));db.settings={name:f.name.trim(),phone:f.phone.trim(),low:Math.max(0,+f.low||0)};save();toast('Settings saved')}

function backup(){download('stockflow-backup-'+day(new Date())+'.json',JSON.stringify(db,null,2),'application/json')}

function restore(file){
  if(!file)return;const r=new FileReader();
  r.onload=()=>{try{const d=JSON.parse(r.result);if(d.v!==1||!Array.isArray(d.products)||!Array.isArray(d.sales))throw 0;if(!confirm('Replace all current data with this backup?'))return;db=d;save();go('settings');toast('Backup restored')}catch(e){toast('Invalid backup file')}};
  r.readAsText(file)}

function resetAll(){if(confirm('Delete ALL data and restore sample data? This cannot be undone.')){db=seed();cart=[];save();go('dashboard')}}
