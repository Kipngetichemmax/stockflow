/* StockFlow – LocalStorage persistence (db state, load, save) */
const KEY='stockflow_v1';

let db=load();

function load(){try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&d.v===1&&Array.isArray(d.products))return d}catch(e){}return seed()}

function save(){try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){toast('Could not save – browser storage unavailable')}}
