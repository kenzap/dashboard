
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
  'use strict';

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /**
   * @name initHeader
   * @description Initiates Kenzap Cloud extension header and related scripts. Verifies user sessions, handles SSO, does cloud space navigation, initializes i18n localization. 
   * @param {object} response
   */
  const initHeader = (response) => {

      // cache header from backend
      if(response.header) localStorage.setItem('header', response.header);
    
      // load header to html if not present
      if(!document.querySelector("#k-script")){
    
          let child = document.createElement('div');
          child.innerHTML = localStorage.getItem('header');
          child = child.firstChild;
          document.body.prepend(child);
    
          // run header scripts
          Function(document.querySelector("#k-script").innerHTML).call('test');
      }
    
      // load locales if present
      if(response.locale) window.i18n.init(response.locale); 
  };

  /**
   * @name showLoader
   * @description Initiates full screen three dots loader.
   */
  const showLoader = () => {

      let el = document.querySelector(".loader");
      if (el) el.style.display = 'block';
  };

  /**
   * @name hideLoader
   * @description Removes full screen three dots loader.
   */
  const hideLoader = () => {

      let el = document.querySelector(".loader");
      if (el) el.style.display = 'none';
  };

  /**
   * @name initFooter
   * @description Removes full screen three dots loader.
   * @param {string} left - Text or html code to be present on the left bottom side of screen
   * @param {string} right - Text or html code to be present on the left bottom side of screen
   */
  const initFooter = (left, right) => {

      document.querySelector("footer .row").innerHTML = `
    <div class="d-sm-flex justify-content-center justify-content-sm-between">
        <span class="text-muted text-center text-sm-left d-block d-sm-inline-block">${left}</span>
        <span class="float-none float-sm-right d-block mt-1 mt-sm-0 text-center text-muted">${right}</span>
    </div>`;
  };

  /**
   * @name getSiteId
   * @description Gets current Kenzap Cloud space ID identifier from the URL.
   * 
   * @returns {string} id - Kenzap Cloud space ID.
   */
  const getSiteId = () => {
      
      let urlParams = new URLSearchParams(window.location.search);
      let id = urlParams.get('sid') ? urlParams.get('sid') : "";

      return id;
  };

  /**
   * @name getCookie
   * @description Read cookie by its name.
   * @param {string} cname - Cookie name.
   * 
   * @returns {string} value - Cookie value.
   */
  const getCookie = (cname) => {

      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
  };

  /**
   * @name headers
   * @description Default headers object for all Kenzap Cloud fetch queries. 
   * @param {object} headers
   */
   const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
      'Kenzap-Locale': getCookie('locale') ? getCookie('locale') : "en",
      'Kenzap-Header': (localStorage.hasOwnProperty('header') && localStorage.hasOwnProperty('header-version')) ? localStorage.getItem('header-version') : 0,
      'Kenzap-Token': getCookie('kenzap_token'),
      'Kenzap-Sid': getSiteId(),
  };

  /**
   * @name parseApiError
   * @description Set default logics for different API Error responses.
   * @param {object} object - API response.
   */
   const parseApiError = (data) => {

      // outout to frontend console
      console.log(data);

      // unstructured failure
      if(isNaN(data.code)){
      
          // structure failure data
          let log = data;
          try{ log = JSON.stringify(log); }catch(e){ }

          let params = new URLSearchParams();
          params.append("cmd", "report");
          params.append("sid", getSiteId());
          params.append("token", getCookie('kenzap_token'));
          params.append("data", log);
          
          // report error
          fetch('https://api-v1.kenzap.cloud/error/', { method: 'post', headers: { 'Accept': 'application/json', 'Content-type': 'application/x-www-form-urlencoded', }, body: params });

          alert('Can not connect to Kenzap Cloud');  
          return;
      }
      
      // handle cloud error codes
      switch(data.code){

          // unauthorized
          case 401:

              // dev mode
              if(window.location.href.indexOf('localhost')!=-1){ 

                  alert(data.reason); 
                  return; 
              }

              // production mode
              location.href="https://auth.kenzap.com/?app=65432108792785&redirect="+window.location.href; break;
          
          // something else
          default:

              alert(data.reason); 
              break;
      }
  };

  /**
   * @name initBreadcrumbs
   * @description Render ui breadcrumbs.
   * @param {array} data - List of link objects containing link text and url. If url is missing then renders breadcrumb as static text. Requires html holder with .bc class.
   */
  const initBreadcrumbs = (data) => {

      let html = '<ol class="breadcrumb mt-2 mb-0">';
      for(let bc of data){
          
          if(typeof(bc.link) === 'undefined'){

              html += `<li class="breadcrumb-item">${ bc.text }</li>`;
          }else {

              html += `<li class="breadcrumb-item"><a href="${ bc.link }">${ bc.text }</a></li>`;
          }
      }
      html += '</ol>';
      
      document.querySelector(".bc").innerHTML = html;
  };

  /**
   * @name onClick
   * @description One row click event listener declaration. Works with one or many HTML selectors.
   * @param {string} sel - HTML selector, id, class, etc.
   * @param {string} fn - callback function fired on click event.
   */
  const onClick = (sel, fn) => {

      if(document.querySelector(sel)) for( let e of document.querySelectorAll(sel) ){

          e.removeEventListener('click', fn, true);
          e.addEventListener('click', fn, true);
      }
  };

  /**
   * @name toast
   * @description Triggers toast notification. Adds toast html to the page if missing.
   * @param {string} text - Toast notification.
   */
   const toast = (text) => {

      // only add once
      if(!document.querySelector(".toast")){

          let html = `
        <div class="position-fixed bottom-0 p-2 m-4 end-0 align-items-center">
            <div class="toast hide align-items-center text-white bg-dark border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">
                <div class="d-flex">
                    <div class="toast-body"></div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>`;
          if(document.querySelector('body > div')) document.querySelector('body > div').insertAdjacentHTML('afterend', html);
      }

      let toast = new bootstrap.Toast(document.querySelector('.toast'));
      document.querySelector('.toast .toast-body').innerHTML = text;  
      toast.show();
  };

  var link = function link(slug) {
    var urlParams = new URLSearchParams(window.location.search);
    var sid = urlParams.get('sid') ? urlParams.get('sid') : "";
    var postfix = slug.indexOf('?') == -1 ? '?sid=' + sid : '&sid=' + sid;
    return slug + postfix;
  };

  var homeContent = function homeContent(__) {
    return "\n    <div class=\"dash-menu container\">\n        <div class=\"d-flex justify-content-between bd-highlight mb-3\">\n            <nav class=\"bc\" aria-label=\"breadcrumb\"><ol class=\"breadcrumb mt-2 mb-0\"><li class=\"breadcrumb-item\">Dashboard</li></ol></nav>\n        </div> \n        <div class=\"row\">\n            <div class=\"col-lg-4 grid-margin stretch-card mb-4\">\n                <div class=\"card border-white shadow-sm p-sm-2 anm br\" data-ext=\"pages\">\n                <div class=\"card-body\">\n                    <div class=\"d-flex flex-row\">\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"32\" fill=\"currentColor\" class=\"bi bi-pencil-square me-3 mr-md-0 mr-lg-4 text-primary\" viewBox=\"0 0 16 16\" style=\"min-width: 32px;\">\n                        <path d=\"M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z\"></path>\n                        <path fill-rule=\"evenodd\" d=\"M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z\"></path>\n                    </svg>\n                    <div class=\"mr-4 mr-md-0 mr-lg-4 text-left text-lg-left\">\n                        <h5 class=\"card-title mb-0\">Pages</h4>\n                        <p class=\"card-description mt-1 mb-0\">Update content of your website. Create new pages or update existing layouts.</p>\n                        <div class=\"link-group\">\n                        <a class=\"mt-2 text-md-tight\" href=\"".concat(link('/pages/'), "\" data-ext=\"pages\">Edit</a>\n                        </div>\n                    </div>\n                    </div>                  \n                </div>\n                </div>\n            </div>\n\n            <div class=\"col-lg-4 grid-margin stretch-card mb-4 d-none\">\n                <div class=\"card border-white shadow-sm p-sm-2 anm br\" data-ext=\"settings\">\n                <div class=\"card-body\">\n                    <div class=\"d-flex flex-row\">\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"32\" fill=\"currentColor\" class=\"bi bi-pencil-square me-3 mr-md-0 mr-lg-4 text-primary\" viewBox=\"0 0 16 16\" style=\"min-width: 32px;\">\n                        <path d=\"M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z\"/>\n                    </svg>\n                    <div class=\"mr-4 mr-md-0 mr-lg-4 text-left text-lg-left\">\n                        <h5 class=\"card-title mb-0\">Style &amp; Settings</h4>\n                        <p class=\"card-description mt-1 mb-0\">Adjust visual feel and look of this site. Change colors, fonts, etc.</p>\n                        <div class=\"link-group\">\n                        <a class=\"mt-2 text-md-tight\" href=\"#\" data-ext=\"settings\">Customize</a>\n                        </div>\n                    </div>\n                    </div>                  \n                </div>\n                </div>\n            </div>\n\n            <div class=\"col-lg-4 grid-margin stretch-card mb-4\">\n                <div class=\"card border-white shadow-sm p-sm-2 anm br\" data-ext=\"domain\">\n                <div class=\"card-body\">\n                    <div class=\"d-flex flex-row\">\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"32\" fill=\"currentColor\" class=\"bi bi-pencil-square me-3 mr-md-0 mr-lg-4 text-primary\" viewBox=\"0 0 16 16\" style=\"min-width: 32px;\">\n                        <path d=\"M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z\"/>\n                    </svg>\n                    <div class=\"mr-4 mr-md-0 mr-lg-4 text-left text-lg-left\">\n                        <h5 class=\"card-title mb-0\">").concat(__('Domain Name'), "</h4>\n                        <p class=\"card-description mt-1 mb-0\">Update domain name settings of this site. Connect your domain name.</p>\n                        <div class=\"link-group\">\n                        <a class=\"mt-2 text-md-tight\" href=\"").concat(link('/domain/'), "\" data-ext=\"domain\">Settings</a>\n                        </div>\n                    </div>\n                    </div>                  \n                </div>\n                </div>\n            </div>\n\n            <div class=\"col-lg-4 grid-margin stretch-card mb-4 d-none\">\n                <div class=\"card border-white shadow-sm p-sm-2 anm br\" data-ext=\"navigation\">\n                <div class=\"card-body\">\n                    <div class=\"d-flex flex-row\">\n                    <div class=\"mr-4 mr-md-0 mr-lg-4 text-left text-lg-left\">\n                        <h5 class=\"card-title mb-0\">Navigation Menu</h4>\n                        <p class=\"card-description mt-1 mb-0\">Set up header and footer navigation menus of this site.</p>\n                        <div class=\"link-group\">\n                        <a class=\"mt-2 text-md-tight\" href=\"#\" data-ext=\"navigation\">Edit</a>\n                        </div>\n                    </div>\n                    </div>                  \n                </div>\n                </div>\n            </div>\n\n            <div class=\"col-lg-4 grid-margin stretch-card mb-4\">\n                <div class=\"card border-white shadow-sm p-sm-2 anm br\" data-ext=\"users\">\n                <div class=\"card-body\">\n                    <div class=\"d-flex flex-row\">\n                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"32\" fill=\"currentColor\" class=\"bi bi-pencil-square me-3 mr-md-0 mr-lg-4 text-primary\" viewBox=\"0 0 16 16\" style=\"min-width: 32px;\">\n                        <path d=\"M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z\"/>\n                        <path d=\"M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z\"/>\n                    </svg>\n                    <div class=\"mr-4 mr-md-0 mr-lg-4 text-left text-lg-left\">\n                        <h5 class=\"card-title mb-0\">").concat(__('Access & API keys'), "</h4>\n                        <p class=\"card-description mt-1 mb-0\">Grant new user or revoke existing user access to this cloud space.</p>\n                        <div class=\"link-group\">\n                        <a class=\"mt-2 text-md-tight\" href=\"").concat(link('/access/'), "\" data-ext=\"users\">").concat(__('Manage'), "</a>\n                        </div>\n                    </div>\n                    </div>                  \n                </div>\n                </div>\n            </div>\n\n            <div class=\"col-lg-4 grid-margin stretch-card mb-4\">\n                <div class=\"card border-white shadow-sm p-sm-2 anm br\" data-ext=\"products\">\n                <div class=\"card-body\">\n                    <div class=\"d-flex flex-row\">\n                        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"32\" fill=\"currentColor\" class=\"bi bi-pencil-square me-3 mr-md-0 mr-lg-4 text-primary\" viewBox=\"0 0 16 16\" style=\"min-width: 32px;\">\n                            <path d=\"M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z\"/>\n                        </svg>\n                        <div class=\"mr-4 mr-md-0 mr-lg-4 text-left text-lg-left\">\n                            <h5 class=\"card-title mb-0\">").concat(__('E-commerce'), "</h4>\n                            <p class=\"card-description mt-1 mb-0\">").concat(__('Create and organize products used in e-commerce and checkout.'), "</p>\n                            <div class=\"link-group\">\n                                <a class=\"mt-2 me-2 text-md-tight\" href=\"").concat(link('https://ecommerce.kenzap.cloud'), "\" data-ext=\"ecommerce-settings\">").concat(__('Menu'), "</a>\n                                <a class=\"mt-2 text-md-tight\" href=\"").concat(link('https://ecommerce.kenzap.cloud/product-list/'), "\" data-ext=\"ecommerce-products\">").concat(__('Products'), "</a>\n                            </div>\n                            <!-- <a class=\"link text-right mt-2 text-md-tight text-lg-right\" href=\"#\" >").concat(__('Continue'), "</a> -->\n                        </div>\n                    </div>                  \n                </div>\n                </div>\n            </div>\n\n\n            <div class=\"col-lg-4 grid-margin stretch-card mb-4\">\n                <div class=\"add-card border-white p-sm-2 anm br\" data-ext=\"products\">\n                    <div class=\"card-body\">\n                        <div class=\"d-flex flex-row justify-content-center\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"90\" height=\"90\" fill=\"currentColor\" style=\"color:#ccc;\" class=\"bi bi-plus-circle justify-content-center p-3\" viewBox=\"0 0 16 16\">\n                            <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"></path>\n                            <path d=\"M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z\"></path>\n                            </svg>\n                        </div>                  \n                    </div>\n                </div>\n            </div>\n \n        </div>\n    </div>\n\n    \n    <div class=\"modal\" tabindex=\"-1\">\n        <div class=\"modal-dialog\">\n            <div class=\"modal-content\">\n                <div class=\"modal-header\">\n                    <h5 class=\"modal-title\"></h5>\n                    <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n                </div>\n                <div class=\"modal-body\">\n\n                </div>\n                <div class=\"modal-footer\">\n                    <button type=\"button\" class=\"btn btn-primary btn-modal\"></button>\n                    <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\"></button>\n                </div>\n            </div>\n        </div>\n    </div>\n\n\n\n    ");
  };

  var _this = {
    state: {
      firstLoad: true,
      extLoad: false,
      ajaxQueue: 0,
      modalCont: null,
      ext_ids: null
    },
    init: function init() {
      _this.getData();
    },
    getData: function getData() {
      if (_this.state.firstLoad) showLoader();
      fetch('https://api-v1.kenzap.cloud/', {
        method: 'post',
        headers: headers,
        body: JSON.stringify({
          query: {
            user: {
              type: 'authenticate',
              fields: ['avatar'],
              token: getCookie('kenzap_token')
            },
            locale: {
              type: 'locale',
              source: ['extension'],
              key: 'dashboard'
            },
            dashboard: {
              type: 'dashboard'
            }
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        hideLoader();

        if (response.success) {
          initHeader(response);

          _this.loadHomeStructure();

          _this.renderPage(response);

          _this.checkLauncher();

          _this.initListeners();

          _this.initFooter();

          _this.state.firstLoad = false;
        } else {
          parseApiError(response);
        }
      })["catch"](function (error) {
        console.error('Error:', error);
      });
    },
    renderPage: function renderPage(response) {
      var d = document;
      var html = '';
      _this.state.ext_ids = response.dashboard.ext_ids;
      if (response.dashboard.ext_ids) response.dashboard.ext_ids.forEach(function (el) {
        console.log("init card for ext: " + el);
        if (response.dashboard.extensions[el]) if (response.dashboard.extensions[el].links) response.dashboard.extensions[el].links.forEach(function (el_card) {
          var links = '';
          el_card.links.forEach(function (link) {
            links += "<a class=\"mt-2 me-2 text-md-tight\" href=\"".concat(response.dashboard.extensions[el].domain ? 'https://' + response.dashboard.extensions[el].domain + '.kenzap.cloud' + link.slug : link.slug, "?sid=").concat(getSiteId(), "\" data-ext=\"pages\">").concat(link.text, "</a>");
          });
          var icon = '';
          icon = el_card.icon;
          html += "\n                <div class=\"col-lg-4 grid-margin stretch-card mb-4\">\n                    <div class=\"card border-white shadow-sm p-sm-2 anm br\" data-ext=\"".concat(el, "\">\n                        <div class=\"card-body\">\n                            <div class=\"d-flex flex-row\">\n                            ").concat(icon, "\n                            <div class=\"mr-4 mr-md-0 mr-lg-4 text-left text-lg-left\">\n                                <h5 class=\"card-title mb-0\">").concat(el_card.title, " <button type=\"button\" data-id=\"").concat(el, "\" class=\"d-none btn-close float-end fs-6 rm-ext\" ></button></h5>\n                                <p class=\"card-description mt-1 mb-0\">").concat(el_card.description, "</p>\n                                <div class=\"link-group\">\n                                    ").concat(links, "\n                                </div>\n                            </div>\n                            </div>                  \n                        </div>\n                    </div>\n                </div>");
        });
      });
      html += "\n        <div class=\"col-lg-4 grid-margin stretch-card mb-4\">\n            <div class=\"add-card border-white p-sm-2 anm br\" data-ext=\"\">\n                <div class=\"card-body\">\n                    <div class=\"d-flex flex-row justify-content-center\">\n                        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"90\" height=\"90\" fill=\"currentColor\" style=\"color:#ccc;\" class=\"bi bi-plus-circle justify-content-center p-3\" viewBox=\"0 0 16 16\">\n                        <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"></path>\n                        <path d=\"M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z\"></path>\n                        </svg>\n                    </div>                  \n                </div>\n            </div>\n        </div>";
      d.querySelector(".dash-menu .row").innerHTML = html;
      initBreadcrumbs([{
        text: __('Dashboard')
      }]);
    },
    initListeners: function initListeners() {
      onClick('.link-group a', _this.listeners.blockClick);
      onClick('.add-card', _this.listeners.blockAddClick);
      onClick('.rm-ext', _this.listeners.blockRemoveClick);
    },
    listeners: {
      blockClick: function blockClick(e) {},
      blockAddClick: function blockAddClick(e) {
        var modal = document.querySelector(".modal");
        _this.state.modalCont = new bootstrap.Modal(modal);
        modal.querySelector(".modal-dialog").style.maxWidth = '900px';
        var CDN2 = 'https://static.kenzap.com';
        modal.querySelector(".modal-title").innerHTML = __('Add extension');
        modal.querySelector(".btn-primary").style.display = 'none';
        modal.querySelector(".btn-secondary").innerHTML = __('Cancel');
        var params = new URLSearchParams();
        params.append("cmd", "preview_extensions");
        params.append("s", '');
        params.append("token", getCookie('kenzap_token'));
        fetch('https://siteapi.kenzap.cloud/v1/', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
          },
          body: params
        }).then(function (response) {
          return response.json();
        }).then(function (response) {
          if (response.success) {
            var html = '',
                key = 0;
            html += '<div class="row">';

            var _iterator = _createForOfIteratorHelper(response.res),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var row = _step.value;
                html += '<div class="col-md-6" style="margin:16px 0;">';
                html += '<h4>' + row['extra']['title'];
                html += '<div class="br-wrapper br-theme-css-stars"><select id="profile-rating" name="rating" autocomplete="off" style="display: none;"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select><div class="br-widget"><a href="#" data-rating-value="1" data-rating-text="1" class="br-selected"></a><a href="#" data-rating-value="2" data-rating-text="2" class="br-selected"></a><a href="#" data-rating-value="3" data-rating-text="3" class="br-selected"></a><a href="#" data-rating-value="4" data-rating-text="4" class="br-selected"></a><a href="#" data-rating-value="5" data-rating-text="5" class="br-selected br-current"></a></div></div>';
                html += '</h4>';
                html += '<img alt="' + row['extra']['title'] + '" style="max-width:100%;min-height:200px;" src="' + CDN2 + '/preview/' + row['id'] + '-600.jpeg?' + row['extra']['updated'] + '" />';

                if (_this.state.ext_ids.includes(row['id'])) {
                  html += '<span class="csection" data-id="' + row['extra']['slug'] + '" data-index="' + key + '" >' + __('Already added') + '</a>';
                } else {
                  html += '<a class="sclick csection" data-id="' + row['extra']['slug'] + '" data-index="' + key + '" >' + __('Choose this extensions') + '</a>';
                }

                html += '</div>';
                key++;
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            html += '</div>';
            modal.querySelector(".modal-body").innerHTML = html;

            _this.state.modalCont.show();

            onClick('.sclick', _this.listeners.sectionClick);
          } else {
            simulateClick(document.querySelector('.modal .btn-close'));
            toast(__('No available extensions found.'));
          }
        })["catch"](function (error) {
          console.error('Error:', error);
        });
      },
      blockRemoveClick: function blockRemoveClick(e) {
        var c = confirm(__('Remove extension from dashboard?'));
        if (!c) return;
        var params = new URLSearchParams();
        params.append("cmd", "remove_extension");
        params.append("sid", getSiteId());
        params.append("id", e.currentTarget.dataset.id);
        params.append("token", getCookie('kenzap_token'));
        fetch('https://siteapi.kenzap.cloud/v1/', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
          },
          body: params
        }).then(function (response) {
          return response.json();
        }).then(function (response) {
          if (response.success) {
            _this.getData();

            toast(__('Extension removed.'));
          } else {
            toast(__('Something went wrong, try again later.'));
          }
        })["catch"](function (error) {
          console.error('Error:', error);
        });
      },
      sectionClick: function sectionClick(e) {
        _this.state.modalCont.hide();

        _this.launcher(e.currentTarget.dataset.id);
      },
      modalSuccessBtn: function modalSuccessBtn(e) {
        _this.listeners.modalSuccessBtnFunc(e);
      },
      modalSuccessBtnFunc: null
    },
    launcher: function launcher(extensions) {
      var params = new URLSearchParams();
      params.append("cmd", "init_extensions");
      params.append("extensions", extensions);
      params.append("sid", getSiteId());
      params.append("token", getCookie('kenzap_token'));
      fetch('https://siteapi.kenzap.cloud/v1/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/x-www-form-urlencoded'
        },
        body: params
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        if (response.success) {
          _this.getData();

          toast(__('New extension successfully added.'));
        } else {
          toast(__('Can not add extension. Please try again later.'));
        }
      })["catch"](function (error) {
        console.error('Error:', error);
      });
    },
    checkLauncher: function checkLauncher() {
      if (_this.state.extLoad) return;
      var params = new URLSearchParams(window.location.search);

      if (params.get("launcher")) {
        var exts = params.get("launcher").split(',');
        exts.forEach(function (id) {
          return _this.state.ext_ids.includes(id) ? '' : _this.launcher(id);
        });
        _this.state.extLoad = true;
      }
    },
    loadHomeStructure: function loadHomeStructure() {
      if (!_this.state.firstLoad) return;
      document.querySelector('#contents').innerHTML = homeContent(__);
    },
    initFooter: function initFooter$1() {
      initFooter(__('Created by %1$Kenzap%2$. ❤️ Licensed %3$GPL3%4$.', '<a class="text-muted" href="https://kenzap.com/" target="_blank">', '</a>', '<a class="text-muted" href="https://github.com/kenzap/dashboard" target="_blank">', '</a>'), __('Copyright © %1$ %2$Dashboard%3$ Extension', new Date().getFullYear(), '<a class="text-muted" href="https://github.com/kenzap/dashboard" target="_blank">', '</a>'));
    }
  };

  _this.init();

})();
//# sourceMappingURL=index.js.map
