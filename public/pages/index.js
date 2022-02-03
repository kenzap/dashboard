!function(){"use strict";function e(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,n=new Array(t);a<t;a++)n[a]=e[a];return n}function t(t,a){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,a){if(t){if("string"==typeof t)return e(t,a);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?e(t,a):void 0}}(t))||a&&t&&"number"==typeof t.length){n&&(t=n);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,i=!0,c=!1;return{s:function(){n=n.call(t)},n:function(){var e=n.next();return i=e.done,e},e:function(e){c=!0,s=e},f:function(){try{i||null==n.return||n.return()}finally{if(c)throw s}}}}var a=function(){var e=new URLSearchParams(window.location.search);return e.get("sid")?e.get("sid"):""},n=function(e){for(var t=e+"=",a=decodeURIComponent(document.cookie).split(";"),n=0;n<a.length;n++){for(var r=a[n];" "==r.charAt(0);)r=r.substring(1);if(0==r.indexOf(t))return r.substring(t.length,r.length)}return""},r=function(e){if(401===e.code)-1!=window.location.href.indexOf("localhost")?alert("Please update user token"):location.href="https://auth.kenzap.com/?app=65432108792785&redirect="+window.location.href;else alert(e.reason)},o=function(e,a){if(document.querySelector(e)){var n,r=t(document.querySelectorAll(e));try{for(r.s();!(n=r.n()).done;){var o=n.value;o.removeEventListener("click",a,!0),o.addEventListener("click",a,!0)}}catch(e){r.e(e)}finally{r.f()}}},s=function(){var e=document.querySelector(".loader");e&&(e.style.display="none")},i={state:{firstLoad:!0,ajaxQueue:0,dataAPI:null,data:null},init:function(){i.getData(),i.getAPIData()},getAPIData:function(){var e=new URLSearchParams;e.append("cmd","get_pages"),e.append("id",a()),e.append("source","production"),e.append("token",n("kenzap_token")),fetch("https://siteapi.kenzap.cloud/v1/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:e}).then((function(e){return e.json()})).then((function(e){s(),e.success?(i.state.dataAPI=e,i.startRender()):r(e)})).catch((function(e){console.error("Error:",e)}))},getData:function(){var e;i.state.firstLoad&&((e=document.querySelector(".loader"))&&(e.style.display="block")),fetch("https://api-v1.kenzap.cloud/",{method:"post",headers:{Accept:"application/json","Content-Type":"text/plain",Authorization:"Bearer "+n("kenzap_api_key"),"Kenzap-Header":localStorage.hasOwnProperty("header"),"Kenzap-Token":n("kenzap_token"),"Kenzap-Sid":a()},body:JSON.stringify({query:{user:{type:"authenticate",fields:["avatar"],token:n("kenzap_token")},locale:{type:"locale",id:n("lang")}}})}).then((function(e){return e.json()})).then((function(e){i.state.data=e,s(),e.success?(!function(e){e.header&&localStorage.setItem("header",e.header);var t=document.createElement("div");t.innerHTML=localStorage.getItem("header"),t=t.firstChild,document.body.prepend(t),Function(document.querySelector("#k-script").innerHTML).call("test"),window.i18n.init(e.locale)}(e),i.startRender()):r(e)})).catch((function(e){console.error("Error:",e)}))},startRender:function(){null!=i.state.data&&null!=i.state.dataAPI&&(i.loadPageStructure(),i.renderPage(i.state.data),i.initListeners(),i.initFooter(),i.state.firstLoad=!1)},renderPage:function(e){var a,n,r,o,s=document;!function(e){var a,n='<ol class="breadcrumb mt-2 mb-0">',r=t(e);try{for(r.s();!(a=r.n()).done;){var o=a.value;void 0===o.link?n+='<li class="breadcrumb-item">'.concat(o.text,"</li>"):n+='<li class="breadcrumb-item"><a href="'.concat(o.link,'">').concat(o.text,"</a></li>")}}catch(e){r.e(e)}finally{r.f()}n+="</ol>",document.querySelector(".bc").innerHTML=n}([{link:(a="/",n=new URLSearchParams(window.location.search),r=n.get("sid")?n.get("sid"):"",o=-1==a.indexOf("?")?"?sid="+r:"&sid="+r,a+o),text:__("Dashboard")},{text:__("Pages")}]),void 0!==i.state.dataAPI.keys&&(s.querySelector("#api-public").value=i.state.dataAPI.keys.public.token,s.querySelector("#api-restricted").value=i.state.dataAPI.keys.restricted.token,s.querySelector("#api-private").value=i.state.dataAPI.keys.private.token);var c="";for(var l in i.state.dataAPI.list)c+=i.rowStruct(l);0==i.state.dataAPI.list.length?s.querySelector(".list").innerHTML='<tr><td colspan="5">'.concat(__("No users to display. Please add one by clicking on the button below."),"</td></tr>"):s.querySelector(".list").innerHTML=c},rowStruct:function(e){return'\n        <tr>\n          <td class="destt" style="max-width:250px;min-width:250px;">\n            <div>\n              <a class="text-dark" href="/edit-page/?slug='.concat(i.state.dataAPI.list[e].key+"&sid="+a(),'" ><b>').concat(i.state.dataAPI.list[e].title,'</b><i style="color:#9b9b9b;font-size:15px;margin-left:8px;" title="Edit page" class="mdi mdi-pencil menu-icon edit-page"></i></a>\n            </div>\n          </td>\n          <td>\n            <span>').concat(i.getStatus(i.state.dataAPI.list[e].status),'</span>\n          </td>\n          <td class="">\n            <span>').concat(function(e,t){console.log(e+" "+t),e=parseInt(e),t=parseInt(t),console.log(e+" "+t);var a=e-t;if(a<60)return"moments ago";if(a<3600)return parseInt(a/60)+" minutes ago";if(a<86400)return parseInt(a/60/24)+" hours ago";var n=new Date(1e3*t),r=n.getFullYear(),o=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][n.getMonth()],s=n.getDate();return n.getHours(),n.getMinutes(),n.getSeconds(),s+" "+o+" "+r}(i.state.data.meta.time,i.state.dataAPI.list[e].time),'</span>\n          </td>\n          <td>\n            <div class="d-flex justify-content-end">\n                <svg xmlns="http://www.w3.org/2000/svg" data-kid=\'').concat(i.state.dataAPI.list[e].key,"' data-key=\"").concat(i.state.dataAPI.list[e].key,'" width="16" height="16" fill="currentColor" class="bi bi-trash set-home me-3 ').concat(i.state.dataAPI.list[e].key==i.state.dataAPI.home?"text-primary":"text-secondary",'" viewBox="0 0 16 16">\n                    <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"/>\n                </svg>\n                <svg xmlns="http://www.w3.org/2000/svg" data-kid=\'').concat(i.state.dataAPI.list[e].key,"' data-key=\"").concat(i.state.dataAPI.list[e].key,'" width="16" height="16" fill="currentColor" class="bi bi-trash text-danger remove-page" viewBox="0 0 16 16">\n                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>\n                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>\n                </svg>\n            </div>\n          </td>\n        </tr>')},getType:function(e){var t="";switch(e){case"admin":t='<div title="Administrator" class="badge bg-danger fw-light">Administrator</div>';break;case"editor":t='<div title="Editor" class="badge bg-primary fw-light">Editor</div>';break;case"viewer":t='<div title="Viewer" class="badge bg-success fw-light">Viewer</div>'}return t},initHeader:function(e){o(".nav-back",(function(e){e.preventDefault(),console.log(".nav-back");var t,a,n=document.querySelector(".bc ol li:nth-last-child(2)").querySelector("a");t=n,a=new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window}),t.dispatchEvent(a)}))},initListeners:function(){console.log("initListeners "),o(".remove-page",i.listeners.removePage),o(".set-home",i.listeners.setHome),i.state.firstLoad&&(o(".btn-add",i.listeners.addPage),o(".btn-modal",i.listeners.modalSuccessBtn))},listeners:{addPage:function(){var e=document.querySelector(".modal"),t=new bootstrap.Modal(e);e.querySelector(".modal-title").innerHTML=__("Add page"),e.querySelector(".btn-primary").innerHTML=__("Add"),e.querySelector(".btn-secondary").innerHTML=__("Cancel");var o='\n            <div class="form-cont">\n                <div class="form-group mb-3">\n                    <label for="ptitle" class="form-label">'.concat(__("Title"),'</label>\n                    <input type="text" class="form-control" id="ptitle" autocomplete="off" placeholder="').concat(__("About Us"),'">\n                </div>\n                <div class="form-group mb-3">\n                    <label for="pdesc" class="form-label">').concat(__("Description"),'</label>\n                    <textarea class="form-control" id="pdesc" rows="4" placeholder="').concat(__("Our company creates services for.."),'"></textarea>\n                </div>\n                <div class="form-group mb-3 d-none">\n                    <label for="ptemplate" class="form-label">').concat(__("Template (Optional)"),'</label>\n                    <input type="text" class="form-control" id="ptemplate" autocomplete="off" placeholder="universal">\n                </div>\n            </div>\n            ');e.querySelector(".modal-body").innerHTML=o,i.listeners.modalSuccessBtnFunc=function(o){if(o.preventDefault(),"true"!==e.querySelector(".btn-primary").dataset.loading){e.querySelector(".btn-primary").dataset.loading=!0,e.querySelector(".btn-primary").innerHTML='<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>'+__("Loading..");var s=e.querySelector("#ptitle").value,c=e.querySelector("#pdesc").value;if(s.length<2)return alert(__("Please provide a longer title.")),!1;var l=new URLSearchParams;l.append("cmd","create_page"),l.append("id",a()),l.append("t",s),l.append("d",c),l.append("template","universal"),l.append("token",n("kenzap_token")),fetch("https://siteapi.kenzap.cloud/v1/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:l}).then((function(e){return e.json()})).then((function(a){if(e.querySelector(".btn-primary").innerHTML=__("Add"),a.success){var n=new bootstrap.Toast(document.querySelector(".toast"));document.querySelector(".toast .toast-body").innerHTML=__("Page created"),n.show(),i.getAPIData(),e.querySelector(".btn-primary").dataset.loading=!1,t.hide()}else r(a);console.log("Success:",a)})).catch((function(e){console.error("Error:",e)}))}},t.show(),setTimeout((function(){return e.querySelector("#ptitle").focus()}),100)},removePage:function(e){e.preventDefault();var t=e.currentTarget.dataset.key;if(confirm(__("Remove this page?"))){var o=new URLSearchParams;o.append("cmd","remove_page"),o.append("id",a()),o.append("slug",t),o.append("token",n("kenzap_token")),fetch("https://siteapi.kenzap.cloud/v1/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:o}).then((function(e){return e.json()})).then((function(e){if(e.success){i.getAPIData();var t=new bootstrap.Toast(document.querySelector(".toast"));document.querySelector(".toast .toast-body").innerHTML=__("Page removed"),t.show()}else r(e);console.log("Success:",e)})).catch((function(e){console.error("Error:",e)}))}},setHome:function(e){e.preventDefault();var t=e.currentTarget.dataset.key;if(confirm(__("Set as home page?"))){var o=new URLSearchParams;o.append("cmd","set_homepage"),o.append("id",a()),o.append("key",t),o.append("token",n("kenzap_token")),fetch("https://siteapi.kenzap.cloud/v1/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:o}).then((function(e){return e.json()})).then((function(e){if(e.success){i.getAPIData();var t=new bootstrap.Toast(document.querySelector(".toast"));document.querySelector(".toast .toast-body").innerHTML=__("New home page is set up"),t.show()}else r(e);console.log("Success:",e)})).catch((function(e){console.error("Error:",e)}))}},modalSuccessBtn:function(e){i.listeners.modalSuccessBtnFunc(e)},modalSuccessBtnFunc:null},getStatus:function(e){switch(e=parseInt(e)){case 0:return'<div class="badge bg-warning">Draft</div>';case 1:return'<div class="badge bg-primary">Published</div>';case 3:return'<div class="badge bg-danger">Unpublished</div>';default:return'<div class="badge bg-warning text-dark">Drafts</div>'}},loadPageStructure:function(){i.state.firstLoad&&(document.querySelector("#contents").innerHTML=function(e){return'\n    <div class="container">\n      <div class="d-flex justify-content-between bd-highlight mb-3">\n          <nav class="bc" aria-label="breadcrumb"></nav>\n          <button class="btn btn-primary btn-add" type="button">'.concat(e("Add page"),'</button>\n      </div> \n      \n      <div class="row">\n\n        <div class="col-md-12 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card">\n          <div class="card border-white shadow-sm  br">\n            <div class="card-body">\n              <div class="table-responsive">\n                <table class="table table-hover table-borderless align-middle table-striped table-p-list">\n                  <thead>\n                    <tr>\n                      <th>').concat(e("Page"),"</th>\n                      <th>").concat(e("Status"),"</th>\n                      <th>").concat(e("Last update"),'</th>\n                      <th></th>\n                    </tr>\n                  </thead>\n                  <tbody class="list"> </tbody>\n                </table>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>    \n    </div>\n\n    <div class="modal" tabindex="-1">\n        <div class="modal-dialog">\n            <div class="modal-content">\n                <div class="modal-header">\n                    <h5 class="modal-title"></h5>\n                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>\n                </div>\n                <div class="modal-body">\n\n                </div>\n                <div class="modal-footer">\n                    <button type="button" class="btn btn-primary btn-modal"></button>\n                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"></button>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class="position-fixed bottom-0 p-2 m-4 end-0 align-items-center">\n        <div class="toast hide align-items-center text-white bg-dark border-0" role="alert" aria-live="assertive"\n            aria-atomic="true" data-bs-delay="3000">\n            <div class="d-flex">\n                <div class="toast-body"></div>\n                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"\n                    aria-label="Close"></button>\n            </div>\n        </div>\n    </div>\n    ')}(__))},initFooter:function(){var e,t;e=__("Copyright © "+(new Date).getFullYear()+' <a class="text-muted" href="https://kenzap.com/" target="_blank">Kenzap</a>. All rights reserved.'),t=__("Kenzap Cloud Services - Dashboard"),document.querySelector("footer .row").innerHTML='\n    <div class="d-sm-flex justify-content-center justify-content-sm-between">\n        <span class="text-muted text-center text-sm-left d-block d-sm-inline-block">'.concat(e,'</span>\n        <span class="float-none float-sm-right d-block mt-1 mt-sm-0 text-center text-muted">').concat(t,"</span>\n    </div>")}};i.init()}();
