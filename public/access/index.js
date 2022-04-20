!function(){"use strict";function e(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}function t(t,n){var a="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!a){if(Array.isArray(t)||(a=function(t,n){if(t){if("string"==typeof t)return e(t,n);var a=Object.prototype.toString.call(t).slice(8,-1);return"Object"===a&&t.constructor&&(a=t.constructor.name),"Map"===a||"Set"===a?Array.from(t):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?e(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){a&&(t=a);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,c=!0,l=!1;return{s:function(){a=a.call(t)},n:function(){var e=a.next();return c=e.done,e},e:function(e){l=!0,s=e},f:function(){try{c||null==a.return||a.return()}finally{if(l)throw s}}}}const n=()=>{let e=document.querySelector(".loader");e&&(e.style.display="none")},a=e=>{let t=new URLSearchParams(window.location.search),n=t.get("sid")?t.get("sid"):"",a=-1==e.indexOf("?")?"?sid="+n:"&sid="+n;return e+a},r=()=>{let e=new URLSearchParams(window.location.search);return e.get("sid")?e.get("sid"):""},o=e=>{let t=e+"=",n=decodeURIComponent(document.cookie).split(";");for(let e=0;e<n.length;e++){let a=n[e];for(;" "==a.charAt(0);)a=a.substring(1);if(0==a.indexOf(t))return a.substring(t.length,a.length)}return""},s={Accept:"application/json","Content-Type":"application/json",Authorization:"Bearer "+o("kenzap_api_key"),"Kenzap-Locale":o("locale")?o("locale"):"en","Kenzap-Header":localStorage.hasOwnProperty("header")&&localStorage.hasOwnProperty("header-version")?localStorage.getItem("header-version"):0,"Kenzap-Token":o("kenzap_token"),"Kenzap-Sid":r()},c=e=>{if(console.log(e),isNaN(e.code)){let t=e;try{t=JSON.stringify(t)}catch(e){}let n=new URLSearchParams;return n.append("cmd","report"),n.append("sid",r()),n.append("token",o("kenzap_token")),n.append("data",t),fetch("https://api-v1.kenzap.cloud/error/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:n}),void alert("Can not connect to Kenzap Cloud")}if(401===e.code){if(-1!=window.location.href.indexOf("localhost"))return void alert(e.reason);location.href="https://auth.kenzap.com/?app=65432108792785&redirect="+window.location.href}else alert(e.reason)},l=(e,t)=>{if(document.querySelector(e))for(let n of document.querySelectorAll(e))n.removeEventListener("click",t,!0),n.addEventListener("click",t,!0)};var i={state:{firstLoad:!0,ajaxQueue:0,dataAPI:null,data:null},init:function(){i.getData(),i.getAPIData()},getAPIData:function(){var e=new URLSearchParams;e.append("cmd","get_site_users"),e.append("id",r()),e.append("token",o("kenzap_token")),fetch("https://siteapi.kenzap.cloud/v1/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:e}).then((function(e){return e.json()})).then((function(e){n(),e.success?(i.state.dataAPI=e,i.startRender()):c(e)})).catch((function(e){c(e)}))},getData:function(){i.state.firstLoad&&(()=>{let e=document.querySelector(".loader");e&&(e.style.display="block")})(),fetch("https://api-v1.kenzap.cloud/",{method:"post",headers:s,body:JSON.stringify({query:{user:{type:"authenticate",fields:["avatar"],token:o("kenzap_token")},locale:{type:"locale",source:["extension"],key:"dashboard"}}})}).then((function(e){return e.json()})).then((function(e){i.state.data=e,n(),e.success?((e=>{if(e.header&&localStorage.setItem("header",e.header),!document.querySelector("#k-script")){let e=document.createElement("div");e.innerHTML=localStorage.getItem("header"),e=e.firstChild,document.body.prepend(e),Function(document.querySelector("#k-script").innerHTML).call("test")}e.locale&&window.i18n.init(e.locale)})(e),i.startRender()):c(e)})).catch((function(e){c(e)}))},startRender:function(){null!=i.state.data&&null!=i.state.dataAPI&&(i.loadPageStructure(),i.renderPage(i.state.data),i.initListeners(),i.initFooter(),i.state.firstLoad=!1)},renderPage:function(e){var n=document;(e=>{let t='<ol class="breadcrumb mt-2 mb-0">';for(let n of e)void 0===n.link?t+=`<li class="breadcrumb-item">${n.text}</li>`:t+=`<li class="breadcrumb-item"><a href="${n.link}">${n.text}</a></li>`;t+="</ol>",document.querySelector(".bc").innerHTML=t})([{link:a("/"),text:__("Dashboard")},{text:__("Users & API key")}]);var r,o="",s=t(i.state.dataAPI.keys);try{for(s.s();!(r=s.n()).done;){var c=r.value;o+=i.rowKeysStruct(c)}}catch(e){s.e(e)}finally{s.f()}n.querySelector(".list-keys").innerHTML=""==o?'<tr><td colspan="2">'.concat(__("No API keys to display."),"</td></tr>"):o;var l="";for(var d in i.state.dataAPI.users)l+=i.rowUserStruct(i.state.dataAPI.kid,i.state.dataAPI.users[d]);0==i.state.dataAPI.users.length?n.querySelector(".list").innerHTML='<tr><td colspan="5">'.concat(__("No users to display."),"</td></tr>"):n.querySelector(".list").innerHTML=l},rowUserStruct:function(e,t){var n=new Image;return n.onload=function(){document.querySelector("#img"+this.kid).setAttribute("src",this.src)},n.kid=t.kid,n.src="https://kenzap.b-cdn.net/150/a"+t.kid+"_1.jpeg",'\n        <tr data-sec="0" >\n            <td>\n                <b>'.concat(t.kid,'</b>\n            </td>\n            <td class="name">\n                <div class="object-img">\n                    <img id=\'img').concat(t.kid,'\' src="https://account.kenzap.com/images/default_avatar.jpg" alt="user avatar">\n                </div>\n                <b>').concat(t.name,"</b>\n            </td>\n            <td>\n                <b>").concat(i.getType(t.role),'</b>\n            </td>\n            <td>\n                <div class="d2 d-flex justify-content-end">\n                    <a href="javascript:void(0);" onclick="javascript:;" >\n                        <svg xmlns="http://www.w3.org/2000/svg" data-kid=\'').concat(t.kid,'\' width="16" height="16" fill="currentColor" class="bi bi-trash text-danger edit-user d-none" viewBox="0 0 16 16">\n                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>\n                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>\n                        </svg>\n                    </a>\n                    <a href="javascript:void(0);" onclick="javascript:;" >\n                        <svg xmlns="http://www.w3.org/2000/svg" style="').concat(parseInt(t.kid)==parseInt(e)?"display:none;":"","\"  data-kid='").concat(t.kid,'\' width="16" height="16" fill="currentColor" class="bi bi-trash text-danger remove-user" viewBox="0 0 16 16">\n                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>\n                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>\n                        </svg>\n                    </a>\n                </div>\n            </td>\n        </tr>')},rowKeysStruct:function(e){return'\n        <tr data-sec="0" >\n            <td>\n                <div style="font-size:12px;">'.concat(e.token,'</div>\n                <div>\n                    <div title="API key" class="badge bg-light text-dark fw-light">').concat(1==e.type?__("Frontend"):__("Backend"),'</div>\n                    <div title="API key" class="badge bg-light text-dark fw-light">').concat(1==e.perm?__("Read only"):__("Read & write"),'</div>\n                    <div title="API key" class="badge bg-light text-dark fw-light">').concat(1==e.iso?__("Isolated"):__("Non isolated"),'</div>\n        \n                </div>\n            </td>\n            <td>\n                <div class="d2 d-flex justify-content-end">\n                    <a href="javascript:void(0);" onclick="javascript:;" >\n                        <svg xmlns="http://www.w3.org/2000/svg" data-id=\'').concat(e.id,'\' width="16" height="16" fill="currentColor" data-id="').concat(e.id,'" class="bi bi-trash text-danger rem-key" viewBox="0 0 16 16">\n                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>\n                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>\n                        </svg>\n                    </a>\n                </div>\n            </td>\n        </tr>')},getType:function(e){var t="";switch(e){case"admin":t='<div title="Administrator" class="badge bg-danger fw-light">Administrator</div>';break;case"editor":t='<div title="Editor" class="badge bg-primary fw-light">Editor</div>';break;case"viewer":t='<div title="Viewer" class="badge bg-success fw-light">Viewer</div>';break;case"isolated":t='<div title="Isolated" class="badge bg-success fw-light">Isolated</div>'}return t},initListeners:function(){l(".remove-user",i.listeners.removeUser),l(".rem-key",i.listeners.removeKey),i.state.firstLoad&&(l(".btn-add-user",i.listeners.addUser),l(".btn-add-key",i.listeners.addKey),l(".btn-remove-space",i.listeners.removeSpace),l(".btn-rename-space",i.listeners.renameSpace),l(".btn-add-space",i.listeners.addSpace),l(".btn-modal",i.listeners.modalSuccessBtn))},listeners:{addUser:function(){var e=document.querySelector(".modal"),t=new bootstrap.Modal(e);e.querySelector(".modal-title").innerHTML=__("Add User"),e.querySelector(".btn-primary").innerHTML=__("Add"),e.querySelector(".btn-primary").classList.remove("btn-danger"),e.querySelector(".btn-secondary").innerHTML=__("Cancel");var n='\n            <div class="form-cont">\n                <div class="form-group">\n                    <label for="uid" class="form-label">'.concat(__("User ID"),'</label>\n                    <input type="text" class="form-control" id="uid" autocomplete="off" placeholder="100000590923">\n                    <p class="form-text">').concat(__("User ID can be found under")," <b>").concat(__("My Account &gt; My Profile</b> section."),'</p>\n                </div>\n                <div class="form-group">\n                    <label for="ptitle" class="form-label">User Role</label>\n                    <div class="form-check">\n                        <label class="form-check-label">\n                        <input type="radio" class="form-check-input" name="optionsRadios" id="radio_1" value="admin" checked="checked">\n                        ').concat(__("Administrator"),'\n                        <i class="input-helper"></i></label>\n                        <p class="form-text">').concat(__("Grants read, write permissions to data stored in this space. Allows API keys and user management."),'</p>\n                    </div>\n                    <div class="form-check">\n                        <label class="form-check-label" class="form-label">\n                        <input type="radio" class="form-check-input" name="optionsRadios" id="radio_2" value="editor">\n                        ').concat(__("Editor"),'\n                        <i class="input-helper"></i></label>\n                        <p class="form-text">').concat(__("Grants read, write permissions to data stored in this space."),'</p>\n                    </div>\n                    <div class="form-check">\n                        <label class="form-check-label" class="form-label">\n                        <input type="radio" class="form-check-input" name="optionsRadios" id="radio_3" value="viewer">\n                        ').concat(__("Viewer"),'\n                        <i class="input-helper"></i></label>\n                        <p class="form-text">').concat(__("Grants read permissions to data stored in this space."),'</p>\n                    </div>\n                    <div class="form-check">\n                        <label class="form-check-label" class="form-label">\n                        <input type="radio" class="form-check-input" name="optionsRadios" id="radio_4" value="isolated">\n                        ').concat(__("Isolated"),'\n                        <i class="input-helper"></i></label>\n                        <p class="form-text">').concat(__("Grants read, write permissions to data stored by this user. Provides no access to other data stored in this space."),"</p>\n                    </div>\n                </div>\n            </div>\n            ");e.querySelector(".modal-body").innerHTML=n,i.listeners.modalSuccessBtnFunc=function(n){if(n.preventDefault(),"true"!==e.querySelector(".btn-primary").dataset.loading){e.querySelector(".btn-primary").dataset.loading=!0,e.querySelector(".btn-primary").innerHTML='<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>'+__("Loading..");var a=e.querySelector("#uid").value,s=e.querySelector(".modal.show input[type='radio']:checked").value;if(a.length<2)return alert(__("Please provide longer user ID.")),!1;var l=new URLSearchParams;l.append("cmd","add_site_user"),l.append("id",r()),l.append("uid",a),l.append("role",s),l.append("token",o("kenzap_token")),fetch("https://siteapi.kenzap.cloud/v1/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:l}).then((function(e){return e.json()})).then((function(n){e.querySelector(".btn-primary").dataset.loading=!1,n.success?(i.getAPIData(),t.hide()):c(n)})).catch((function(e){c(e)}))}},t.show(),setTimeout((function(){return e.querySelector("#uid").focus()}),100)},removeUser:function(e){e.preventDefault();var t=e.currentTarget.dataset.kid;if(confirm(__("Remove this user?"))){var n=new URLSearchParams;n.append("cmd","remove_site_user"),n.append("id",r()),n.append("kid",t),n.append("token",o("kenzap_token")),fetch("https://siteapi.kenzap.cloud/v1/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:n}).then((function(e){return e.json()})).then((function(e){e.success?i.getAPIData():c(e)})).catch((function(e){c(e)}))}},removeKey:function(e){if(e.preventDefault(),confirm(__("Remove this key?"))){var t=new URLSearchParams;t.append("cmd","remove_cloud_api_key"),t.append("sid",r()),t.append("id",e.currentTarget.dataset.id),t.append("token",o("kenzap_token")),fetch("https://siteapi.kenzap.cloud/v1/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:t}).then((function(e){return e.json()})).then((function(e){e.success?i.getAPIData():c(e)})).catch((function(e){c(e)}))}},addKey:function(){var e=document.querySelector(".modal"),t=new bootstrap.Modal(e);e.querySelector(".modal-title").innerHTML=__("New API Key"),e.querySelector(".btn-primary").innerHTML=__("Create"),e.querySelector(".btn-primary").classList.remove("btn-danger"),e.querySelector(".btn-secondary").innerHTML=__("Cancel");var n='\n            <div class="form-cont">\n                <div class="form-group">\n\n                    <label for="ptitle" class="form-label">'.concat(__("Access type"),'</label>\n                    <div class="form-check">\n                        <label class="form-check-label">\n                        <input type="radio" class="form-check-input" name="key-type" id="radio_1" value="1" checked="checked">\n                        ').concat(__("Frontend"),'\n                        <i class="input-helper"></i></label>\n                        <p class="form-text">').concat(__("Allow signed in users access this cloud space data."),'</p>\n                    </div>\n                    <div class="form-check">\n                        <label class="form-check-label" class="form-label">\n                        <input type="radio" class="form-check-input text-warning" name="key-type" id="radio_2" value="2" >\n                        ').concat(__("Backend"),'\n                        <i class="input-helper"></i></label>\n                        <p class="form-text">').concat(__("Allow API data access. Does not require user sign in. Never use backend keys for frontend queries."),'</p>\n                    </div>\n\n                    <label for="ptitle" class="form-label">').concat(__("Permissions"),'</label>\n                    <div class="form-check">\n                        <label class="form-check-label" class="form-label">\n                        <input type="radio" class="form-check-input" name="key-perm" id="radio_3" value="1" checked="checked">\n                        ').concat(__("Read only"),'\n                        <i class="input-helper"></i></label>\n                        <p class="form-text">').concat(__("Grants read permissions to data stored in this space."),'</p>\n                    </div>\n                    <div class="form-check">\n                        <label class="form-check-label" class="form-label">\n                        <input type="radio" class="form-check-input" name="key-perm" id="radio_4" value="2">\n                        ').concat(__("Read & write"),'\n                        <i class="input-helper"></i></label>\n                        <p class="form-text">').concat(__("Grants read and write permissions to data stored in this space."),'</p>\n                    </div>\n\n                    <label for="ptitle" class="form-label">').concat(__("Isolated"),'</label>\n                    <div class="form-check">\n                        <label class="form-check-label" class="form-label">\n                        <input type="radio" class="form-check-input" name="key-iso" id="radio_4" value="1" checked="checked">\n                        ').concat(__("Yes"),'\n                        <i class="input-helper"></i></label>\n                        <p class="form-text">').concat(__("Can only access data generated by same API key or user."),'</p>\n                    </div>\n                    <div class="form-check">\n                        <label class="form-check-label" class="form-label">\n                        <input type="radio" class="form-check-input" name="key-iso" id="radio_5" value="2">\n                        ').concat(__("No"),'\n                        <i class="input-helper"></i></label>\n                        <p class="form-text">').concat(__("Can access any data in this space."),"</p>\n                    </div>\n                </div>\n            </div>\n            ");e.querySelector(".modal-body").innerHTML=n,i.listeners.modalSuccessBtnFunc=function(n){if(n.preventDefault(),"true"!==e.querySelector(".btn-primary").dataset.loading){e.querySelector(".btn-primary").dataset.loading=!0,e.querySelector(".btn-primary").innerHTML='<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>'+__("Loading..");var a=e.querySelector(".modal.show input[name='key-type']:checked").value,s=e.querySelector(".modal.show input[name='key-perm']:checked").value,l=e.querySelector(".modal.show input[name='key-iso']:checked").value,d=new URLSearchParams;d.append("cmd","add_cloud_api_key"),d.append("id",r()),d.append("type",a),d.append("perm",s),d.append("iso",l),d.append("token",o("kenzap_token")),fetch("https://siteapi.kenzap.cloud/v1/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:d}).then((function(e){return e.json()})).then((function(n){e.querySelector(".btn-primary").dataset.loading=!1,n.success?(i.getAPIData(),t.hide()):c(n)})).catch((function(e){c(e)}))}},t.show()},removeSpace:function(e){var t=document.querySelector(".modal"),n=new bootstrap.Modal(t);t.querySelector(".modal-title").innerHTML=__("Remove cloud space #"+r()+"?"),t.querySelector(".btn-primary").innerHTML=__("Confirm"),t.querySelector(".btn-primary").classList.add("btn-danger"),t.querySelector(".btn-secondary").innerHTML=__("Cancel");var a='\n            <div class="form-cont">\n                <div class="form-group d-none">\n                    <label for="uid" class="form-label">'.concat(__("User ID"),'</label>\n                    <input type="text" class="form-control" id="uid" autocomplete="off" placeholder="100000590923">\n                    <p class="form-text">').concat(__("User ID can be found under")," <b>").concat(__("My Account &gt; My Profile</b> section."),'</p>\n                </div>\n                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-exclamation-circle text-danger mb-3" viewBox="0 0 16 16">\n                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>\n                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>\n                </svg>\n                <p>').concat(__("After this operation <b>all cloud stored data</b>, translations, saved extensions, API keys and user access rules will be entirely removed from Kenzap servers.</p><p>Please confirm to continue.</p>"),"</p>\n            </div>");t.querySelector(".modal-body").innerHTML=a,i.listeners.modalSuccessBtnFunc=function(e){e.preventDefault();var n=new URLSearchParams;n.append("cmd","remove_cloud_space"),n.append("id",r()),n.append("token",o("kenzap_token")),fetch("https://siteapi.kenzap.cloud/v1/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:n}).then((function(e){return e.json()})).then((function(e){t.querySelector(".btn-primary").dataset.loading=!1,e.success?(localStorage.removeItem("header-version",""),location.reload()):c(e)})).catch((function(e){c(e)}))},n.show()},addSpace:function(e){var t=document.querySelector(".modal"),n=new bootstrap.Modal(t);t.querySelector(".modal-title").innerHTML=__("Create new cloud space"),t.querySelector(".btn-primary").innerHTML=__("Create"),t.querySelector(".btn-primary").classList.remove("btn-danger"),t.querySelector(".btn-secondary").innerHTML=__("Cancel");var a='\n            <div class="form-cont">\n                <div class="form-group">\n                    <label for="s-name" class="form-label">'.concat(__("Space name"),'</label>\n                    <input type="text" class="form-control" id="s-name" autocomplete="off" value="">\n                    <p class="form-text">').concat(__("New cloud space name"),'</p>\n                </div>\n                <div class="form-group">\n                    <label for="s-desc" class="form-label">').concat(__("Description (optional)"),'</label>\n                    <textarea type="text" class="form-control" id="s-desc" autocomplete="off" rows="2" placeholder=""></textarea>\n                    <p class="form-text">').concat(__("Short cloud space description"),"</p>\n                </div>\n            </div>");t.querySelector(".modal-body").innerHTML=a,i.listeners.modalSuccessBtnFunc=function(e){e.preventDefault();var n=document.querySelector("#s-name").value,a=document.querySelector("#s-desc").value;if(n.length<5)alert(__("Please provide a longer name"));else{var s=new URLSearchParams;s.append("cmd","new_cloud_space"),s.append("id",r()),s.append("title",n),s.append("desc",a),s.append("token",o("kenzap_token")),fetch("https://siteapi.kenzap.cloud/v1/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:s}).then((function(e){return e.json()})).then((function(e){t.querySelector(".btn-primary").dataset.loading=!1,e.success?(localStorage.removeItem("header-version",""),location.reload()):c(e)})).catch((function(e){c(e)}))}},n.show()},renameSpace:function(e){var t=document.querySelector(".modal"),n=new bootstrap.Modal(t);t.querySelector(".modal-title").innerHTML=__("Rename cloud space #"+r()+"?"),t.querySelector(".btn-primary").innerHTML=__("Rename"),t.querySelector(".btn-primary").classList.remove("btn-danger"),t.querySelector(".btn-secondary").innerHTML=__("Cancel");var a='\n            <div class="form-cont">\n                <div class="form-group">\n                    <label for="current-name" class="form-label">'.concat(__("Current name"),'</label>\n                    <input type="text" class="form-control border-0" id="current-name" disabled="true" autocomplete="off" value="').concat(document.querySelector("#spaceSelect").innerHTML,'">\n                    <p class="form-text">').concat(__("Current cloud space name"),'</p>\n                </div>\n                <div class="form-group">\n                    <label for="new-name" class="form-label">').concat(__("New name"),'</label>\n                    <input type="text" class="form-control" id="new-name" autocomplete="off" placeholder="My Space">\n                    <p class="form-text">').concat(__("New cloud space name"),"</p>\n                </div>\n            </div>");t.querySelector(".modal-body").innerHTML=a,i.listeners.modalSuccessBtnFunc=function(e){e.preventDefault();var n=document.querySelector("#new-name").value;if(n.length<5)alert(__("Please provide a longer name"));else{var a=new URLSearchParams;a.append("cmd","rename_cloud_space"),a.append("id",r()),a.append("title",n),a.append("token",o("kenzap_token")),fetch("https://siteapi.kenzap.cloud/v1/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:a}).then((function(e){return e.json()})).then((function(e){t.querySelector(".btn-primary").dataset.loading=!1,e.success?(localStorage.removeItem("header-version",""),location.reload()):c(e)})).catch((function(e){c(e)}))}},n.show()},modalSuccessBtn:function(e){i.listeners.modalSuccessBtnFunc(e)},modalSuccessBtnFunc:null},loadPageStructure:function(){i.state.firstLoad&&(document.querySelector("#contents").innerHTML=function(e){return'\n    <div class="container">\n        <div class="d-flex justify-content-between bd-highlight mb-3">\n            <nav class="bc" aria-label="breadcrumb"></nav>\n            <div class="ms-2 dropdown">\n              <button class="btn btn btn-outline-primary dropdown-toggle  h-space" type="button" id="accessOptions" data-bs-toggle="dropdown" aria-expanded="false" >'.concat(e("Options"),'</button>\n              <ul class="dropdown-menu accessOptionsList" aria-labelledby="accessOptions">\n                <li><a class="dropdown-item btn-add-user" href="#">').concat(e("Add user"),'</a></li>\n                <li><a class="dropdown-item btn-add-key" href="#">').concat(e("Add API Key"),'</a></li>\n                <li><a class="dropdown-item btn-add-space" href="#">').concat(e("New space"),'</a></li>\n   \n                <li><hr class="dropdown-divider"></li>\n                <li><a class="dropdown-item btn-rename-space" href="#">').concat(e("Space name"),'</a></li>\n                <li><a class="dropdown-item text-danger btn-remove-space" href="#">').concat(e("Remove space"),'</a></li></ul>\n            </div>\n            <button class="btn btn-primary btn-add d-none" type="button">').concat(e("Add user"),'</button>\n        </div> \n        \n        <div class="row">\n            <div class="col-lg-7 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card">\n              <div class="card border-white shadow-sm br">\n                <div class="card-body">\n                  <h4 class="card-title mb-4">').concat(e("Users"),'</h4>\n                  <div class="table-responsive table-nav">\n                    <table class="table table-hover table-borderless align-middle table-striped table-p-list" style="min-width:600px;">\n                      <thead>\n                        <tr>\n                          <th>').concat(e("ID"),"</th>\n                          <th>").concat(e("Name"),"</th>\n                          <th>").concat(e("Rights"),'</th>\n                          <th></th>\n                        </tr>\n                      </thead>\n                      <tbody class="list">\n\n                      </tbody>\n                    </table>\n                  </div>\n                </div>\n              </div>\n            </div>\n            <div class="col-lg-5 mt-4 mt-lg-0 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card">\n              <div class="card border-white shadow-sm br">\n                <div class="card-body">\n                  <h4 class="card-title mb-4">').concat(e("API Keys"),'</h4>\n                  <div class="table-responsive table-nav">\n                    <table class="table table-hover table-borderless align-middle table-striped table-p-list">\n                      <thead>\n                        <tr>\n                          <th>').concat(e("Key"),'</th>\n                          <th></th>\n                        </tr>\n                      </thead>\n                      <tbody class="list-keys">\n\n                      </tbody>\n                    </table>\n                  </div>\n                </div>\n              </div>\n            </div>\n        </div>\n    </div>\n\n    <div class="modal" tabindex="-1">\n        <div class="modal-dialog">\n            <div class="modal-content">\n                <div class="modal-header">\n                    <h5 class="modal-title"></h5>\n                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>\n                </div>\n                <div class="modal-body">\n\n                </div>\n                <div class="modal-footer">\n                    <button type="button" class="btn btn-primary btn-modal"></button>\n                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"></button>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class="position-fixed bottom-0 p-2 m-4 end-0 align-items-center">\n        <div class="toast hide align-items-center text-white bg-dark border-0" role="alert" aria-live="assertive"\n            aria-atomic="true" data-bs-delay="3000">\n            <div class="d-flex">\n                <div class="toast-body"></div>\n                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"\n                    aria-label="Close"></button>\n            </div>\n        </div>\n    </div>\n    ')}(__))},initFooter:function(){var e,t;e=__("Created by %1$Kenzap%2$. ❤️ Licensed %3$GPL3%4$.",'<a class="text-muted" href="https://kenzap.com/" target="_blank">',"</a>",'<a class="text-muted" href="https://github.com/kenzap/dashboard" target="_blank">',"</a>"),t="",document.querySelector("footer .row").innerHTML=`\n    <div class="d-sm-flex justify-content-center justify-content-sm-between">\n        <span class="text-muted text-center text-sm-left d-block d-sm-inline-block">${e}</span>\n        <span class="float-none float-sm-right d-block mt-1 mt-sm-0 text-center text-muted">${t}</span>\n    </div>`}};i.init()}();
