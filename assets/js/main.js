const header=document.querySelector('[data-header]');
const onScroll=()=>header?.classList.toggle('scrolled',window.scrollY>20);
onScroll();window.addEventListener('scroll',onScroll,{passive:true});

const reveals=document.querySelectorAll('.reveal');
if('IntersectionObserver'in window){
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('on');observer.unobserve(entry.target)}})
  },{threshold:.12,rootMargin:'0px 0px -5%'});
  reveals.forEach(el=>observer.observe(el));
}else{reveals.forEach(el=>el.classList.add('on'))}

const menu=document.querySelector('[data-menu]');
const nav=document.querySelector('.nav');
menu?.addEventListener('click',()=>{
  const open=document.body.classList.toggle('menu-open');
  menu.setAttribute('aria-expanded',String(open));
  if(nav){nav.style.display=open?'flex':'';if(open){nav.style.position='fixed';nav.style.inset='72px 0 auto';nav.style.flexDirection='column';nav.style.gap='0';nav.style.background='#f4f1ea';nav.style.borderBottom='1px solid #c8c3ba';nav.querySelectorAll('a').forEach(a=>{a.style.padding='18px 24px';a.style.borderTop='1px solid #d7d1c6'})}else{nav.removeAttribute('style');nav.querySelectorAll('a').forEach(a=>a.removeAttribute('style'))}}
});

document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{if(document.body.classList.contains('menu-open'))menu?.click()}));
