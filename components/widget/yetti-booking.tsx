/**
 * Yetti booking widget. One global script (mounted once in the root layout)
 * opens a booking modal for any element on the page carrying
 * `data-yetti-activity`, including the real `<BookButton>` on pricing cards
 * and the buttons the FAQ assistant renders in its own replies.
 *
 * This is a fixed, developer-authored string, not user input, so the
 * `dangerouslySetInnerHTML` below is the intended, trusted use of it: it is
 * the exact snippet Yetti hands out for pasting once before `</body>`.
 */
const YETTI_BOOKING_SCRIPT = `
(function(){
  'use strict';
  var WIDGET_URL='https://yetti.ai/widget/wk_9Hu0VQNBfhMsFrSDZt1e_9Ss-QHx2Kkn';
  function _ybStyle(){
    if(document.getElementById('_yb_s'))return;
    var s=document.createElement('style');s.id='_yb_s';
    s.textContent='@keyframes _ybIn{from{opacity:0}to{opacity:1}}@keyframes _ybUp{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}';
    document.head.appendChild(s);
  }
  function openModal(actId){
    if(document.getElementById('_yb_ov'))return;
    _ybStyle();
    var ov=document.createElement('div');
    ov.id='_yb_ov';
    ov.setAttribute('style','position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100%!important;z-index:2147483647!important;background:rgba(2,6,23,0.82);display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:16px;animation:_ybIn .2s ease;');
    var wrap=document.createElement('div');
    wrap.setAttribute('style','position:relative;width:min(100%,1180px);height:min(calc(100vh - 32px),920px);animation:_ybUp .28s cubic-bezier(.22,1,.36,1);');
    var box=document.createElement('div');
    box.setAttribute('style','width:100%;height:100%;border-radius:20px;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,0.55);');
    var fr=document.createElement('iframe');
    var _src=new URL(WIDGET_URL);
    if(actId)_src.searchParams.set('activity',actId);
    _src.searchParams.set('return_url',location.href);
    fr.src=_src.toString();
    fr.allow='payment';
    fr.setAttribute('allowfullscreen','');
    fr.setAttribute('style','width:100%;height:100%;border:none;display:block;background:#fff;');
    function close(){
      var o=document.getElementById('_yb_ov');if(!o)return;
      o.style.animation='_ybIn .16s ease reverse forwards';
      setTimeout(function(){if(o&&o.parentNode)o.parentNode.removeChild(o);},160);
    }
    ov.onclick=function(e){if(e.target===ov)close();};
    document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',esc);}});
    window.addEventListener('message',function(e){if(e.data&&e.data.type==='yetti-close-modal')close();});
    box.appendChild(fr);wrap.appendChild(box);ov.appendChild(wrap);document.body.appendChild(ov);
  }
  document.addEventListener('click',function(e){
    var btn=e.target.closest?e.target.closest('[data-yetti-activity]'):null;
    if(btn){e.preventDefault();openModal(btn.getAttribute('data-yetti-activity'));return;}
    var a=e.target.closest?e.target.closest('a[href*="yetti-modal=true"]'):null;
    if(a){e.preventDefault();try{var u=new URL(a.href,location.href);openModal(u.searchParams.get('activity')||'');}catch(_){location.href=a.href;}return;}
  },true);
  window.YettiBooking={open:openModal};
})();
`;

export function YettiBookingScript() {
  return (
    <script
      id="yetti-booking-script"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: YETTI_BOOKING_SCRIPT }}
    />
  );
}
