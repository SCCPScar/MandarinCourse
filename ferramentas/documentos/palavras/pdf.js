const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + process.cwd() + '/lista.html');
  await p.pdf({ path: 'Palavras em chinês - Chá.pdf', format: 'A4', printBackground: true, displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="font-size:8pt;width:100%;text-align:center;color:#5B6873;font-family:Carlito">Chá · Palavras em chinês · página <span class="pageNumber"></span> de <span class="totalPages"></span></div>',
    margin: { top: '16mm', bottom: '18mm', left: '16mm', right: '16mm' } });
  await b.close();
})();
