// Run on the cloud validation runner, using the same HTML as the mobile WebView.
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
const target = 'review';
await mkdir(target,{recursive:true});
const screens = ['welcome','onboarding-you','onboarding-atmosphere','onboarding-before-continue','onboarding-safety','home','check-in-choice','compass-map','emotions-select','emotions-activation','emotions-body','emotions-domain','compass-body','compass-domain','check-in-review','summary','options-choice','steady-me','shift-state','understand','understand-explore','just-log','insights','connect','settings','learn'];
const server = createServer(async (req,res) => {
  const file = req.url.startsWith('/prior') ? process.env.RUNNER_TEMP+'/baseline.html' : '../flutter/assets/clarity/index.html';
  res.setHeader('Content-Type','text/html');
  res.end(await readFile(file));
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const b=await chromium.launch();
const results=[];
try {
for(const mode of ['prior','current']) {
  const p=await b.newPage({reducedMotion:'reduce'});
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  for(const width of [320,360,768]) {
    await p.setViewportSize({width,height:width===320?886:width===360?800:1024});
    await p.goto('http://127.0.0.1:'+server.address().port+'/'+mode);
    for(const screen of (mode==='prior'?['home','connect','insights']:screens)) {
      const sample = {name:'Alex',motion:false};
      const draft = {id:'sample',emotions:['calm'],activation:4,bodyZones:[],lifeDomains:[],compassQuadrant:'high-open'};
      await p.evaluate(({screen,sample,draft})=>localStorage.setItem('mindrecipe-clarity-preview-v1',JSON.stringify({screen,profile:sample,draft,onboardingComplete:!screen.startsWith('onboarding') && screen!=='welcome'})),{screen,sample,draft});
      await p.reload();
      await p.locator('button').first().waitFor();
      await p.evaluate(()=>document.fonts.ready);
      await p.screenshot({path:target+'/'+mode+'-'+width+'-'+screen+'.png',animations:'disabled'});
      const layout=await p.evaluate(()=>{
        const el=s=>document.querySelector(s);
        const rect=e=>{if(!e)return null;const {x,y,width,height}=e.getBoundingClientRect();return {x,y,width,height}};
        const nav=el('nav[aria-label="Main navigation"]'),footer=el('footer');
        return {width:innerWidth,documentWidth:document.documentElement.scrollWidth,heading:el('main h1,main h2,h2,h1')?.textContent,nav:rect(nav),navScroll:nav?.scrollWidth,footer:rect(footer),footerType:footer&&getComputedStyle(footer.querySelector('p.md\\:hidden')||footer).fontSize,checkInCard:rect([...document.querySelectorAll('button')].find(e=>e.textContent.includes("Let's check where"))),
        overflow:[...document.querySelectorAll('button,input,textarea')].filter(e=>!e.closest('nav') && e.offsetWidth>0 && (e.getBoundingClientRect().right>innerWidth+1 || e.getBoundingClientRect().left< -1)).map(e=>e.textContent.trim().slice(0,45))};
      });
      results.push({mode,screen,...layout});
    }
  }
  await p.close();
  if(errors.length) throw Error(errors.join('\n'));
}
const phone=await b.newPage({viewport:{width:320,height:886},reducedMotion:'reduce'});
await phone.goto('http://127.0.0.1:'+server.address().port+'/current');
await phone.evaluate(()=>localStorage.setItem('mindrecipe-clarity-preview-v1',JSON.stringify({
 screen:'check-in-review',onboardingComplete:true,profile:{name:'Alex',motion:false},
 draft:{id:'review-example',compassQuadrant:'high-open',bodyZones:['head'],lifeDomains:['physical']}
})));
await phone.reload();
const snap=async name=>phone.screenshot({path:target+'/verified-'+name+'.png',animations:'disabled'});
await phone.getByText('Compass check-in completion').waitFor();
await snap('compass-review');
await phone.getByText('Optional on the compass path').last().scrollIntoViewIfNeeded();
await snap('compass-optional');
await phone.getByRole('button',{name:'Show Recommendations'}).click();
const finish=phone.getByRole('button',{name:'Complete Session & Return Home'});
await finish.waitFor();
await snap('complete-session');
await finish.click();
await phone.getByRole('button',{name:'Insights',exact:true}).click();
await phone.reload();
await phone.getByText('Total Check-ins',{exact:true}).scrollIntoViewIfNeeded();
await snap('saved-insights');
await phone.close();
await writeFile(target+'/layout.json',JSON.stringify(results,null,2));
} finally {await b.close();server.close();}
