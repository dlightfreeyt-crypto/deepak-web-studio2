const cfg=window.DWS_CONFIG||{};
const sb=(window.supabase&&cfg.SUPABASE_URL&&cfg.SUPABASE_URL.startsWith("http")&&cfg.SUPABASE_ANON_KEY&&cfg.SUPABASE_ANON_KEY!=="YOUR_SUPABASE_ANON_KEY")
 ? window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null;

const defaults={
 site_name:"Deepak Web Studio",hero_eyebrow:"WEB DESIGN • DEVELOPMENT • DIGITAL PRESENCE",
 hero_title:"Find a demo.|Build your website.",hero_text:"Explore ready-made website concepts for businesses, creators and professionals. Like one? Let's turn it into your own website.",
 hero_image:"",about_title:"Websites designed around your business.",about_text:"I create clean, responsive and conversion-focused websites for local businesses and personal brands.",
 about_image:"",about_label:"YOUR BUSINESS",whatsapp:"919999999999",whatsapp_message:"Hi, I want to build a website.",
 theme:"cream",accent:"#9a6a3a",accent2:"#d8b28a",background:"#f8f5ef",surface:"#fffdf9",
 build_title:"Let's build something that fits your business.",build_text:"Tell me what you need and I'll help you choose a suitable demo or create a custom design.",
 reviews_title:"What people say",meta_description:"Modern websites designed to help businesses attract customers.",
 features:["Modern responsive design","Clear calls-to-action","Easy future updates"]
};
const fallbackSites=[
{id:"demo-1",title:"Luxe Hair Studio",category:"Salon",description:"Elegant salon website with services, booking CTA and a premium visual style.",image_url:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80",demo_url:"#",tags:["salon","beauty"]},
{id:"demo-2",title:"Urban Plate",category:"Restaurant",description:"Modern restaurant showcase with menu, location and reservation-focused layout.",image_url:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",demo_url:"#",tags:["restaurant","food"]},
{id:"demo-3",title:"CarePlus Clinic",category:"Doctor",description:"Trust-focused clinic landing page with services, contact and appointment sections.",image_url:"https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80",demo_url:"#",tags:["doctor","clinic"]}
];
async function getSettings(){
 if(!sb)return JSON.parse(localStorage.getItem("dws_settings")||JSON.stringify(defaults));
 const {data,error}=await sb.from("settings").select("*").eq("id",1).maybeSingle();
 return error||!data?defaults:{...defaults,...data};
}
async function getSites(){
 if(!sb)return JSON.parse(localStorage.getItem("dws_sites")||JSON.stringify(fallbackSites));
 const {data,error}=await sb.from("websites").select("*").order("created_at",{ascending:false});
 return error?fallbackSites:(data||[]);
}
function waUrl(num,text){const n=(num||"").replace(/\D/g,"");return n?`https://wa.me/${n}?text=${encodeURIComponent(text||"Hi, I want to build a website.")}`:"#";}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function applySettings(s){
 document.title=s.site_name||defaults.site_name; document.getElementById("siteBrand").textContent=s.site_name||defaults.site_name;
 document.getElementById("footerBrand").textContent=s.site_name||defaults.site_name; document.getElementById("metaDescription").content=s.meta_description||defaults.meta_description;
 document.getElementById("heroEyebrow").textContent=s.hero_eyebrow||defaults.hero_eyebrow;
 const ht=String(s.hero_title||defaults.hero_title).split("|"); document.getElementById("heroTitle").innerHTML=`${esc(ht[0])}<br><span>${esc(ht[1]||"")}</span>`;
 document.getElementById("heroText").textContent=s.hero_text||defaults.hero_text; document.getElementById("aboutTitle").textContent=s.about_title||defaults.about_title;
 document.getElementById("aboutText").textContent=s.about_text||defaults.about_text; document.getElementById("aboutPhotoLabel").textContent=s.about_label||defaults.about_label;
 document.getElementById("buildTitle").textContent=s.build_title||defaults.build_title; document.getElementById("buildText").textContent=s.build_text||defaults.build_text; document.getElementById("reviewsTitle").textContent=s.reviews_title||defaults.reviews_title;
 const featureList=document.getElementById("featureList"); const features=Array.isArray(s.features)?s.features:defaults.features; featureList.innerHTML=features.filter(Boolean).map((x,i)=>`<div><b>${String(i+1).padStart(2,"0")}</b><span>${esc(x)}</span></div>`).join("");
 document.body.style.setProperty("--accent",s.accent||defaults.accent);document.body.style.setProperty("--accent2",s.accent2||defaults.accent2);document.body.style.setProperty("--bg",s.background||defaults.background);document.body.style.setProperty("--surface",s.surface||defaults.surface);
 if(s.about_image)document.getElementById("aboutPhoto").style.backgroundImage=`url("${s.about_image}")`;
 if(s.hero_image)document.getElementById("heroImageCard").style.backgroundImage=`url("${s.hero_image}")`;
 const url=waUrl(s.whatsapp,s.whatsapp_message);document.getElementById("buildWhatsApp").href=url;document.getElementById("floatingWhatsApp").href=url;document.getElementById("navCta").href=url;document.getElementById("heroCta").href=url;
}
function renderSites(sites){
 const grid=document.getElementById("demoGrid"); if(!grid)return; const q=(document.getElementById("search").value||"").toLowerCase().trim(),cat=window.activeCategory||"All";
 const list=sites.filter(x=>(cat==="All"||x.category===cat)&&(!q||`${x.title} ${x.category} ${(x.tags||[]).join(" ")} ${x.description}`.toLowerCase().includes(q)));
 grid.innerHTML=list.map(x=>`<article class="demo-card"><div class="demo-image" style="background-image:url('${esc(x.image_url||"")}')"><span class="tag">${esc(x.category)}</span></div><div class="demo-body"><h3>${esc(x.title)}</h3><p>${esc(x.description||"")}</p><div class="demo-meta"><span>${(x.tags||[]).slice(0,2).map(t=>`#${esc(t)}`).join(" ")}</span><a class="demo-link" href="${esc(x.demo_url)}" target="_blank" rel="noopener">Live Demo ↗</a></div></div></article>`).join("");
 document.getElementById("empty").classList.toggle("hidden",list.length>0);
}
function renderCategories(sites){const bar=document.getElementById("categoryBar"),cats=["All",...new Set(sites.map(x=>x.category).filter(Boolean))];bar.innerHTML=cats.map(c=>`<button class="chip ${c==="All"?"active":""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");bar.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{window.activeCategory=b.dataset.cat;bar.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x===b));renderSites(window.allSites)});}
async function renderFeedback(){
 const grid=document.getElementById("feedbackGrid");if(!grid)return;let data=[];
 if(sb){const r=await sb.from("feedback").select("*").eq("approved",true).order("created_at",{ascending:false});data=r.data||[]}
 else data=JSON.parse(localStorage.getItem("dws_feedback")||"[]").filter(x=>x.approved!==false);
 grid.innerHTML=data.length?data.slice(0,9).map(f=>`<div class="feedback-card"><div class="stars">${"★".repeat(Number(f.rating||5))}${"☆".repeat(5-Number(f.rating||5))}</div><p>“${esc(f.message)}”</p><small>${esc(f.name)}</small></div>`).join(""):`<div class="feedback-card"><div class="stars">★★★★★</div><p>Be the first to leave feedback.</p><small>Your feedback can appear here after approval.</small></div>`;
}
async function initPublic(){
 const s=await getSettings();applySettings(s);window.allSites=await getSites();renderCategories(window.allSites);renderSites(window.allSites);await renderFeedback();
 document.getElementById("search").addEventListener("input",()=>renderSites(window.allSites));document.getElementById("year").textContent=new Date().getFullYear();
 document.getElementById("feedbackForm").addEventListener("submit",async e=>{e.preventDefault();const fd=new FormData(e.target),payload={name:fd.get("name"),rating:Number(fd.get("rating")),message:fd.get("message"),approved:false};
 if(sb){const r=await sb.from("feedback").insert(payload);document.getElementById("feedbackMsg").textContent=r.error?"Could not send.":"Thanks! Your feedback is awaiting approval."}else{const a=JSON.parse(localStorage.getItem("dws_feedback")||"[]");a.unshift({...payload,id:Date.now()});localStorage.setItem("dws_feedback",JSON.stringify(a));document.getElementById("feedbackMsg").textContent="Thanks! Demo feedback saved locally."}e.target.reset();});
}
if(document.getElementById("demoGrid"))initPublic();
