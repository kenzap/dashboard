!function(){"use strict";function t(t,e){(null==e||e>t.length)&&(e=t.length);for(var a=0,n=new Array(e);a<e;a++)n[a]=t[a];return n}function e(e,a){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,a){if(e){if("string"==typeof e)return t(e,a);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?t(e,a):void 0}}(e))||a&&e&&"number"==typeof e.length){n&&(e=n);var s=0,i=function(){};return{s:i,n:function(){return s>=e.length?{done:!0}:{done:!1,value:e[s++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,c=!0,o=!1;return{s:function(){n=n.call(e)},n:function(){var t=n.next();return c=t.done,t},e:function(t){o=!0,r=t},f:function(){try{c||null==n.return||n.return()}finally{if(o)throw r}}}}var a=function(t){var e=new URLSearchParams(window.location.search),a=e.get("sid")?e.get("sid"):"",n=-1==t.indexOf("?")?"?sid="+a:"&sid="+a;return t+n},n=function(){var t=new URLSearchParams(window.location.search);return t.get("sid")?t.get("sid"):""},s=function(t){for(var e=t+"=",a=decodeURIComponent(document.cookie).split(";"),n=0;n<a.length;n++){for(var s=a[n];" "==s.charAt(0);)s=s.substring(1);if(0==s.indexOf(e))return s.substring(e.length,s.length)}return""},i=function(t,a){if(document.querySelector(t)){var n,s=e(document.querySelectorAll(t));try{for(s.s();!(n=s.n()).done;){var i=n.value;i.removeEventListener("click",a,!0),i.addEventListener("click",a,!0)}}catch(t){s.e(t)}finally{s.f()}}},r=function(t){var e=new bootstrap.Toast(document.querySelector(".toast"));document.querySelector(".toast .toast-body").innerHTML=t,e.show()},c={state:{firstLoad:!0,extLoad:!1,ajaxQueue:0,modalCont:null,ext_ids:null},init:function(){c.getData()},getData:function(){var t;c.state.firstLoad&&((t=document.querySelector(".loader"))&&(t.style.display="block")),fetch("https://api-v1.kenzap.cloud/",{method:"post",headers:{Accept:"application/json","Content-Type":"text/plain",Authorization:"Bearer "+s("kenzap_api_key"),"Kenzap-Header":localStorage.hasOwnProperty("header"),"Kenzap-Token":s("kenzap_token"),"Kenzap-Sid":n()},body:JSON.stringify({query:{user:{type:"authenticate",fields:["avatar"],token:s("kenzap_token")},locale:{type:"locale",id:s("lang")},dashboard:{type:"dashboard"}}})}).then((function(t){return t.json()})).then((function(t){var e;!function(){var t=document.querySelector(".loader");t&&(t.style.display="none")}(),t.success?(!function(t){if(t.header&&localStorage.setItem("header",t.header),!document.querySelector("#k-script")){var e=document.createElement("div");e.innerHTML=localStorage.getItem("header"),e=e.firstChild,document.body.prepend(e),Function(document.querySelector("#k-script").innerHTML).call("test")}t.locale&&window.i18n.init(t.locale)}(t),c.loadHomeStructure(),c.renderPage(t),c.checkLauncher(),c.initListeners(),c.initFooter(),c.state.firstLoad=!1):401===(e=t).code?-1!=window.location.href.indexOf("localhost")?alert("Please update user token"):location.href="https://auth.kenzap.com/?app=65432108792785&redirect="+window.location.href:alert(e.reason)})).catch((function(t){console.error("Error:",t)}))},renderPage:function(t){var a=document,s="";c.state.ext_ids=t.dashboard.ext_ids,t.dashboard.ext_ids&&t.dashboard.ext_ids.forEach((function(e){t.dashboard.extensions[e].links&&t.dashboard.extensions[e].links.forEach((function(a){var i="";a.links.forEach((function(a){i+='<a class="mt-2 me-2 text-md-tight" href="'.concat(t.dashboard.extensions[e].domain?"https://"+t.dashboard.extensions[e].domain+".kenzap.cloud"+a.slug:a.slug,"?sid=").concat(n(),'" data-ext="pages">').concat(a.text,"</a>")}));var r;r=a.icon,s+='\n                <div class="col-lg-4 grid-margin stretch-card mb-4">\n                    <div class="card border-white shadow-sm p-sm-2 anm br" data-ext="'.concat(e,'">\n                        <div class="card-body">\n                            <div class="d-flex flex-row">\n                            ').concat(r,'\n                            <div class="mr-4 mr-md-0 mr-lg-4 text-left text-lg-left">\n                                <h5 class="card-title mb-0">').concat(a.title,' <button type="button" data-id="').concat(e,'" class="d-none btn-close float-end fs-6 rm-ext" ></button></h5>\n                                <p class="card-description mt-1 mb-0">').concat(a.description,'</p>\n                                <div class="link-group">\n                                    ').concat(i,"\n                                </div>\n                            </div>\n                            </div>                  \n                        </div>\n                    </div>\n                </div>")}))})),s+='\n        <div class="col-lg-4 grid-margin stretch-card mb-4">\n            <div class="add-card border-white p-sm-2 anm br" data-ext="">\n                <div class="card-body">\n                    <div class="d-flex flex-row justify-content-center">\n                        <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" fill="currentColor" style="color:#ccc;" class="bi bi-plus-circle justify-content-center p-3" viewBox="0 0 16 16">\n                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>\n                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>\n                        </svg>\n                    </div>                  \n                </div>\n            </div>\n        </div>',a.querySelector(".dash-menu .row").innerHTML=s,function(t){var a,n='<ol class="breadcrumb mt-2 mb-0">',s=e(t);try{for(s.s();!(a=s.n()).done;){var i=a.value;void 0===i.link?n+='<li class="breadcrumb-item">'.concat(i.text,"</li>"):n+='<li class="breadcrumb-item"><a href="'.concat(i.link,'">').concat(i.text,"</a></li>")}}catch(t){s.e(t)}finally{s.f()}n+="</ol>",document.querySelector(".bc").innerHTML=n}([{text:__("Dashboard")}])},initListeners:function(){i(".link-group a",c.listeners.blockClick),i(".add-card",c.listeners.blockAddClick),i(".rm-ext",c.listeners.blockRemoveClick)},listeners:{blockClick:function(t){},blockAddClick:function(t){var a=document.querySelector(".modal");c.state.modalCont=new bootstrap.Modal(a),a.querySelector(".modal-dialog").style.maxWidth="700px";a.querySelector(".modal-title").innerHTML=__("Add extension"),a.querySelector(".btn-primary").style.display="none",a.querySelector(".btn-secondary").innerHTML=__("Cancel");var n=new URLSearchParams;n.append("cmd","preview_extensions"),n.append("s",""),n.append("token",s("kenzap_token")),fetch("https://siteapi.kenzap.cloud/v1/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:n}).then((function(t){return t.json()})).then((function(t){if(t.success){var n="",s=0;n+='<div class="row">';var o,d=e(t.res);try{for(d.s();!(o=d.n()).done;){var l=o.value;n+='<div class="col-md-6" style="margin:16px 0;">',n+="<h4>"+l.extra.title,n+='<div class="br-wrapper br-theme-css-stars"><select id="profile-rating" name="rating" autocomplete="off" style="display: none;"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select><div class="br-widget"><a href="#" data-rating-value="1" data-rating-text="1" class="br-selected"></a><a href="#" data-rating-value="2" data-rating-text="2" class="br-selected"></a><a href="#" data-rating-value="3" data-rating-text="3" class="br-selected"></a><a href="#" data-rating-value="4" data-rating-text="4" class="br-selected"></a><a href="#" data-rating-value="5" data-rating-text="5" class="br-selected br-current"></a></div></div>',n+="</h4>",n+='<img alt="'+l.extra.title+'" style="max-width:100%;" src="https://static.kenzap.com/preview/'+l.id+"-600.jpeg?"+l.extra.updated+'" />',c.state.ext_ids.includes(l.id)?n+='<span class="csection" data-id="'+l.id+'" data-index="'+s+'" >'+__("Already added")+"</a>":n+='<a class="sclick csection" data-id="'+l.id+'" data-index="'+s+'" >'+__("Choose this extensions")+"</a>",n+="</div>",s++}}catch(t){d.e(t)}finally{d.f()}n+="</div>",a.querySelector(".modal-body").innerHTML=n,c.state.modalCont.show(),i(".sclick",c.listeners.sectionClick)}else m=document.querySelector(".modal .btn-close"),u=new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window}),m.dispatchEvent(u),r(__("No available extensions found."));var m,u})).catch((function(t){console.error("Error:",t)}))},blockRemoveClick:function(t){if(confirm(__("Remove extension from dashboard?"))){var e=new URLSearchParams;e.append("cmd","remove_extension"),e.append("sid",n()),e.append("id",t.currentTarget.dataset.id),e.append("token",s("kenzap_token")),fetch("https://siteapi.kenzap.cloud/v1/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:e}).then((function(t){return t.json()})).then((function(t){t.success?(c.getData(),r(__("Extension removed."))):r(__("Something went wrong, try again later."))})).catch((function(t){console.error("Error:",t)}))}},sectionClick:function(t){c.state.modalCont.hide(),c.launcher(t.currentTarget.dataset.id)},modalSuccessBtn:function(t){c.listeners.modalSuccessBtnFunc(t)},modalSuccessBtnFunc:null},launcher:function(t){var e=new URLSearchParams;e.append("cmd","init_extensions"),e.append("extensions",t),e.append("sid",n()),e.append("token",s("kenzap_token")),fetch("https://siteapi.kenzap.cloud/v1/",{method:"post",headers:{Accept:"application/json","Content-type":"application/x-www-form-urlencoded"},body:e}).then((function(t){return t.json()})).then((function(t){t.success?(c.getData(),r(__("New extension successfully added."))):r(__("Can not add extension. Please try again later."))})).catch((function(t){console.error("Error:",t)}))},checkLauncher:function(){if(!c.state.extLoad){var t=new URLSearchParams(window.location.search);if(t.get("launcher"))t.get("launcher").split(",").forEach((function(t){return c.state.ext_ids.includes(t)?"":c.launcher(t)})),c.state.extLoad=!0}},loadHomeStructure:function(){c.state.firstLoad&&(document.querySelector("#contents").innerHTML=function(t){return'\n    <div class="dash-menu container">\n        <div class="d-flex justify-content-between bd-highlight mb-3">\n            <nav class="bc" aria-label="breadcrumb"><ol class="breadcrumb mt-2 mb-0"><li class="breadcrumb-item">Dashboard</li></ol></nav>\n        </div> \n        <div class="row">\n            <div class="col-lg-4 grid-margin stretch-card mb-4">\n                <div class="card border-white shadow-sm p-sm-2 anm br" data-ext="pages">\n                <div class="card-body">\n                    <div class="d-flex flex-row">\n                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="32" fill="currentColor" class="bi bi-pencil-square me-3 mr-md-0 mr-lg-4 text-primary" viewBox="0 0 16 16" style="min-width: 32px;">\n                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>\n                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>\n                    </svg>\n                    <div class="mr-4 mr-md-0 mr-lg-4 text-left text-lg-left">\n                        <h5 class="card-title mb-0">Pages</h4>\n                        <p class="card-description mt-1 mb-0">Update content of your website. Create new pages or update existing layouts.</p>\n                        <div class="link-group">\n                        <a class="mt-2 text-md-tight" href="'.concat(a("/pages/"),'" data-ext="pages">Edit</a>\n                        </div>\n                    </div>\n                    </div>                  \n                </div>\n                </div>\n            </div>\n\n            <div class="col-lg-4 grid-margin stretch-card mb-4 d-none">\n                <div class="card border-white shadow-sm p-sm-2 anm br" data-ext="settings">\n                <div class="card-body">\n                    <div class="d-flex flex-row">\n                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="32" fill="currentColor" class="bi bi-pencil-square me-3 mr-md-0 mr-lg-4 text-primary" viewBox="0 0 16 16" style="min-width: 32px;">\n                        <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z"/>\n                    </svg>\n                    <div class="mr-4 mr-md-0 mr-lg-4 text-left text-lg-left">\n                        <h5 class="card-title mb-0">Style &amp; Settings</h4>\n                        <p class="card-description mt-1 mb-0">Adjust visual feel and look of this site. Change colors, fonts, etc.</p>\n                        <div class="link-group">\n                        <a class="mt-2 text-md-tight" href="#" data-ext="settings">Customize</a>\n                        </div>\n                    </div>\n                    </div>                  \n                </div>\n                </div>\n            </div>\n\n            <div class="col-lg-4 grid-margin stretch-card mb-4">\n                <div class="card border-white shadow-sm p-sm-2 anm br" data-ext="domain">\n                <div class="card-body">\n                    <div class="d-flex flex-row">\n                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="32" fill="currentColor" class="bi bi-pencil-square me-3 mr-md-0 mr-lg-4 text-primary" viewBox="0 0 16 16" style="min-width: 32px;">\n                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/>\n                    </svg>\n                    <div class="mr-4 mr-md-0 mr-lg-4 text-left text-lg-left">\n                        <h5 class="card-title mb-0">').concat(t("Domain Name"),'</h4>\n                        <p class="card-description mt-1 mb-0">Update domain name settings of this site. Connect your domain name.</p>\n                        <div class="link-group">\n                        <a class="mt-2 text-md-tight" href="').concat(a("/domain/"),'" data-ext="domain">Settings</a>\n                        </div>\n                    </div>\n                    </div>                  \n                </div>\n                </div>\n            </div>\n\n            <div class="col-lg-4 grid-margin stretch-card mb-4 d-none">\n                <div class="card border-white shadow-sm p-sm-2 anm br" data-ext="navigation">\n                <div class="card-body">\n                    <div class="d-flex flex-row">\n                    <div class="mr-4 mr-md-0 mr-lg-4 text-left text-lg-left">\n                        <h5 class="card-title mb-0">Navigation Menu</h4>\n                        <p class="card-description mt-1 mb-0">Set up header and footer navigation menus of this site.</p>\n                        <div class="link-group">\n                        <a class="mt-2 text-md-tight" href="#" data-ext="navigation">Edit</a>\n                        </div>\n                    </div>\n                    </div>                  \n                </div>\n                </div>\n            </div>\n\n            <div class="col-lg-4 grid-margin stretch-card mb-4">\n                <div class="card border-white shadow-sm p-sm-2 anm br" data-ext="users">\n                <div class="card-body">\n                    <div class="d-flex flex-row">\n                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="32" fill="currentColor" class="bi bi-pencil-square me-3 mr-md-0 mr-lg-4 text-primary" viewBox="0 0 16 16" style="min-width: 32px;">\n                        <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>\n                        <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z"/>\n                    </svg>\n                    <div class="mr-4 mr-md-0 mr-lg-4 text-left text-lg-left">\n                        <h5 class="card-title mb-0">').concat(t("Access & API keys"),'</h4>\n                        <p class="card-description mt-1 mb-0">Grant new user or revoke existing user access to this cloud space.</p>\n                        <div class="link-group">\n                        <a class="mt-2 text-md-tight" href="').concat(a("/access/"),'" data-ext="users">').concat(t("Manage"),'</a>\n                        </div>\n                    </div>\n                    </div>                  \n                </div>\n                </div>\n            </div>\n\n            <div class="col-lg-4 grid-margin stretch-card mb-4">\n                <div class="card border-white shadow-sm p-sm-2 anm br" data-ext="products">\n                <div class="card-body">\n                    <div class="d-flex flex-row">\n                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="32" fill="currentColor" class="bi bi-pencil-square me-3 mr-md-0 mr-lg-4 text-primary" viewBox="0 0 16 16" style="min-width: 32px;">\n                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>\n                        </svg>\n                        <div class="mr-4 mr-md-0 mr-lg-4 text-left text-lg-left">\n                            <h5 class="card-title mb-0">').concat(t("E-commerce"),'</h4>\n                            <p class="card-description mt-1 mb-0">').concat(t("Create and organize products used in e-commerce and checkout."),'</p>\n                            <div class="link-group">\n                                <a class="mt-2 me-2 text-md-tight" href="').concat(a("https://ecommerce.kenzap.cloud"),'" data-ext="ecommerce-settings">').concat(t("Menu"),'</a>\n                                <a class="mt-2 text-md-tight" href="').concat(a("https://ecommerce.kenzap.cloud/product-list/"),'" data-ext="ecommerce-products">').concat(t("Products"),'</a>\n                            </div>\n                            \x3c!-- <a class="link text-right mt-2 text-md-tight text-lg-right" href="#" >').concat(t("Continue"),'</a> --\x3e\n                        </div>\n                    </div>                  \n                </div>\n                </div>\n            </div>\n\n\n            <div class="col-lg-4 grid-margin stretch-card mb-4">\n                <div class="add-card border-white p-sm-2 anm br" data-ext="products">\n                    <div class="card-body">\n                        <div class="d-flex flex-row justify-content-center">\n                            <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" fill="currentColor" style="color:#ccc;" class="bi bi-plus-circle justify-content-center p-3" viewBox="0 0 16 16">\n                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>\n                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>\n                            </svg>\n                        </div>                  \n                    </div>\n                </div>\n            </div>\n \n        </div>\n    </div>\n\n    \n    <div class="modal" tabindex="-1">\n        <div class="modal-dialog">\n            <div class="modal-content">\n                <div class="modal-header">\n                    <h5 class="modal-title"></h5>\n                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>\n                </div>\n                <div class="modal-body">\n\n                </div>\n                <div class="modal-footer">\n                    <button type="button" class="btn btn-primary btn-modal"></button>\n                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"></button>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class="position-fixed bottom-0 p-2 m-4 end-0 align-items-center">\n        <div class="toast hide align-items-center text-white bg-dark border-0" role="alert" aria-live="assertive"\n            aria-atomic="true" data-bs-delay="3000">\n            <div class="d-flex">\n                <div class="toast-body"></div>\n                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"\n                    aria-label="Close"></button>\n            </div>\n        </div>\n    </div>\n\n    ')}(__))},initFooter:function(){var t,e;t=__("Copyright © "+(new Date).getFullYear()+' <a class="text-muted" href="https://kenzap.com/" target="_blank">Kenzap</a>. All rights reserved.'),e=__("Kenzap Cloud Services - Dashboard"),document.querySelector("footer .row").innerHTML='\n    <div class="d-sm-flex justify-content-center justify-content-sm-between">\n        <span class="text-muted text-center text-sm-left d-block d-sm-inline-block">'.concat(t,'</span>\n        <span class="float-none float-sm-right d-block mt-1 mt-sm-0 text-center text-muted">').concat(e,"</span>\n    </div>")}};c.init()}();
