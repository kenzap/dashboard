
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35739/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
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
   * @name link
   * @description Handles Cloud navigation links between extensions and its pages. Takes care of custom url parameters.
   * @param {string} slug - Any inbound link
   * 
   * @returns {string} link - Returns original link with kenzp cloud space ID identifier.
   */
  const link = (slug) => {
      
      let urlParams = new URLSearchParams(window.location.search);
      let sid = urlParams.get('sid') ? urlParams.get('sid') : "";

      let postfix = slug.indexOf('?') == -1 ? '?sid='+sid : '&sid='+sid;

      return slug + postfix;
  };

  /**
   * @name spaceID
   * @description Gets current Kenzap Cloud space ID identifier from the URL.
   * 
   * @returns {string} id - Kenzap Cloud space ID.
   */
   const spaceID = () => {
      
      let urlParams = new URLSearchParams(window.location.search);
      let id = urlParams.get('sid') ? urlParams.get('sid') : "";

      return id;
  };

  /**
   * @name setCookie
   * @description Set cookie by its name to all .kenzap.cloud subdomains
   * @param {string} name - Cookie name.
   * @param {string} value - Cookie value.
   * @param {string} days - Number of days when cookie expires.
   */
   const setCookie = (name, value, days) => {

      let expires = "";
      if (days) {
          let date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = ";expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (escape(value) || "") + expires + ";path=/;domain=.kenzap.cloud"; 
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
   * @name checkHeader
   * @description This function tracks UI updates, creates header version checksum and compares it after every page reload
   * @param {object} object - API response.
   */
   const checkHeader = () => {

      let version = (localStorage.hasOwnProperty('header') && localStorage.hasOwnProperty('header-version')) ? localStorage.getItem('header-version') : 0;
      let check = window.location.hostname + '/' + spaceID() + '/' + getCookie('locale');
      if(check != getCookie('check')){ version = 0; console.log('refresh'); }
      
      setCookie('check', check, 5);

      return version
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
      'Kenzap-Header': checkHeader(),
      'Kenzap-Token': getCookie('kenzap_token'),
      'Kenzap-Sid': spaceID(),
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
          params.append("sid", spaceID());
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

  var HTMLContent = function HTMLContent(__) {
    return "\n    <div class=\"container\">\n        <div class=\"d-flex justify-content-between bd-highlight mb-3\">\n            <nav class=\"bc\" aria-label=\"breadcrumb\"></nav>\n            <div class=\"ms-2 dropdown\">\n              <button class=\"btn btn btn-outline-primary dropdown-toggle  h-space\" type=\"button\" id=\"accessOptions\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\" >".concat(__('Options'), "</button>\n              <ul class=\"dropdown-menu accessOptionsList\" aria-labelledby=\"accessOptions\">\n                <li><a class=\"dropdown-item btn-add-user\" href=\"#\">").concat(__('Add user'), "</a></li>\n                <li><a class=\"dropdown-item btn-add-key\" href=\"#\">").concat(__('Add API Key'), "</a></li>\n                <li><a class=\"dropdown-item btn-add-space\" href=\"#\">").concat(__('New space'), "</a></li>\n   \n                <li><hr class=\"dropdown-divider\"></li>\n                <li><a class=\"dropdown-item btn-rename-space\" href=\"#\">").concat(__('Space name'), "</a></li>\n                <li><a class=\"dropdown-item text-danger btn-remove-space\" href=\"#\">").concat(__('Remove space'), "</a></li></ul>\n            </div>\n            <button class=\"btn btn-primary btn-add d-none\" type=\"button\">").concat(__('Add user'), "</button>\n        </div> \n        \n        <div class=\"row\">\n            <div class=\"col-lg-7 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card\">\n              <div class=\"card border-white shadow-sm br\">\n                <div class=\"card-body\">\n                  <h4 class=\"card-title mb-4\">").concat(__('Users'), "</h4>\n                  <div class=\"table-responsive table-nav\">\n                    <table class=\"table table-hover table-borderless align-middle table-striped table-p-list\" style=\"min-width:600px;\">\n                      <thead>\n                        <tr>\n                          <th>").concat(__('ID'), "</th>\n                          <th>").concat(__('Name'), "</th>\n                          <th>").concat(__('Rights'), "</th>\n                          <th></th>\n                        </tr>\n                      </thead>\n                      <tbody class=\"list\">\n\n                      </tbody>\n                    </table>\n                  </div>\n                </div>\n              </div>\n            </div>\n            <div class=\"col-lg-5 mt-4 mt-lg-0 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card\">\n              <div class=\"card border-white shadow-sm br\">\n                <div class=\"card-body\">\n                  <h4 class=\"card-title mb-4\">").concat(__('API Keys'), "</h4>\n                  <div class=\"table-responsive table-nav\">\n                    <table class=\"table table-hover table-borderless align-middle table-striped table-p-list\">\n                      <thead>\n                        <tr>\n                          <th>").concat(__('Key'), "</th>\n                          <th></th>\n                        </tr>\n                      </thead>\n                      <tbody class=\"list-keys\">\n\n                      </tbody>\n                    </table>\n                  </div>\n                </div>\n              </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"modal\" tabindex=\"-1\">\n        <div class=\"modal-dialog\">\n            <div class=\"modal-content\">\n                <div class=\"modal-header\">\n                    <h5 class=\"modal-title\"></h5>\n                    <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n                </div>\n                <div class=\"modal-body\">\n\n                </div>\n                <div class=\"modal-footer\">\n                    <button type=\"button\" class=\"btn btn-primary btn-modal\"></button>\n                    <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\"></button>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"position-fixed bottom-0 p-2 m-4 end-0 align-items-center\">\n        <div class=\"toast hide align-items-center text-white bg-dark border-0\" role=\"alert\" aria-live=\"assertive\"\n            aria-atomic=\"true\" data-bs-delay=\"3000\">\n            <div class=\"d-flex\">\n                <div class=\"toast-body\"></div>\n                <button type=\"button\" class=\"btn-close btn-close-white me-2 m-auto\" data-bs-dismiss=\"toast\"\n                    aria-label=\"Close\"></button>\n            </div>\n        </div>\n    </div>\n    ");
  };

  var _this = {
    state: {
      firstLoad: true,
      ajaxQueue: 0,
      dataAPI: null,
      data: null
    },
    init: function init() {
      _this.getData();

      _this.getAPIData();
    },
    getAPIData: function getAPIData() {
      var params = new URLSearchParams();
      params.append("cmd", "get_site_users");
      params.append("id", spaceID());
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
        hideLoader();

        if (response.success) {
          _this.state.dataAPI = response;

          _this.startRender();
        } else {
          parseApiError(response);
        }
      })["catch"](function (error) {
        parseApiError(error);
      });
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
            }
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        _this.state.data = response;
        hideLoader();

        if (response.success) {
          initHeader(response);

          _this.startRender();
        } else {
          parseApiError(response);
        }
      })["catch"](function (error) {
        parseApiError(error);
      });
    },
    startRender: function startRender() {
      if (_this.state.data == null || _this.state.dataAPI == null) return;

      _this.loadPageStructure();

      _this.renderPage(_this.state.data);

      _this.initListeners();

      _this.initFooter();

      _this.state.firstLoad = false;
    },
    renderPage: function renderPage(product) {
      var d = document;
      initBreadcrumbs([{
        link: link('/'),
        text: __('Dashboard')
      }, {
        text: __('Users & API key')
      }]);
      var listKeys = '';

      var _iterator = _createForOfIteratorHelper(_this.state.dataAPI.keys),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var key = _step.value;
          listKeys += _this.rowKeysStruct(key);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (listKeys == '') {
        d.querySelector(".list-keys").innerHTML = "<tr><td colspan=\"2\">".concat(__('No API keys to display.'), "</td></tr>");
      } else {
        d.querySelector(".list-keys").innerHTML = listKeys;
      }

      var listUsers = '';

      for (var i in _this.state.dataAPI.users) {
        listUsers += _this.rowUserStruct(_this.state.dataAPI.kid, _this.state.dataAPI.users[i]);
      }

      if (_this.state.dataAPI.users.length == 0) {
        d.querySelector(".list").innerHTML = "<tr><td colspan=\"5\">".concat(__('No users to display.'), "</td></tr>");
      } else {
        d.querySelector(".list").innerHTML = listUsers;
      }
    },
    rowUserStruct: function rowUserStruct(kid, user) {
      var i = new Image();

      i.onload = function () {
        document.querySelector('#img' + this.kid).setAttribute('src', this.src);
      };

      i.kid = user.kid;
      i.src = 'https://kenzap.b-cdn.net/150/a' + user.kid + '_1.jpeg';
      return "\n        <tr data-sec=\"0\" >\n            <td>\n                <b>".concat(user.kid, "</b>\n            </td>\n            <td class=\"name\">\n                <div class=\"object-img\">\n                    <img id='img").concat(user.kid, "' src=\"https://account.kenzap.com/images/default_avatar.jpg\" alt=\"user avatar\">\n                </div>\n                <b>").concat(user.name, "</b>\n            </td>\n            <td>\n                <b>").concat(_this.getType(user.role), "</b>\n            </td>\n            <td>\n                <div class=\"d2 d-flex justify-content-end\">\n                    <a href=\"javascript:void(0);\" onclick=\"javascript:;\" >\n                        <svg xmlns=\"http://www.w3.org/2000/svg\" data-kid='").concat(user.kid, "' width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash text-danger edit-user d-none\" viewBox=\"0 0 16 16\">\n                            <path d=\"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z\"/>\n                            <path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\"/>\n                        </svg>\n                    </a>\n                    <a href=\"javascript:void(0);\" onclick=\"javascript:;\" >\n                        <svg xmlns=\"http://www.w3.org/2000/svg\" style=\"").concat(parseInt(user.kid) == parseInt(kid) ? 'display:none;' : '', "\"  data-kid='").concat(user.kid, "' width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash text-danger remove-user\" viewBox=\"0 0 16 16\">\n                            <path d=\"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z\"/>\n                            <path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\"/>\n                        </svg>\n                    </a>\n                </div>\n            </td>\n        </tr>");
    },
    rowKeysStruct: function rowKeysStruct(key) {
      return "\n        <tr data-sec=\"0\" >\n            <td>\n                <div style=\"font-size:12px;\">".concat(key.token, "</div>\n                <div>\n                    <div title=\"API key\" class=\"badge bg-light text-dark fw-light\">").concat(key.type == 1 ? __('Frontend') : __('Backend'), "</div>\n                    <div title=\"API key\" class=\"badge bg-light text-dark fw-light\">").concat(key.perm == 1 ? __('Read only') : __('Read & write'), "</div>\n                    <div title=\"API key\" class=\"badge bg-light text-dark fw-light\">").concat(key.iso == 1 ? __('Isolated') : __('Non isolated'), "</div>\n        \n                </div>\n            </td>\n            <td>\n                <div class=\"d2 d-flex justify-content-end\">\n                    <a href=\"javascript:void(0);\" onclick=\"javascript:;\" >\n                        <svg xmlns=\"http://www.w3.org/2000/svg\" data-id='").concat(key.id, "' width=\"16\" height=\"16\" fill=\"currentColor\" data-id=\"").concat(key.id, "\" class=\"bi bi-trash text-danger rem-key\" viewBox=\"0 0 16 16\">\n                            <path d=\"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z\"/>\n                            <path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\"/>\n                        </svg>\n                    </a>\n                </div>\n            </td>\n        </tr>");
    },
    getType: function getType(t) {
      var html = '';

      switch (t) {
        case 'admin':
          html = '<div title="Administrator" class="badge bg-danger fw-light">Administrator</div>';
          break;

        case 'editor':
          html = '<div title="Editor" class="badge bg-primary fw-light">Editor</div>';
          break;

        case 'viewer':
          html = '<div title="Viewer" class="badge bg-success fw-light">Viewer</div>';
          break;

        case 'isolated':
          html = '<div title="Isolated" class="badge bg-success fw-light">Isolated</div>';
          break;
      }

      return html;
    },
    initListeners: function initListeners() {
      onClick('.remove-user', _this.listeners.removeUser);
      onClick('.rem-key', _this.listeners.removeKey);
      if (!_this.state.firstLoad) return;
      onClick('.btn-add-user', _this.listeners.addUser);
      onClick('.btn-add-key', _this.listeners.addKey);
      onClick('.btn-remove-space', _this.listeners.removeSpace);
      onClick('.btn-rename-space', _this.listeners.renameSpace);
      onClick('.btn-add-space', _this.listeners.addSpace);
      onClick('.btn-modal', _this.listeners.modalSuccessBtn);
    },
    listeners: {
      addUser: function addUser() {
        var modal = document.querySelector(".modal");
        var modalCont = new bootstrap.Modal(modal);
        modal.querySelector(".modal-title").innerHTML = __('Add User');
        modal.querySelector(".btn-primary").innerHTML = __('Add');
        modal.querySelector(".btn-primary").classList.remove('btn-danger');
        modal.querySelector(".btn-secondary").innerHTML = __('Cancel');
        var modalHTml = "\n            <div class=\"form-cont\">\n                <div class=\"form-group\">\n                    <label for=\"ptitle\" class=\"form-label\">User role</label>\n                    <div class=\"form-check\">\n                        <label class=\"form-check-label\">\n                        <input type=\"radio\" class=\"form-check-input\" name=\"optionsRadios\" id=\"radio_1\" value=\"admin\" checked=\"checked\">\n                        ".concat(__('Administrator'), "\n                        <i class=\"input-helper\"></i></label>\n                        <p class=\"form-text\">").concat(__('Grants read, write permissions to data stored in this space. Allows API keys and user management.'), "</p>\n                    </div>\n                    <div class=\"form-check\">\n                        <label class=\"form-check-label\" class=\"form-label\">\n                        <input type=\"radio\" class=\"form-check-input\" name=\"optionsRadios\" id=\"radio_2\" value=\"editor\">\n                        ").concat(__('Editor'), "\n                        <i class=\"input-helper\"></i></label>\n                        <p class=\"form-text\">").concat(__('Grants read, write permissions to data stored in this space.'), "</p>\n                    </div>\n                    <div class=\"form-check\">\n                        <label class=\"form-check-label\" class=\"form-label\">\n                        <input type=\"radio\" class=\"form-check-input\" name=\"optionsRadios\" id=\"radio_3\" value=\"viewer\">\n                        ").concat(__('Viewer'), "\n                        <i class=\"input-helper\"></i></label>\n                        <p class=\"form-text\">").concat(__('Grants read permissions to data stored in this space.'), "</p>\n                    </div>\n                    <div class=\"form-check d-none\">\n                        <label class=\"form-check-label\" class=\"form-label\">\n                        <input type=\"radio\" class=\"form-check-input\" name=\"optionsRadios\" id=\"radio_4\" value=\"isolated\">\n                        ").concat(__('Isolated'), "\n                        <i class=\"input-helper\"></i></label>\n                        <p class=\"form-text\">").concat(__('Grants read, write permissions to data stored by this user. Provides no access to other data stored in this space.'), "</p>\n                    </div>\n                </div>\n                <div class=\"form-group\">\n                    <label for=\"ptitle\" class=\"form-label\">Method</label>\n                    <div class=\"form-check\">\n                        <label class=\"form-check-label\" class=\"form-label\">\n                        <input type=\"radio\" class=\"form-check-input\" name=\"optionsRadiosShare\" id=\"radio_share_1\" value=\"uid\" checked=\"true\">\n                        ").concat(__('By link'), "\n                        <i class=\"input-helper\"></i></label>\n                        <p class=\"form-text\">").concat(__('Provide one time sharing link to the user.'), "</p>\n                        <div class=\"link-cont\"> \n                            <input id=\"link-sharing\" type=\"text\" class=\"form-control\" id=\"uid\" onClick=\"this.setSelectionRange(0, this.value.length)\" autocomplete=\"off\" placeholder=\"\">\n                            <p class=\"form-text\">").concat(__('Send this link to the user. Link valid for 5 days.'), "</p>\n                        </div>\n                    </div>\n                    <div class=\"form-check\">\n                        <label class=\"form-check-label\">\n                        <input type=\"radio\" class=\"form-check-input\" name=\"optionsRadiosShare\" id=\"radio_share_2\" value=\"link\" >\n                        ").concat(__('By user ID'), "\n                        <i class=\"input-helper\"></i></label>\n                        <p class=\"form-text\">").concat(__('Enter user manually by providing his Kenzap user ID.'), "</p>\n                        <div class=\"user-id-cont d-none\"> \n                            <input type=\"text\" class=\"form-control\" id=\"uid\" autocomplete=\"off\" placeholder=\"100000590923\">\n                            <p class=\"form-text\">").concat(__('User ID can be found under'), " <b>").concat(__('My Account &gt; My Profile</b> section.'), "</p>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            ");
        modal.querySelector(".modal-body").innerHTML = modalHTml;
        modal.querySelector(".btn-primary").classList.add('d-none');
        onClick('#radio_share_1', function (e) {
          modal.querySelector(".link-cont").classList.remove('d-none');
          modal.querySelector(".user-id-cont").classList.add('d-none');
          modal.querySelector(".btn-primary").classList.add('d-none');
        });
        onClick('#radio_share_2', function (e) {
          modal.querySelector(".link-cont").classList.add('d-none');
          modal.querySelector(".user-id-cont").classList.remove('d-none');
          modal.querySelector(".btn-primary").classList.remove('d-none');
        });
        fetch('https://api-v1.kenzap.cloud/', {
          method: 'post',
          headers: headers,
          body: JSON.stringify({
            query: {
              token: {
                type: 'access-token'
              }
            }
          })
        }).then(function (response) {
          return response.json();
        }).then(function (response) {
          if (response.success) {
            modal.querySelector("#link-sharing").value = 'https://dashboard.kenzap.cloud/?sid=' + spaceID() + '&ott=' + response.token.token;
          } else {
            parseApiError(response);
          }
        })["catch"](function (error) {
          parseApiError(error);
        });

        _this.listeners.modalSuccessBtnFunc = function (e) {
          e.preventDefault();
          if (modal.querySelector(".btn-primary").dataset.loading === 'true') return;
          modal.querySelector(".btn-primary").dataset.loading = true;
          modal.querySelector(".btn-primary").innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' + __('Loading..');
          var uid = modal.querySelector("#uid").value;
          var role = modal.querySelector(".modal.show input[type='radio']:checked").value;

          if (uid.length < 2) {
            alert(__('Please provide longer user ID.'));
            return false;
          }

          var params = new URLSearchParams();
          params.append("cmd", "add_site_user");
          params.append("id", spaceID());
          params.append("uid", uid);
          params.append("role", role);
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
            modal.querySelector(".btn-primary").dataset.loading = false;

            if (response.success) {
              _this.getAPIData();

              modalCont.hide();
            } else {
              parseApiError(response);
            }
          })["catch"](function (error) {
            parseApiError(error);
          });
        };

        modalCont.show();
        setTimeout(function () {
          return modal.querySelector("#uid").focus();
        }, 100);
      },
      removeUser: function removeUser(e) {
        e.preventDefault();
        var kid = e.currentTarget.dataset.kid;
        var c = confirm(__('Remove this user?'));
        if (!c) return;
        var params = new URLSearchParams();
        params.append("cmd", "remove_site_user");
        params.append("id", spaceID());
        params.append("kid", kid);
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
            _this.getAPIData();
          } else {
            parseApiError(response);
          }
        })["catch"](function (error) {
          parseApiError(error);
        });
      },
      removeKey: function removeKey(e) {
        e.preventDefault();
        var c = confirm(__('Remove this key?'));
        if (!c) return;
        var params = new URLSearchParams();
        params.append("cmd", "remove_cloud_api_key");
        params.append("sid", spaceID());
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
            _this.getAPIData();
          } else {
            parseApiError(response);
          }
        })["catch"](function (error) {
          parseApiError(error);
        });
      },
      addKey: function addKey() {
        var modal = document.querySelector(".modal");
        var modalCont = new bootstrap.Modal(modal);
        modal.querySelector(".modal-title").innerHTML = __('New API Key');
        modal.querySelector(".btn-primary").innerHTML = __('Create');
        modal.querySelector(".btn-primary").classList.remove('btn-danger');
        modal.querySelector(".btn-secondary").innerHTML = __('Cancel');
        var modalHTml = "\n            <div class=\"form-cont\">\n                <div class=\"form-group\">\n\n                    <label for=\"ptitle\" class=\"form-label\">".concat(__('Access type'), "</label>\n                    <div class=\"form-check\">\n                        <label class=\"form-check-label\">\n                        <input type=\"radio\" class=\"form-check-input\" name=\"key-type\" id=\"radio_1\" value=\"1\" checked=\"checked\">\n                        ").concat(__('Frontend'), "\n                        <i class=\"input-helper\"></i></label>\n                        <p class=\"form-text\">").concat(__('Allow signed in users access this cloud space data.'), "</p>\n                    </div>\n                    <div class=\"form-check\">\n                        <label class=\"form-check-label\" class=\"form-label\">\n                        <input type=\"radio\" class=\"form-check-input text-warning\" name=\"key-type\" id=\"radio_2\" value=\"2\" >\n                        ").concat(__('Backend'), "\n                        <i class=\"input-helper\"></i></label>\n                        <p class=\"form-text\">").concat(__('Allow API data access. Does not require user sign in. Never use backend keys for frontend queries.'), "</p>\n                    </div>\n\n                    <label for=\"ptitle\" class=\"form-label\">").concat(__('Permissions'), "</label>\n                    <div class=\"form-check\">\n                        <label class=\"form-check-label\" class=\"form-label\">\n                        <input type=\"radio\" class=\"form-check-input\" name=\"key-perm\" id=\"radio_3\" value=\"1\" checked=\"checked\">\n                        ").concat(__('Read only'), "\n                        <i class=\"input-helper\"></i></label>\n                        <p class=\"form-text\">").concat(__('Grants read permissions to data stored in this space.'), "</p>\n                    </div>\n                    <div class=\"form-check\">\n                        <label class=\"form-check-label\" class=\"form-label\">\n                        <input type=\"radio\" class=\"form-check-input\" name=\"key-perm\" id=\"radio_4\" value=\"2\">\n                        ").concat(__('Read & write'), "\n                        <i class=\"input-helper\"></i></label>\n                        <p class=\"form-text\">").concat(__('Grants read and write permissions to data stored in this space.'), "</p>\n                    </div>\n\n                    <label for=\"ptitle\" class=\"form-label\">").concat(__('Isolated'), "</label>\n                    <div class=\"form-check\">\n                        <label class=\"form-check-label\" class=\"form-label\">\n                        <input type=\"radio\" class=\"form-check-input\" name=\"key-iso\" id=\"radio_4\" value=\"1\" checked=\"checked\">\n                        ").concat(__('Yes'), "\n                        <i class=\"input-helper\"></i></label>\n                        <p class=\"form-text\">").concat(__('Can only access data generated by same API key or user.'), "</p>\n                    </div>\n                    <div class=\"form-check\">\n                        <label class=\"form-check-label\" class=\"form-label\">\n                        <input type=\"radio\" class=\"form-check-input\" name=\"key-iso\" id=\"radio_5\" value=\"2\">\n                        ").concat(__('No'), "\n                        <i class=\"input-helper\"></i></label>\n                        <p class=\"form-text\">").concat(__('Can access any data in this space.'), "</p>\n                    </div>\n                </div>\n            </div>\n            ");
        modal.querySelector(".modal-body").innerHTML = modalHTml;

        _this.listeners.modalSuccessBtnFunc = function (e) {
          e.preventDefault();
          if (modal.querySelector(".btn-primary").dataset.loading === 'true') return;
          modal.querySelector(".btn-primary").dataset.loading = true;
          modal.querySelector(".btn-primary").innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' + __('Loading..');
          var type = modal.querySelector(".modal.show input[name='key-type']:checked").value;
          var perm = modal.querySelector(".modal.show input[name='key-perm']:checked").value;
          var iso = modal.querySelector(".modal.show input[name='key-iso']:checked").value;
          var params = new URLSearchParams();
          params.append("cmd", "add_cloud_api_key");
          params.append("id", spaceID());
          params.append("type", type);
          params.append("perm", perm);
          params.append("iso", iso);
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
            modal.querySelector(".btn-primary").dataset.loading = false;

            if (response.success) {
              _this.getAPIData();

              modalCont.hide();
            } else {
              parseApiError(response);
            }
          })["catch"](function (error) {
            parseApiError(error);
          });
        };

        modalCont.show();
      },
      removeSpace: function removeSpace(e) {
        var modal = document.querySelector(".modal");
        var modalCont = new bootstrap.Modal(modal);
        modal.querySelector(".modal-title").innerHTML = __('Remove cloud space #' + spaceID() + '?');
        modal.querySelector(".btn-primary").innerHTML = __('Confirm');
        modal.querySelector(".btn-primary").classList.add('btn-danger');
        modal.querySelector(".btn-secondary").innerHTML = __('Cancel');
        var modalHTml = "\n            <div class=\"form-cont\">\n                <div class=\"form-group d-none\">\n                    <label for=\"uid\" class=\"form-label\">".concat(__('User ID'), "</label>\n                    <input type=\"text\" class=\"form-control\" id=\"uid\" autocomplete=\"off\" placeholder=\"100000590923\">\n                    <p class=\"form-text\">").concat(__('User ID can be found under'), " <b>").concat(__('My Account &gt; My Profile</b> section.'), "</p>\n                </div>\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\" fill=\"currentColor\" class=\"bi bi-exclamation-circle text-danger mb-3\" viewBox=\"0 0 16 16\">\n                    <path d=\"M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z\"/>\n                    <path d=\"M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z\"/>\n                </svg>\n                <p>").concat(__('After this operation <b>all cloud stored data</b>, translations, saved extensions, API keys and user access rules will be entirely removed from Kenzap servers.</p><p>Please confirm to continue.</p>'), "</p>\n            </div>");
        modal.querySelector(".modal-body").innerHTML = modalHTml;

        _this.listeners.modalSuccessBtnFunc = function (e) {
          e.preventDefault();
          var params = new URLSearchParams();
          params.append("cmd", "remove_cloud_space");
          params.append("id", spaceID());
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
            modal.querySelector(".btn-primary").dataset.loading = false;

            if (response.success) {
              localStorage.removeItem('header-version', '');
              location.reload();
            } else {
              parseApiError(response);
            }
          })["catch"](function (error) {
            parseApiError(error);
          });
        };

        modalCont.show();
      },
      addSpace: function addSpace(e) {
        var modal = document.querySelector(".modal");
        var modalCont = new bootstrap.Modal(modal);
        modal.querySelector(".modal-title").innerHTML = __('Create new cloud space');
        modal.querySelector(".btn-primary").innerHTML = __('Create');
        modal.querySelector(".btn-primary").classList.remove('btn-danger');
        modal.querySelector(".btn-secondary").innerHTML = __('Cancel');
        var modalHTml = "\n            <div class=\"form-cont\">\n                <div class=\"form-group\">\n                    <label for=\"s-name\" class=\"form-label\">".concat(__('Space name'), "</label>\n                    <input type=\"text\" class=\"form-control\" id=\"s-name\" autocomplete=\"off\" value=\"\">\n                    <p class=\"form-text\">").concat(__('New cloud space name'), "</p>\n                </div>\n                <div class=\"form-group\">\n                    <label for=\"s-desc\" class=\"form-label\">").concat(__('Description (optional)'), "</label>\n                    <textarea type=\"text\" class=\"form-control\" id=\"s-desc\" autocomplete=\"off\" rows=\"2\" placeholder=\"\"></textarea>\n                    <p class=\"form-text\">").concat(__('Short cloud space description'), "</p>\n                </div>\n            </div>");
        modal.querySelector(".modal-body").innerHTML = modalHTml;

        _this.listeners.modalSuccessBtnFunc = function (e) {
          e.preventDefault();
          var name = document.querySelector('#s-name').value;
          var desc = document.querySelector('#s-desc').value;

          if (name.length < 5) {
            alert(__('Please provide a longer name'));
            return;
          }

          var params = new URLSearchParams();
          params.append("cmd", "new_cloud_space");
          params.append("id", spaceID());
          params.append("title", name);
          params.append("desc", desc);
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
            modal.querySelector(".btn-primary").dataset.loading = false;

            if (response.success) {
              localStorage.removeItem('header-version', '');
              location.reload();
            } else {
              parseApiError(response);
            }
          })["catch"](function (error) {
            parseApiError(error);
          });
        };

        modalCont.show();
      },
      renameSpace: function renameSpace(e) {
        var modal = document.querySelector(".modal");
        var modalCont = new bootstrap.Modal(modal);
        modal.querySelector(".modal-title").innerHTML = __('Rename cloud space #' + spaceID() + '?');
        modal.querySelector(".btn-primary").innerHTML = __('Rename');
        modal.querySelector(".btn-primary").classList.remove('btn-danger');
        modal.querySelector(".btn-secondary").innerHTML = __('Cancel');
        var modalHTml = "\n            <div class=\"form-cont\">\n                <div class=\"form-group\">\n                    <label for=\"current-name\" class=\"form-label\">".concat(__('Current name'), "</label>\n                    <input type=\"text\" class=\"form-control border-0\" id=\"current-name\" disabled=\"true\" autocomplete=\"off\" value=\"").concat(document.querySelector('#spaceSelect').innerHTML, "\">\n                    <p class=\"form-text\">").concat(__('Current cloud space name'), "</p>\n                </div>\n                <div class=\"form-group\">\n                    <label for=\"new-name\" class=\"form-label\">").concat(__('New name'), "</label>\n                    <input type=\"text\" class=\"form-control\" id=\"new-name\" autocomplete=\"off\" placeholder=\"My Space\">\n                    <p class=\"form-text\">").concat(__('New cloud space name'), "</p>\n                </div>\n            </div>");
        modal.querySelector(".modal-body").innerHTML = modalHTml;

        _this.listeners.modalSuccessBtnFunc = function (e) {
          e.preventDefault();
          var name = document.querySelector('#new-name').value;

          if (name.length < 5) {
            alert(__('Please provide a longer name'));
            return;
          }

          var params = new URLSearchParams();
          params.append("cmd", "rename_cloud_space");
          params.append("id", spaceID());
          params.append("title", name);
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
            modal.querySelector(".btn-primary").dataset.loading = false;

            if (response.success) {
              localStorage.removeItem('header-version', '');
              location.reload();
            } else {
              parseApiError(response);
            }
          })["catch"](function (error) {
            parseApiError(error);
          });
        };

        modalCont.show();
      },
      modalSuccessBtn: function modalSuccessBtn(e) {
        _this.listeners.modalSuccessBtnFunc(e);
      },
      modalSuccessBtnFunc: null
    },
    loadPageStructure: function loadPageStructure() {
      if (!_this.state.firstLoad) return;
      document.querySelector('#contents').innerHTML = HTMLContent(__);
    },
    initFooter: function initFooter$1() {
      initFooter(__('Created by %1$Kenzap%2$. ❤️ Licensed %3$GPL3%4$.', '<a class="text-muted" href="https://kenzap.com/" target="_blank">', '</a>', '<a class="text-muted" href="https://github.com/kenzap/dashboard" target="_blank">', '</a>'), '');
    }
  };

  _this.init();

})();
//# sourceMappingURL=index.js.map
