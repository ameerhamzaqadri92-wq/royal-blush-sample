'use strict';
(()=>{
 const KEY='royal-blush-preview-v1',SESSION='rb-preview-member';
 const owner={id:1,name:'Demo Owner',email:'owner@example.test',role:'admin',phone:'',address:''};
 const customer={id:2,name:'Ayesha',email:'customer@example.test',role:'customer',phone:'0300 0000000',address:'Sample address, Karachi'};
 const now=()=>new Date().toISOString();
 function initial(){return{...structuredClone(window.DEMO_SEED),profile:customer,preferences:{cart:[],wishlist:[]},settings:{heroTitle:'A little rare. A little royal.',heroSubtitle:'Imported makeup, thoughtful skincare and unforgettable scents. A fresh edit, in beautifully small quantities.',heroVideo:'',whatsapp:'923352244107',delivery:'Sample: delivery options and charges will be confirmed by the store.',payment:'Sample: the store confirms payment details when an order is agreed.',returns:'Sample: the store owner can publish the applicable returns policy here.'},conversations:[{id:1,name:'Sample customer',email:'sample@example.test',updated:now()}],messages:[{id:1,conversation_id:1,sender:'customer',body:'Hello! Could you help me choose a shade? (Sample message)',created:now(),read_at:null}],enquiries:[]}}
 function read(){try{return JSON.parse(localStorage.getItem(KEY))||initial()}catch{return initial()}}
 function save(db){try{localStorage.setItem(KEY,JSON.stringify(db))}catch{throw Error('Demo storage is full. Use a smaller photo or reset the demo.')}}
 if(!localStorage.getItem(KEY))save(initial());
 const isOwner=()=>new URLSearchParams(location.search).get('page')==='admin';
 const current=db=>isOwner()?owner:sessionStorage.getItem(SESSION)?db.profile:null;
 const next=rows=>Math.max(0,...rows.map(r=>r.id))+1;
 const output=value=>structuredClone(value);
 function normalize(db,items){let used={};return(items||[]).flatMap(i=>{const p=db.products.find(p=>p.id===i.productId);if(!p)return[];const q=Math.min(i.quantity,p.stock-(used[p.id]||0));if(q<=0)return[];used[p.id]=(used[p.id]||0)+q;return[{...i,quantity:q}]})}
 window.demoAPI=async(path,method='GET',b={})=>{
  const db=read(),user=current(db);let match,result={ok:true};
  db.products.forEach(p=>p.category=db.categories.find(c=>c.id===p.category_id)?.name||'');
  if(path==='/bootstrap')return output({user,setupRequired:false,products:db.products,categories:db.categories,settings:db.settings,preferences:user?{cart:normalize(db,db.preferences.cart),wishlist:db.preferences.wishlist.filter(id=>db.products.some(p=>p.id===id))}:null});
  if(path==='/login'||path==='/signup'){sessionStorage.setItem(SESSION,'1');return{user:db.profile}}
  if(path==='/logout'){sessionStorage.removeItem(SESSION);return result}
  if(path==='/profile'){db.profile={...db.profile,name:b.name,phone:b.phone,address:b.address};result={user:db.profile}}
  else if(path==='/password')throw Error('No real password exists in this demo.');
  else if(path==='/preferences'){if(method==='PUT')db.preferences={cart:normalize(db,b.cart),wishlist:b.wishlist};result=db.preferences}
  else if(path==='/chat'){
   if(method==='POST'){let c=db.conversations.find(c=>c.id===2);if(!c){c={id:2,name:user?.name||b.name||'Guest visitor',updated:now()};db.conversations.push(c)}result={id:c.id}}
   else result={conversations:db.conversations.filter(c=>c.id===2),unread:db.messages.filter(m=>m.conversation_id===2&&m.sender==='admin'&&!m.read_at).length};
  }else if((match=path.match(/^\/chat\/(\d+)\/messages$/))){const id=Number(match[1]);if(method==='POST'){db.messages.push({id:next(db.messages),conversation_id:id,sender:isOwner()?'admin':'customer',body:String(b.body).trim().slice(0,2000),created:now(),read_at:null});const c=db.conversations.find(c=>c.id===id);if(c)c.updated=now();if(!isOwner()&&!db.messages.some(m=>m.conversation_id===id&&m.sender==='admin'))db.messages.push({id:next(db.messages),conversation_id:id,sender:'admin',body:'Sample reply: thank you for your message! This preview does not contact the store. Open Owner demo → Customer messages to try replying yourself in this browser.',created:now(),read_at:null})}result={messages:db.messages.filter(m=>m.conversation_id===id)}}
  else if((match=path.match(/^\/chat\/(\d+)\/read$/))){db.messages.filter(m=>m.conversation_id===Number(match[1])&&m.sender===(isOwner()?'customer':'admin')).forEach(m=>m.read_at=now())}
  else if(path==='/enquiries'){
   if(method==='POST'){const items=normalize(db,b.items).map(i=>{const p=db.products.find(p=>p.id===i.productId);return{...i,name:p.name,price:p.price}});if(!items.length)throw Error('Add a product first.');const e={id:next(db.enquiries),...b,items,total:items.reduce((s,i)=>s+i.price*i.quantity,0),status:'New',created:now()};db.enquiries.push(e);result={id:e.id,total:e.total,url:'https://wa.me/'+db.settings.whatsapp+'?text='+encodeURIComponent('DEMO ENQUIRY — not a real order\n'+items.map(i=>`${i.name} ${i.shade} ${i.size} × ${i.quantity}`).join('\n')+'\nSubtotal: Rs. '+e.total)}}else result={enquiries:db.enquiries};
  }else if(path==='/admin/overview'){result={stats:{products:db.products.length,lowStock:db.products.filter(p=>p.stock>0&&p.stock<=3).length,customers:1,unread:db.messages.filter(m=>m.sender==='customer'&&!m.read_at).length,enquiries:db.enquiries.length},conversations:db.conversations.map(c=>({...c,last_message:db.messages.filter(m=>m.conversation_id===c.id).at(-1)?.body||'',unread:db.messages.filter(m=>m.conversation_id===c.id&&m.sender==='customer'&&!m.read_at).length})).reverse(),enquiries:[...db.enquiries].reverse()}}
  else if(path==='/admin/products'){const id=next(db.products);db.products.push({...b,id});result={id}}
  else if((match=path.match(/^\/admin\/products\/(\d+)$/))){const id=Number(match[1]);if(method==='DELETE')db.products=db.products.filter(p=>p.id!==id);else db.products=db.products.map(p=>p.id===id?{...p,...b}:p)}
  else if(path==='/admin/categories'){const name=String(b.name).trim();if(!name)throw Error('Enter a category name.');if(db.categories.some(c=>c.name.toLowerCase()===name.toLowerCase()))throw Error('This category already exists.');const id=next(db.categories);db.categories.push({id,name});result={id}}
  else if((match=path.match(/^\/admin\/categories\/(\d+)$/))){const id=Number(match[1]);if(method==='DELETE'){if(db.products.some(p=>p.category_id===id)){if(!b.moveTo||b.moveTo===id||!db.categories.some(c=>c.id===b.moveTo))throw Error('Choose another category.');db.products.filter(p=>p.category_id===id).forEach(p=>p.category_id=b.moveTo)}db.categories=db.categories.filter(c=>c.id!==id)}else{const name=String(b.name).trim();if(!name||db.categories.some(c=>c.id!==id&&c.name.toLowerCase()===name.toLowerCase()))throw Error('Choose a unique category name.');db.categories.find(c=>c.id===id).name=name}}
  else if(path==='/admin/settings')db.settings={...db.settings,...b};
  else if((match=path.match(/^\/admin\/enquiries\/(\d+)$/))){const e=db.enquiries.find(e=>e.id===Number(match[1]));if(e)e.status=b.status}
  else if(path==='/admin/upload'){if(!['image/png','image/jpeg','image/webp'].includes(b.mime))throw Error('Only photo previews are supported in the static demo.');if(b.data.length>1000000)throw Error('For this browser demo, choose a photo smaller than 750 KB.');return{url:'data:'+b.mime+';base64,'+b.data}}
  else throw Error('This action needs the full server version.');
  save(db);return output(result);
 };
 document.addEventListener('click',event=>{
  if(event.target.closest('#reset-demo')){if(confirm('Reset all sample changes in this browser?')){for(const k of [KEY,'rb-demo-cart','rb-demo-wishlist'])localStorage.removeItem(k);sessionStorage.removeItem(SESSION);location.href='./index.html'}return}
  const link=event.target.closest('a');if(!link||!link.href.startsWith('https://wa.me/'))return;
  event.preventDefault();const d=document.createElement('dialog');d.className='small-dialog';const h=document.createElement('h2');h.textContent='WhatsApp preview';h.style.fontSize='28px';const p=document.createElement('p');p.textContent='Client sample only. No message will be sent to the store.';const pre=document.createElement('p');pre.style.whiteSpace='pre-wrap';pre.textContent=new URL(link.href).searchParams.get('text')||'In the full website, this button opens a conversation with The Royal Blush on WhatsApp.';const close=document.createElement('button');close.className='btn';close.textContent='Close preview';close.onclick=()=>{d.close();d.remove()};d.append(h,p,pre,close);document.body.append(d);d.showModal();
 },true);
})();
