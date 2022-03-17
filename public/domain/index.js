
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35732/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
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

  var link = function link(slug) {
    var urlParams = new URLSearchParams(window.location.search);
    var sid = urlParams.get('sid') ? urlParams.get('sid') : "";
    var postfix = slug.indexOf('?') == -1 ? '?sid=' + sid : '&sid=' + sid;
    return slug + postfix;
  };
  var getSiteId = function getSiteId() {
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('sid') ? urlParams.get('sid') : "";
    return id;
  };
  var getCookie = function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];

      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }

      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }

    return "";
  };
  var parseApiError = function parseApiError(data) {
    switch (data.code) {
      case 401:
        if (window.location.href.indexOf('localhost') != -1) {
          alert('Please update user token');
        } else {
          location.href = 'https://auth.kenzap.com/?app=65432108792785&redirect=' + window.location.href;
        }

        break;

      default:
        alert(data.reason);
        break;
    }
  };
  var initBreadcrumbs = function initBreadcrumbs(data) {
    var html = '<ol class="breadcrumb mt-2 mb-0">';

    var _iterator2 = _createForOfIteratorHelper(data),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var bc = _step2.value;

        if (typeof bc.link === 'undefined') {
          html += "<li class=\"breadcrumb-item\">".concat(bc.text, "</li>");
        } else {
          html += "<li class=\"breadcrumb-item\"><a href=\"".concat(bc.link, "\">").concat(bc.text, "</a></li>");
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    html += '</ol>';
    document.querySelector(".bc").innerHTML = html;
  };
  var simulateClick = function simulateClick(elem) {
    var evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    !elem.dispatchEvent(evt);
  };
  var onClick = function onClick(sel, fn) {
    if (document.querySelector(sel)) {
      var _iterator3 = _createForOfIteratorHelper(document.querySelectorAll(sel)),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var e = _step3.value;
          e.removeEventListener('click', fn, true);
          e.addEventListener('click', fn, true);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  };

  var initHeader = function initHeader(response) {
    if (response.header) localStorage.setItem('header', response.header);

    if (!document.querySelector("#k-script")) {
      var child = document.createElement('div');
      child.innerHTML = localStorage.getItem('header');
      child = child.firstChild;
      document.body.prepend(child);
      Function(document.querySelector("#k-script").innerHTML).call('test');
    }

    if (response.locale) window.i18n.init(response.locale);
  };
  var showLoader = function showLoader() {
    var el = document.querySelector(".loader");
    if (el) el.style.display = 'block';
  };
  var hideLoader = function hideLoader() {
    var el = document.querySelector(".loader");
    if (el) el.style.display = 'none';
  };
  var initFooter = function initFooter(left, right) {
    document.querySelector("footer .row").innerHTML = "\n    <div class=\"d-sm-flex justify-content-center justify-content-sm-between\">\n        <span class=\"text-muted text-center text-sm-left d-block d-sm-inline-block\">".concat(left, "</span>\n        <span class=\"float-none float-sm-right d-block mt-1 mt-sm-0 text-center text-muted\">").concat(right, "</span>\n    </div>");
  };

  var HTMLContent = function HTMLContent(__) {
    return "\n    <div class=\"container\">\n      <div class=\"d-flex justify-content-between bd-highlight mb-3\">\n          <nav class=\"bc\" aria-label=\"breadcrumb\"></nav>\n          <button class=\"btn btn-primary btn-add d-none\" type=\"button\">".concat(__('Add user'), "</button>\n      </div> \n      \n      <div class=\"row\">\n        <div class=\"col-md-12 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card\">\n          <div class=\"card border-white shadow-sm br\">\n            <div class=\"card-body\">\n              <h4 class=\"mb-4\">").concat(__('Domain Settings'), "</h4>\n              <p class=\"card-description\">").concat(__('Connect your cloud space with a range of free premium domains.'), "</p>\n              <div class=\"domain\" style=\"max-width: 500px;\"> \n\n                <div class=\"form-group\">\n                  <div class=\"input-group\">\n\n                    <div class=\"input-group\">\n                      <input type=\"text\" style=\"text-align:right;\" class=\"form-control val-tld\" aria-label=\"\">\n                      <button class=\"btn btn-sm btn-outline-primary dropdown-toggle btn-tld\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\">.kenzap.site</button>\n                      <ul class=\"dropdown-menu dropdown-menu-end domain-list\">\n                        <li><a class=\"dropdown-item\" href=\"#\" data-key='.kenzap.site'>.kenzap.site</a></li>\n                        <li><a class=\"dropdown-item d-none\" href=\"#\" data-key='.warung.menu'>.warung.menu</a></li>\n                        <li><a class=\"dropdown-item d-none\" href=\"#\" data-key='.kenzap.tech'>.kenzap.tech</a></li>\n                        <li><hr class=\"dropdown-divider\"></li>\n                        <li><a class=\"dropdown-item\" href=\"#\" data-key='custom'>My domain</a></li>\n                      </ul>\n                    </div>\n                  </div>\n                </div>\n\n                <h5 class=\"card-title mt-4\">").concat(__('* kenzap.site domain'), "</h5>\n                <p class=\"form-text\" >").concat(__('1. Choose free premium domain from the list above'), "</p>\n                <p class=\"form-text\" >").concat(__('2. Hit publish button below'), "</p>\n                <hr> \n                <h5 class=\"card-title mt-4\">").concat(__('* my domain'), "</h5>\n                <p class=\"form-text\" >").concat(__('1. Purchase domain with your registrar'), "</p>\n                <p class=\"form-text\" >").concat(__('2. Point this domain to Kenzap Cloud'), "</p>\n                <p class=\"form-text\" >").concat(__('3. Type your domain in the field above'), "</p>\n                <p class=\"form-text\" >").concat(__('4. Hit publish button below'), "</p>\n      \n              </div>\n              <div class=\"d-flex justify-content-between bd-highlight mb-1 mt-4 align-items-center\">\n                <button type=\"button\" class=\"btn btn-outline-primary btn-fw btn-icon-text nav-deactivate btn-apply\" id=\"publish\">").concat(__('Apply changes'), "</button>\n                <p class=\"float-right form-text ms-3 mt-3\">Contact support <a href=\"mailto:support@kenzap.com\">support@kenzap.com</a></p>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>    \n    </div>\n\n    <div class=\"modal\" tabindex=\"-1\">\n        <div class=\"modal-dialog\">\n            <div class=\"modal-content\">\n                <div class=\"modal-header\">\n                    <h5 class=\"modal-title\"></h5>\n                    <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n                </div>\n                <div class=\"modal-body\">\n\n                </div>\n                <div class=\"modal-footer\">\n                    <button type=\"button\" class=\"btn btn-primary btn-modal\"></button>\n                    <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\"></button>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"position-fixed bottom-0 p-2 m-4 end-0 align-items-center\">\n        <div class=\"toast hide align-items-center text-white bg-dark border-0\" role=\"alert\" aria-live=\"assertive\"\n            aria-atomic=\"true\" data-bs-delay=\"3000\">\n            <div class=\"d-flex\">\n                <div class=\"toast-body\"></div>\n                <button type=\"button\" class=\"btn-close btn-close-white me-2 m-auto\" data-bs-dismiss=\"toast\"\n                    aria-label=\"Close\"></button>\n            </div>\n        </div>\n    </div>\n    ");
  };

  var _this = {
    state: {
      firstLoad: true,
      ajaxQueue: 0,
      tld: ['.kenzap.site', '.kenzap.tech', '.warung.menu'],
      tldType: 'custom',
      dataAPI: null,
      data: null
    },
    init: function init() {
      _this.getData();

      _this.getAPIData();
    },
    getAPIData: function getAPIData() {
      var params = new URLSearchParams();
      params.append("cmd", "get_site_domain");
      params.append("id", getSiteId());
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
        console.error('Error:', error);
      });
    },
    getData: function getData() {
      if (_this.state.firstLoad) showLoader();
      fetch('https://api-v1.kenzap.cloud/', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'text/plain',
          'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
          'Kenzap-Header': localStorage.hasOwnProperty('header'),
          'Kenzap-Token': getCookie('kenzap_token'),
          'Kenzap-Sid': getSiteId()
        },
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
        hideLoader();

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
        text: __('Domain settings')
      }]);

      if (_this.state.dataAPI.domain) {
        for (var t in _this.state.tld) {
          if (_this.state.dataAPI.domain.indexOf(_this.state.tld[t]) > 0) {
            _this.state.tldType = _this.state.tld[t];
          }
        }

        if (_this.state.tldType == 'custom') {
          d.querySelector(".val-tld").value = _this.state.dataAPI.domain;
        } else {
          var val = _this.state.dataAPI.domain.replace(_this.state.tldType, "");

          d.querySelector(".val-tld").value = val;
          d.querySelector(".val-tld").innerHTML = _this.state.tldType;
        }
      }
    },
    rowStruct: function rowStruct(kid, user) {
      var i = new Image();

      i.onload = function () {
        document.querySelector('#img' + this.kid).setAttribute('src', this.src);
      };

      i.kid = user.kid;
      i.src = 'https://kenzap.b-cdn.net/150/a' + user.kid + '_1.jpeg';
      return "\n        <tr data-sec=\"0\" >\n            <td>\n                <b>".concat(user.kid, "</b>\n            </td>\n            <td class=\"name\">\n                <div class=\"object-img\">\n                    <img id='img").concat(user.kid, "' src=\"https://account.kenzap.com/images/default_avatar.jpg\" alt=\"user avatar\">\n                </div>\n                <b>").concat(user.name, "</b>\n            </td>\n            <td>\n                <b>").concat(_this.getType(user.role), "</b>\n            </td>\n            <td>\n                <div class=\"d2 d-flex justify-content-end\">\n                    <a href=\"javascript:void(0);\" onclick=\"javascript:;\" >\n                        <svg xmlns=\"http://www.w3.org/2000/svg\" data-kid='").concat(user.kid, "' width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash text-danger edit-user d-none\" viewBox=\"0 0 16 16\">\n                            <path d=\"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z\"/>\n                            <path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\"/>\n                        </svg>\n                    </a>\n                    <a href=\"javascript:void(0);\" onclick=\"javascript:;\" >\n                        <svg xmlns=\"http://www.w3.org/2000/svg\" style=\"").concat(parseInt(user.kid) == parseInt(kid) ? 'display:none;' : '', "\"  data-kid='").concat(user.kid, "' width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash text-danger remove-user\" viewBox=\"0 0 16 16\">\n                            <path d=\"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z\"/>\n                            <path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\"/>\n                        </svg>\n                    </a>\n                </div>\n            </td>\n        </tr>");
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
      console.log('initListeners ');
      if (!_this.state.firstLoad) return;
      onClick('.domain-list li a', _this.listeners.domainChange);
      onClick('.btn-apply', _this.listeners.applyChanges);
    },
    listeners: {
      applyChanges: function applyChanges(e) {
        e.preventDefault();
        showLoader();
        if (modal.querySelector(".btn-primary").dataset.loading === 'true') return;
        document.querySelector(".btn-apply").dataset.loading = true;
        var domain = document.querySelector(".val-tld").value;
        var c = confirm(__('This will change your website URL permanently.'));
        if (!c) return;
        var toast = new bootstrap.Toast(document.querySelector('.toast'));
        if (_this.state.tldType != 'custom') domain += _this.state.tldType;
        var params = new URLSearchParams();
        params.append("cmd", "set_site_domain");
        params.append("id", getSiteId());
        params.append("domain", domain);
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
          document.querySelector(".btn-apply").dataset.loading = false;

          if (response.success) {
            document.querySelector('.toast .toast-body').innerHTML = __('Changes applied');
            toast.show();
          } else {
            parseApiError(response);
          }

          console.log('Success:', response);
        })["catch"](function (error) {
          console.error('Error:', error);
        });
      },
      domainChange: function domainChange(e) {
        e.preventDefault();
        var btn = document.querySelector('.btn-tld');
        btn.innerHTML = e.currentTarget.innerHTML;
        _this.state.tldType = e.currentTarget.dataset.key;
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
      initFooter(__('Copyright © ' + new Date().getFullYear() + ' <a class="text-muted" href="https://kenzap.com/" target="_blank">Kenzap</a>. All rights reserved.'), __('Kenzap Cloud Services - Dashboard'));
    }
  };

  _this.init();

})();
//# sourceMappingURL=index.js.map
