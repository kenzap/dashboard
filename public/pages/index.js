
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
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
    return "\n    <div class=\"container\">\n      <div class=\"d-flex justify-content-between bd-highlight mb-3\">\n          <nav class=\"bc\" aria-label=\"breadcrumb\"></nav>\n          <button class=\"btn btn-primary btn-add\" type=\"button\">".concat(__('Add page'), "</button>\n      </div> \n      \n      <div class=\"row\">\n\n        <div class=\"col-md-12 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card\">\n          <div class=\"card border-white shadow-sm  br\">\n            <div class=\"card-body\">\n              <div class=\"table-responsive\">\n                <table class=\"table table-hover table-borderless align-middle table-striped table-p-list\">\n                  <thead>\n                    <tr>\n                      <th>").concat(__('Page'), "</th>\n                      <th>").concat(__('Status'), "</th>\n                      <th>").concat(__('Last update'), "</th>\n                      <th></th>\n                    </tr>\n                  </thead>\n                  <tbody class=\"list\"> </tbody>\n                </table>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>    \n    </div>\n\n    <div class=\"modal\" tabindex=\"-1\">\n        <div class=\"modal-dialog\">\n            <div class=\"modal-content\">\n                <div class=\"modal-header\">\n                    <h5 class=\"modal-title\"></h5>\n                    <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n                </div>\n                <div class=\"modal-body\">\n\n                </div>\n                <div class=\"modal-footer\">\n                    <button type=\"button\" class=\"btn btn-primary btn-modal\"></button>\n                    <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\"></button>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"position-fixed bottom-0 p-2 m-4 end-0 align-items-center\">\n        <div class=\"toast hide align-items-center text-white bg-dark border-0\" role=\"alert\" aria-live=\"assertive\"\n            aria-atomic=\"true\" data-bs-delay=\"3000\">\n            <div class=\"d-flex\">\n                <div class=\"toast-body\"></div>\n                <button type=\"button\" class=\"btn-close btn-close-white me-2 m-auto\" data-bs-dismiss=\"toast\"\n                    aria-label=\"Close\"></button>\n            </div>\n        </div>\n    </div>\n    ");
  };

  var i18n = {
    state: {
      locale: null
    },
    init: function init(locale) {
      i18n.state.locale = locale;
    },
    __: function __(text) {
      if (i18n.state.locale.values[text] === undefined) return text;
      return i18n.state.locale.values[text];
    }
  };

  var __ = i18n.__;
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
      params.append("cmd", "get_pages");
      params.append("id", getSiteId());
      params.append("source", 'production');
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
      i18n.init(_this.state.data.locale);

      _this.loadPageStructure();

      _this.renderPage(_this.state.data);

      _this.initHeader(_this.state.data);

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
        text: __('Pages')
      }]);

      if (typeof _this.state.dataAPI.keys !== 'undefined') {
        d.querySelector("#api-public").value = _this.state.dataAPI.keys["public"].token;
        d.querySelector("#api-restricted").value = _this.state.dataAPI.keys.restricted.token;
        d.querySelector("#api-private").value = _this.state.dataAPI.keys["private"].token;
      }

      var list = '';

      for (var i in _this.state.dataAPI.list) {
        list += _this.rowStruct(i);
      }

      if (_this.state.dataAPI.list.length == 0) {
        d.querySelector(".list").innerHTML = "<tr><td colspan=\"5\">".concat(__('No users to display. Please add one by clicking on the button below.'), "</td></tr>");
      } else {
        d.querySelector(".list").innerHTML = list;
      }
    },
    rowStruct: function rowStruct(i) {
      return "\n        <tr>\n          <td class=\"destt\" style=\"max-width:250px;min-width:250px;\">\n            <div>\n              <a class=\"text-dark\" href=\"/edit-page/?slug=".concat(_this.state.dataAPI.list[i].key + '&sid=' + getSiteId(), "\" ><b>").concat(_this.state.dataAPI.list[i].title, "</b><i style=\"color:#9b9b9b;font-size:15px;margin-left:8px;\" title=\"Edit page\" class=\"mdi mdi-pencil menu-icon edit-page\"></i></a>\n            </div>\n          </td>\n          <td>\n            <span>").concat(_this.getStatus(_this.state.dataAPI.list[i].status), "</span>\n          </td>\n          <td class=\"\">\n            <span>").concat(timeConverterAgo(_this.state.data.meta.time, _this.state.dataAPI.list[i].time), "</span>\n          </td>\n          <td>\n            <div class=\"d-flex justify-content-end\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" data-kid='").concat(_this.state.dataAPI.list[i].key, "' data-key=\"").concat(_this.state.dataAPI.list[i].key, "\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash set-home me-3 ").concat(_this.state.dataAPI.list[i].key == _this.state.dataAPI.home ? 'text-primary' : 'text-secondary', "\" viewBox=\"0 0 16 16\">\n                    <path d=\"M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z\"/>\n                </svg>\n                <svg xmlns=\"http://www.w3.org/2000/svg\" data-kid='").concat(_this.state.dataAPI.list[i].key, "' data-key=\"").concat(_this.state.dataAPI.list[i].key, "\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash text-danger remove-page\" viewBox=\"0 0 16 16\">\n                    <path d=\"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z\"/>\n                    <path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\"/>\n                </svg>\n            </div>\n          </td>\n        </tr>");
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
      onClick('.remove-page', _this.listeners.removePage);
      onClick('.set-home', _this.listeners.setHome);
      if (!_this.state.firstLoad) return;
      onClick('.btn-add', _this.listeners.addPage);
      onClick('.btn-modal', _this.listeners.modalSuccessBtn);
    },
    listeners: {
      addPage: function addPage() {
        var modal = document.querySelector(".modal");
        var modalCont = new bootstrap.Modal(modal);
        modal.querySelector(".modal-title").innerHTML = __('Add page');
        modal.querySelector(".btn-primary").innerHTML = __('Add');
        modal.querySelector(".btn-secondary").innerHTML = __('Cancel');
        var modalHTml = "\n            <div class=\"form-cont\">\n                <div class=\"form-group mb-3\">\n                    <label for=\"ptitle\" class=\"form-label\">".concat(__('Title'), "</label>\n                    <input type=\"text\" class=\"form-control\" id=\"ptitle\" autocomplete=\"off\" placeholder=\"").concat(__('About Us'), "\">\n                </div>\n                <div class=\"form-group mb-3\">\n                    <label for=\"pdesc\" class=\"form-label\">").concat(__('Description'), "</label>\n                    <textarea class=\"form-control\" id=\"pdesc\" rows=\"4\" placeholder=\"").concat(__('Our company creates services for..'), "\"></textarea>\n                </div>\n                <div class=\"form-group mb-3 d-none\">\n                    <label for=\"ptemplate\" class=\"form-label\">").concat(__('Template (Optional)'), "</label>\n                    <input type=\"text\" class=\"form-control\" id=\"ptemplate\" autocomplete=\"off\" placeholder=\"universal\">\n                </div>\n            </div>\n            ");
        modal.querySelector(".modal-body").innerHTML = modalHTml;

        _this.listeners.modalSuccessBtnFunc = function (e) {
          e.preventDefault();
          if (modal.querySelector(".btn-primary").dataset.loading === 'true') return;
          modal.querySelector(".btn-primary").dataset.loading = true;
          modal.querySelector(".btn-primary").innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' + __('Loading..');
          var ptitle = modal.querySelector("#ptitle").value;
          var pdesc = modal.querySelector("#pdesc").value;
          var template = 'universal';

          if (ptitle.length < 2) {
            alert(__('Please provide a longer title.'));
            return false;
          }

          var params = new URLSearchParams();
          params.append("cmd", "create_page");
          params.append("id", getSiteId());
          params.append("t", ptitle);
          params.append("d", pdesc);
          params.append("template", template);
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
            modal.querySelector(".btn-primary").innerHTML = __('Add');

            if (response.success) {
              var toast = new bootstrap.Toast(document.querySelector('.toast'));
              document.querySelector('.toast .toast-body').innerHTML = __('Page created');
              toast.show();

              _this.getAPIData();

              modal.querySelector(".btn-primary").dataset.loading = false;
              modalCont.hide();
            } else {
              parseApiError(response);
            }

            console.log('Success:', response);
          })["catch"](function (error) {
            console.error('Error:', error);
          });
        };

        modalCont.show();
        setTimeout(function () {
          return modal.querySelector("#ptitle").focus();
        }, 100);
      },
      removePage: function removePage(e) {
        e.preventDefault();
        var key = e.currentTarget.dataset.key;
        var c = confirm(__('Remove this page?'));
        if (!c) return;
        var params = new URLSearchParams();
        params.append("cmd", "remove_page");
        params.append("id", getSiteId());
        params.append("slug", key);
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

            var toast = new bootstrap.Toast(document.querySelector('.toast'));
            document.querySelector('.toast .toast-body').innerHTML = __('Page removed');
            toast.show();
          } else {
            parseApiError(response);
          }

          console.log('Success:', response);
        })["catch"](function (error) {
          console.error('Error:', error);
        });
      },
      setHome: function setHome(e) {
        e.preventDefault();
        var key = e.currentTarget.dataset.key;
        var c = confirm(__('Set as home page?'));
        if (!c) return;
        var params = new URLSearchParams();
        params.append("cmd", "set_homepage");
        params.append("id", getSiteId());
        params.append("key", key);
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

            var toast = new bootstrap.Toast(document.querySelector('.toast'));
            document.querySelector('.toast .toast-body').innerHTML = __('New home page is set up');
            toast.show();
          } else {
            parseApiError(response);
          }

          console.log('Success:', response);
        })["catch"](function (error) {
          console.error('Error:', error);
        });
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
