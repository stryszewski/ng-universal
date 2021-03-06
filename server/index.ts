import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';
import * as express from 'express';
import {join} from 'path';

// require() becouse this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } =  require('./main.bundle');
// NgUniversalTools: Express Engine and moduleMap for lazy loading
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// express server
const app = express();
const PORT = process.env.PORT || 4040;
const DIST_FOLDER = join(process.cwd(), 'dist');
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));
app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// server static files from browser
app.get('*.*', express.static(DIST_FOLDER));
// all routes use universal engine
app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'index.html'), {req});
});

// start server
app.listen(PORT, () => {
  console.log(`SSR applictaion is running on http://localhost:${PORT}`);
});
