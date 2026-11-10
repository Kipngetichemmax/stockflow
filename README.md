# StockFlow

**Business Inventory & Sales Management System**

A browser-based app for small retail businesses to manage products, track stock, record sales and review business performance. Built with HTML5, CSS3 and vanilla JavaScript. Data is saved in the browser's LocalStorage.

## Features

- Dashboard with stock value, sales, status counts and a 7-day chart
- Product management with unique SKUs and validation
- Inventory tracking, stock adjustments and movement history
- Point of sale with cart, stock checks and printable receipts
- Sales history with search
- Reports: revenue, cost of goods sold, gross profit, best sellers, CSV export
- Supplier management
- Settings, JSON backup/restore and light/dark theme

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Project structure

```
index.html        Page shell; loads the CSS and JS files
css/              style, components, dashboard, responsive
js/utils.js       Helpers (loaded first)
js/data.js        Sample data
js/storage.js     LocalStorage load/save
js/<module>.js    products, inventory, pos, sales, reports, suppliers, settings, dashboard
js/app.js         Navigation and start-up (loaded last)
docs/             Requirements and system design
```

The scripts are plain (non-module) scripts that share globals, so the load order in `index.html` matters.

## Known limitations

- Data lives only in the browser on one device; there is no shared database.
- There is no real authentication or payment integration.
- Gross profit excludes rent, salaries and other expenses; it is not net profit.

## Contributors

Group project – Web Systems II.
