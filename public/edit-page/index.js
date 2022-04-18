
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35731/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
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
   * @name simulateClick
   * @description Trigger on click event without user interaction.
   * @param {string} elem - HTML selector, id, class, etc.
   */
   const simulateClick = (elem) => {

  	// create our event (with options)
  	let evt = new MouseEvent('click', {
  		bubbles: true,
  		cancelable: true,
  		view: window
  	});

  	// if cancelled, don't dispatch the event
  	!elem.dispatchEvent(evt);
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

  var timeConverterAgo = function timeConverterAgo(now, time) {
    console.log(now + " " + time);
    now = parseInt(now);
    time = parseInt(time);
    console.log(now + " " + time);
    var past = now - time;
    if (past < 60) return 'moments ago';
    if (past < 3600) return parseInt(past / 60) + ' minutes ago';
    if (past < 86400) return parseInt(past / 60 / 24) + ' hours ago';
    var a = new Date(time * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    a.getHours();
    a.getMinutes();
    a.getSeconds();
    var time = date + ' ' + month + ' ' + year;
    return time;
  };

  var HTMLContent = function HTMLContent(__) {
    return "\n    <div class=\"container\">\n      <div class=\"d-flex justify-content-between bd-highlight mb-3\">\n          <nav class=\"bc\" aria-label=\"breadcrumb\"></nav>\n          <div>\n            <a style=\"margin-right:16px;\" class=\"preview-link\" target=\"_blank\" href=\"#\">preview <i class=\"mdi mdi-monitor\"></i></a>\n            <button class=\"btn btn-primary btn-publish\" type=\"button\">".concat(__('Publish'), "</button>\n          </div>\n      </div>\n      \n      <div class=\"row\">\n        <div class=\"col-md-5 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card\">\n            <div class=\"accordion accordion-solid-header sections\" id=\"sections\" role=\"tablist\" style=\"width:100%;\">\n\n                <div class=\"card border-white shadow-sm br nodrag\">\n                    <div class=\"card-header border-white bg-white\" role=\"tab\" id=\"section0\">\n                        <h6 class=\"mb-0\"> \n                          <a data-bs-toggle=\"collapse\" href=\"#collapses\" data-section=\"s\" aria-expanded=\"false\" aria-controls=\"collapses\" class=\"secos collapsed text-dark\">Page Settings<div id=\"page_template\"></div> </a>\n                        </h6>\n                    </div>\n                    <div id=\"collapses\" class=\"collapse\" role=\"tabpanel\" aria-labelledby=\"sections\" data-parent=\"#sections\">\n                        <div class=\"card-body\">\n                            <div class=\"controls\">\n                                <div class=\"r row\">\n                                    <div class=\"col-md-12\">\n                                        <div class=\"form-group row\">\n                                            <label class=\"col-sm-6 col-form-label\">Page title</label>\n                                            <div class=\"col-sm-12\">\n                                                <input id=\"ptitle\" type=\"text\" data-key=\"heading\" data-type=\"text\"\n                                                    class=\"text-input form-control inps\" value=\"\" name=\"ptitle\">\n                                                <p class=\"form-text mt-2\">Used by search engines and browsers</p>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class=\"r row\">\n                                    <div class=\"col-md-12\">\n                                        <div class=\"form-group row\">\n                                            <label class=\"col-sm-6 col-form-label\">Description</label>\n                                            <div class=\"col-sm-12\">\n                                                <textarea id=\"pdesc\" type=\"text\" data-key=\"info1_desc\" data-type=\"text\"\n                                                    class=\"text-input form-control inps\"\n                                                    value=\"Various versions have evolved over the years, sometimes by accident.\"\n                                                    name=\"pdesc\" rows=\"4\"></textarea>\n                                                <p class=\"form-text mt-2\">Used by search engines and browsers</p>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n\n                                <div class=\"r row\">\n                                    <div class=\"col-md-12\">\n                                        <div class=\"form-group row\">\n                                            <label class=\"col-sm-12 col-form-label\">Heading font</label>\n                                            <div class=\"col-sm-6\">\n                                                <select id=\"font_heading\" class=\"font-input text-input form-control\">\n                                                </select>\n                                                <p class=\"form-text mt-2\"></p>\n                                            </div>\n                                            <div class=\"col-sm-3\">\n                                                <select id=\"font_heading_type\" class=\"font-input text-input form-control\">                                                    <option value=\"sans-serif\">Sans Serif</option>\n                                                    <option value=\"serif\">Serif</option>\n                                                    <option value=\"monospace\">Monospace</option>\n                                                </select>\n                                                <!-- <input id=\"heading_type\" type=\"text\" data-type=\"text\" class=\"text-input form-control inps\" value=\"\" name=\"heading_type\"> -->\n                                                <p class=\"form-text mt-2\"></p>\n                                            </div>\n                                            <div class=\"col-sm-3\">\n                                                <select id=\"font_heading_weight\"\n                                                    class=\"font-input text-input form-control\">                                                    <option value=\"100\">100</option>\n                                                    <option value=\"200\">200</option>\n                                                    <option value=\"300\">300</option>\n                                                    <option value=\"400\">400</option>\n                                                    <option value=\"500\">500</option>\n                                                    <option value=\"600\">600</option>\n                                                    <option value=\"700\">700</option>\n                                                    <option value=\"800\">800</option>\n                                                </select>\n                                                <!-- <input id=\"heading_weight\" type=\"text\" data-type=\"text\" class=\"text-input form-control inps\" value=\"\" name=\"heading_weight\"> -->\n                                                <p class=\"form-text mt-2\"></p>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class=\"r row\">\n                                    <div class=\"col-md-12\">\n                                        <div class=\"form-group row\">\n                                            <label class=\"col-sm-12 col-form-label\">Body font</label>\n                                            <div class=\"col-sm-6\">\n                                                <select id=\"font_body\" class=\"font-input text-input form-control\">\n                                                </select>\n                                                <p class=\"form-text mt-2\"></p>\n                                            </div>\n                                            <div class=\"col-sm-3\">\n                                                <select id=\"font_body_type\" class=\"font-input text-input form-control\">                                                    <option value=\"sans-serif\">Sans Serif</option>\n                                                    <option value=\"serif\">Serif</option>\n                                                    <option value=\"monospace\">Monospace</option>\n                                                </select>\n                                                <p class=\"form-text mt-2\"></p>\n                                            </div>\n                                            <div class=\"col-sm-3\">\n                                                <select id=\"font_body_weight\" class=\"font-input text-input form-control\">                                                    <option value=\"100\">100</option>\n                                                    <option value=\"200\">200</option>\n                                                    <option value=\"300\">300</option>\n                                                    <option value=\"400\">400</option>\n                                                    <option value=\"500\">500</option>\n                                                    <option value=\"600\">600</option>\n                                                    <option value=\"700\">700</option>\n                                                    <option value=\"800\">800</option>\n                                                </select>\n                                                <p class=\"form-text mt-2\"></p>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div class=\"r row\">\n                                    <div class=\"col-md-12\">\n                                        <div class=\"form-group row\">\n                                            <label class=\"col-sm-6 col-form-label\">CSS Rules</label>\n                                            <div class=\"col-sm-12\">\n                                                <textarea id=\"css_rules\" data-key=\"css_rules\" data-type=\"css_rules\"\n                                                    class=\"csseditor-input form-control w-400\" name=\"css_rules\"> </textarea>\n                                                <p class=\"form-text mt-2\">Add custom CSS rules to adjust visual look\n                                                    of the page.</p>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\n                <button type=\"button\" data-toggle=\"modal\" data-target=\"#layouts\" class=\"btn add-layout btn-outline-primary mt-2 nodrag\">Add Layout</button>\n            </div>\n        </div>\n        <div class=\"col-md-7 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card preview border-white shadow-sm \">\n\n        </div>\n      </div>\n    </div>\n\n    <div class=\"modal\" tabindex=\"-1\">\n        <div class=\"modal-dialog\">\n            <div class=\"modal-content\">\n                <div class=\"modal-header\">\n                    <h5 class=\"modal-title\"></h5>\n                    <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n                </div>\n                <div class=\"modal-body\">\n\n                </div>\n                <div class=\"modal-footer\">\n                    <button type=\"button\" class=\"btn btn-primary btn-modal\"></button>\n                    <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\"></button>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"position-fixed bottom-0 p-2 m-4 end-0 align-items-center\">\n        <div class=\"toast hide align-items-center text-white bg-dark border-0\" role=\"alert\" aria-live=\"assertive\"\n            aria-atomic=\"true\" data-bs-delay=\"3000\">\n            <div class=\"d-flex\">\n                <div class=\"toast-body\"></div>\n                <button type=\"button\" class=\"btn-close btn-close-white me-2 m-auto\" data-bs-dismiss=\"toast\"\n                    aria-label=\"Close\"></button>\n            </div>\n        </div>\n    </div>\n    ");
  };

  var _this = {
    state: {
      xhr: null,
      firstLoad: true,
      domain: '',
      page_template: "universal",
      changes: false,
      page_meta: {},
      dataAPI: null,
      data: null,
      mode: 'production',
      http_source: 'desktop',
      timer: null,
      dragulaInit: false
    },
    init: function init() {
      _this.getData();

      _this.getAPIData();
    },
    getAPIData: function getAPIData() {
      var params = new URLSearchParams();
      params.append("cmd", "get_site_data");
      params.append("id", getSiteId());
      params.append("fl", _this.getPageSlug());
      params.append("mode", _this.state.mode);
      params.append("source", 'pages');
      params.append("token", getCookie('kenzap_token'));
      fetch('https://siteapi.kenzap.cloud/v1/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
          'Kenzap-Header': localStorage.hasOwnProperty('header'),
          'Kenzap-Token': getCookie('kenzap_token'),
          'Kenzap-Sid': getSiteId()
        },
        body: params
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        if (response.success) {
          _this.state.dataAPI = response;

          _this.startRender();
        } else {
          parseApiError(response);
        }
      })["catch"](function (error) {
        console.error('Error:', error);
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
              id: getCookie('lang')
            }
          }
        })
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        _this.state.data = response;

        if (response.success) {
          initHeader(response);

          _this.startRender();
        } else {
          parseApiError(response);
        }
      })["catch"](function (error) {
        console.error('Error:', error);
      });
    },
    startRender: function startRender() {
      if (_this.state.data == null || _this.state.dataAPI == null) return;

      if (_this.state.firstLoad) {
        _this.laodScript('https://code.jquery.com/jquery-3.6.0.min.js');

        _this.laodScript('https://site.kenzap.cloud/js/controls/dragula.min.js');

        _this.laodScript('https://site.kenzap.cloud/js/controls-v2.js');

        _this.laodScript('https://site.kenzap.cloud/js/controls/ace.min.js');
      }

      _this.loadPageStructure();

      setTimeout(function () {
        _this.renderPage();
      }, 2000);

      _this.initListeners();

      _this.initFooter();

      _this.state.firstLoad = false;
    },
    renderPage: function renderPage() {
      hideLoader();
      var d = document;
      initBreadcrumbs([{
        link: link('/'),
        text: __('Dashboard')
      }, {
        link: link('/pages/'),
        text: __('Pages')
      }, {
        text: __('Edit page')
      }]);
      Controls.page = _this.state.dataAPI.data;
      _this.state.domain = _this.state.dataAPI.domain;

      _this.preview();

      _this.loadPageSettings();

      d.querySelector('.preview-link').setAttribute('href', "http://" + _this.state.domain + "/" + _this.getPageSlug() + "/?" + Math.round(new Date().getTime() / 1000));

      _this.initSections();
    },
    preview: function preview() {
      if (!document.querySelector('.preview')) return;
      var url = "https://preview.kenzap.cloud/S" + getSiteId() + "/_site";

      var slug = _this.getPageSlug();

      var iframe = document.querySelector('.preview iframe');
      var src = url + '/' + slug + '/?rand=' + +new Date();

      if (!iframe) {
        document.querySelector('.preview').innerHTML = '<iframe src="' + src + '" class="card br iload" style="width:100%;border:none;height:100%;min-height:600px;border-radius:4px;" ></iframe>';
      } else {
        document.querySelector('.preview iframe').setAttribute('src', src);
      }

      setTimeout(function () {
        document.querySelector('.preview iframe').classList.remove('iload');
      }, 1000);
    },
    loadPageSettings: function loadPageSettings() {
      var d = document;
      d.querySelector("#ptitle").value = Controls.page.title;
      d.querySelector("#pdesc").value = Controls.page.description;
      d.querySelector("#page_template").value = Controls.page.template + " template";
      _this.state.page_template = Controls.page.template;
      if (Controls.page.typography == undefined) Controls.page.typography = JSON.parse("{\"title\":\"Fonts\",\"hint\":\"Font pairs, typography settings.\",\"heading\":{\"font\":{\"title\":\"Font\",\"input\":\"font\",\"value\":\"Poppins\",\"default\":\"\",\"hint\":\"\"},\"type\":{\"title\":\"Type\",\"input\":\"text\",\"value\":\"serif\",\"default\":\"\",\"hint\":\"\"},\"weight\":{\"title\":\"Weight\",\"input\":\"text\",\"value\":\"600\",\"default\":\"\",\"hint\":\"\"}},\"body\":{\"font\":{\"title\":\"Font\",\"input\":\"font\",\"value\":\"Poppins\",\"default\":\"\",\"hint\":\"\"},\"type\":{\"title\":\"Type\",\"input\":\"text\",\"value\":\"sans-serif\",\"default\":\"\",\"hint\":\"\"},\"weight\":{\"title\":\"Weight\",\"input\":\"text\",\"value\":\"400\",\"default\":\"\",\"hint\":\"\"}}}");

      if (Controls.page.cssrules == undefined) {
        Controls.page.cssrules = {};
      }

      d.querySelector("#font_heading").value = Controls.page.typography.heading.font.value;
      d.querySelector("#font_heading_type").value = Controls.page.typography.heading.type.value;
      d.querySelector("#font_heading_weight").value = Controls.page.typography.heading.weight.value;
      d.querySelector("#font_body").value = Controls.page.typography.body.font.value;
      d.querySelector("#font_body_type").value = Controls.page.typography.body.type.value;
      d.querySelector("#font_body_weight").value = Controls.page.typography.body.weight.value;

      if (Controls.page.cssrules.value !== undefined) {
        d.querySelector("#css_rules").value = Controls.page.cssrules.value;
      }

      onChange('.font_heading', function (e) {
        e.preventDefault();
        Controls.page.typography.heading.font.value = e.currentTarget.value;

        _this.controlsUpdates();
      });
      onChange('.font_heading_type', function (e) {
        e.preventDefault();
        Controls.page.typography.heading.type.value = e.currentTarget.value;

        _this.controlsUpdates();
      });
      onChange('.font_heading_weight', function (e) {
        e.preventDefault();
        Controls.page.typography.heading.weight.value = e.currentTarget.value;

        _this.controlsUpdates();
      });
      onChange('.font_body', function (e) {
        e.preventDefault();
        Controls.page.typography.heading.font.value = e.currentTarget.value;

        _this.controlsUpdates();
      });
      onChange('.font_body_type', function (e) {
        e.preventDefault();
        Controls.page.typography.heading.type.value = e.currentTarget.value;

        _this.controlsUpdates();
      });
      onChange('.font_body_weight', function (e) {
        e.preventDefault();
        Controls.page.typography.heading.weight.value = e.currentTarget.value;

        _this.controlsUpdates();
      });
      fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBwIX97bVWr3-6AIUvGkcNnmFgirefZ6Sw', {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/x-www-form-urlencoded'
        }
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        var js = response;
        var flist = '';

        for (var f in js.items) {
          flist += '<option value="' + js.items[f].family + '">' + js.items[f].family + '</option>';
        }

        document.querySelector("#font_heading").innerHTML = flist;
        document.querySelector("#font_body").innerHTML = flist;
        document.querySelector('#font_heading [value="' + _this.state.dataAPI.data.typography.heading.font.value + '"]').selected = true;
        document.querySelector('#font_body [value="' + _this.state.dataAPI.data.typography.body.font.value + '"]').selected = true;
      })["catch"](function (error) {
        console.error('Error:', error);
      });
    },
    controlsUpdates: function controlsUpdates() {
      if (Controls.obj) {
        var action = Controls.obj.action;

        switch (action) {
          case 'section-moveup':
            _this.state.changes = true;

            _this.initSections();

            break;

          case 'section-movedown':
            _this.state.changes = true;

            _this.initSections();

            break;

          case 'section-copy':
            _this.state.changes = true;

            _this.initSections();

            break;

          case 'section-remove':
            _this.state.changes = true;

            _this.initSections();

            break;

          case 'edit':
            _this.state.changes = true;
            break;

          case 'copy':
            _this.state.changes = true;
            break;

          case 'remove':
            _this.state.changes = true;
            break;
        }
      }

      if (_this.state.timer) clearTimeout(_this.state.timer);
      _this.state.timer = setTimeout(function () {
        if (Controls.page) _this.setSiteData({
          mode: "preview",
          section: "",
          data: Controls.page
        });
      }, 1000);
    },
    initSections: function initSections() {
      document.querySelectorAll('.sections > .card.lay').forEach(function (e) {
        return e.remove();
      });
      Controls.init(".sections", Controls.page, _this.controlsUpdates, 'sections');

      _this.initDragula();
    },
    initDragula: function initDragula() {
      if (_this.state.dragulaInit) return;
      console.log("initDragula");
      _this.state.dragulaInit = true;
      var drag = dragula([document.querySelector('.sections')], {
        moves: function moves(el, source, handle, sibling) {

          return el.classList.contains('lay') && el.querySelector('[data-bs-toggle="collapse"]').classList.contains('collapsed');
        },
        accepts: function accepts(el, target, source, sibling) {
          return true;
        }
      });
      drag.on('drop', function (el) {
        console.log("drop");
        var i = 0;
        var temp = JSON.parse(JSON.stringify(Controls.page));
        document.querySelectorAll('.sections .seco').forEach(function (e) {
          var ind = e.currentTarget.dataset.section;
          Controls.page.sections[i] = temp.sections[ind];
          console.log(ind + " " + i);
          i++;
        });

        _this.setSiteData({
          mode: "preview",
          section: "",
          data: Controls.page
        });

        _this.initSections();
      });
    },
    setSiteData: function setSiteData(obj) {
      var _$$post;

      if (obj.mode == 'production') {
        showLoader();
      }

      $(".preview iframe").addClass('iload');
      if (_this.state.xhr) _this.state.xhr.abort();
      _this.state.xhr = $.post("https://siteapi.kenzap.cloud/v1/", (_$$post = {
        cmd: 'set_site_data',
        id: getSiteId(),
        fl: _this.getPageSlug(),
        page_meta: _this.state.page_meta,
        mode: _this.state.mode,
        section: obj.section,
        source: 'pages',
        data: obj.data
      }, _defineProperty(_$$post, "mode", obj.mode), _defineProperty(_$$post, "token", getCookie('kenzap_token')), _$$post), function (data, status) {
        if (data.success) {
          _this.state.changes = false;

          if (obj.mode == 'production') {
            toast(__('Latest changes are now online.'));
          }

          hideLoader();

          _this.preview();
        } else {
          parseError(data);
        }
      }, 'json');
    },
    rowStruct: function rowStruct(i) {
      return "\n        <tr>\n          <td class=\"destt\" style=\"max-width:250px;min-width:250px;\">\n            <div>\n              <a class=\"text-dark\" href=\"/edit-page/?id=".concat(_this.state.dataAPI.list[i].key + '&sid=' + getSiteId(), "\" ><b>").concat(_this.state.dataAPI.list[i].title, "</b><i style=\"color:#9b9b9b;font-size:15px;margin-left:8px;\" title=\"Edit page\" class=\"mdi mdi-pencil menu-icon edit-page\"></i></a>\n            </div>\n          </td>\n          <td>\n            <span>").concat(_this.getStatus(_this.state.dataAPI.list[i].status), "</span>\n          </td>\n          <td class=\"\">\n            <span>").concat(timeConverterAgo(_this.state.data.meta.time, _this.state.dataAPI.list[i].time), "</span>\n          </td>\n          <td>\n            <div class=\"d-flex justify-content-end\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" data-kid='").concat(_this.state.dataAPI.list[i].key, "' data-key=\"").concat(_this.state.dataAPI.list[i].key, "\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash set-home me-3 ").concat(_this.state.dataAPI.list[i].key == _this.state.dataAPI.home ? 'text-primary' : 'text-secondary', "\" viewBox=\"0 0 16 16\">\n                    <path d=\"M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z\"/>\n                </svg>\n                <svg xmlns=\"http://www.w3.org/2000/svg\" data-kid='").concat(_this.state.dataAPI.list[i].key, "' data-key=\"").concat(_this.state.dataAPI.list[i].key, "\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash text-danger remove-page\" viewBox=\"0 0 16 16\">\n                    <path d=\"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z\"/>\n                    <path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\"/>\n                </svg>\n            </div>\n          </td>\n        </tr>");
    },
    getPageSlug: function getPageSlug() {
      var urlParams = new URLSearchParams(window.location.search);
      var slug = urlParams.get('slug') ? urlParams.get('slug') : "";
      return slug;
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
      }

      return html;
    },
    initHeader: function initHeader(response) {
      onClick('.nav-back', function (e) {
        e.preventDefault();
        console.log('.nav-back');
        var link = document.querySelector('.bc ol li:nth-last-child(2)').querySelector('a');
        simulateClick(link);
      });
    },
    initListeners: function initListeners() {
      console.log('initListeners');
      if (!_this.state.firstLoad) return;
      onClick('.btn-publish', _this.listeners.publish);
      onClick('.add-layout', _this.listeners.addLayout);
      onClick('.btn-modal', _this.listeners.modalSuccessBtn);
    },
    listeners: {
      publish: function publish(e) {
        if (document.querySelector("#ptitle").value.length < 1) {
          alert(__('Please enter page title to save changes.'));
          return false;
        }

        e.preventDefault();
        if (Controls.page) _this.setSiteData({
          mode: "production",
          section: "",
          data: Controls.page
        });
      },
      addLayout: function addLayout(e) {
        var modal = document.querySelector(".modal");
        var modalCont = new bootstrap.Modal(modal);
        modal.querySelector(".modal-dialog").style.maxWidth = '700px';
        var CDN2 = 'https://static.kenzap.com';
        modal.querySelector(".modal-title").innerHTML = __('Add layout');
        modal.querySelector(".btn-primary").style.display = 'none';
        modal.querySelector(".btn-secondary").innerHTML = __('Cancel');
        showLoader();
        var params = new URLSearchParams();
        params.append("cmd", "preview_sections");
        params.append("template", 'page_template');
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
            Controls.layouts = response;
            var html = '';
            html += '<div class="row">';

            for (var key in response.res) {
              html += '<div class="col-md-6" style="margin:16px 0;">';
              html += '<h4>' + response.res[key]['meta']['title'];
              html += '<div class="br-wrapper br-theme-css-stars"><select id="profile-rating" name="rating" autocomplete="off" style="display: none;"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select><div class="br-widget"><a href="#" data-rating-value="1" data-rating-text="1" class="br-selected"></a><a href="#" data-rating-value="2" data-rating-text="2" class="br-selected"></a><a href="#" data-rating-value="3" data-rating-text="3" class="br-selected"></a><a href="#" data-rating-value="4" data-rating-text="4" class="br-selected"></a><a href="#" data-rating-value="5" data-rating-text="5" class="br-selected br-current"></a></div></div>';
              html += '</h4>';
              html += '<img alt="' + response.res[key]['meta']['title'] + '" style="max-width:100%;" src="' + CDN2 + '/preview/' + response.res[key]['template'] + '-' + response.res[key]['meta']['slug'] + '-600.jpeg?' + response.res[key]['meta']['updated'] + '" />';
              html += '<a class="sclick csection" data-index="' + key + '" >Choose this section</a>';
              html += '</div>';
            }

            html += '</div>';
            modal.querySelector(".modal-body").innerHTML = html;
            onClick('.sclick', _this.listeners.sectionClick);
          } else {
            simulateClick(simulateClick(document.querySelector('.modal .btn-close')));
            toast(__('No available layouts found.'));
          }
        })["catch"](function (error) {
          console.error('Error:', error);
        });
        modalCont.show();
      },
      sectionClick: function sectionClick(e) {
        simulateClick(document.querySelector('.modal .btn-close'));
        var layout = Controls.layouts.res[e.currentTarget.dataset.index]['extra'];
        var layout_id = Controls.layouts.res[e.currentTarget.dataset.index]['id'];
        if (Controls.page.sections == undefined) Controls.page.sections = [];
        console.log(Controls.page);
        Controls.page.sections.push(layout);
        $.post("https://siteapi.kenzap.cloud/v1/", {
          cmd: 'preload_layout',
          id: getSiteId(),
          layout_id: layout_id,
          token: getCookie('kenzap_token')
        }, function (data, status) {
          if (data.success) {
            _this.controlsUpdates();
          } else {
            parseError(data);
          }
        }, 'json');

        _this.initSections();
      },
      modalSuccessBtn: function modalSuccessBtn(e) {
        _this.listeners.modalSuccessBtnFunc(e);
      },
      modalSuccessBtnFunc: null
    },
    getStatus: function getStatus(st) {
      st = parseInt(st);

      switch (st) {
        case 0:
          return '<div class="badge bg-warning">Draft</div>';

        case 1:
          return '<div class="badge bg-primary">Published</div>';

        case 3:
          return '<div class="badge bg-danger">Unpublished</div>';

        default:
          return '<div class="badge bg-warning text-dark">Drafts</div>';
      }
    },
    laodScript: function laodScript(script) {
      var sjs = document.createElement("script");
      sjs.setAttribute("src", script + "?" + new Date().getTime());
      document.body.appendChild(sjs);
    },
    loadPageStructure: function loadPageStructure() {
      if (!_this.state.firstLoad) return;
      document.querySelector('#contents').innerHTML = HTMLContent(__);
    },
    initFooter: function initFooter$1() {
      initFooter(__('Created by %1$Kenzap%2$. ❤️ Licensed %3$GPL3%4$.', '<a class="text-muted" href="https://kenzap.com/" target="_blank">', '</a>', '<a class="text-muted" href="https://github.com/kenzap/dashboard" target="_blank">', '</a>'), __('Copyright © %1$ %2$Dashboard%3$ Extension', new Date().getFullYear(), '<a class="text-muted" href="https://github.com/kenzap/dashboard" target="_blank">', '</a>'));
    }
  };

  _this.init();

})();
//# sourceMappingURL=index.js.map
