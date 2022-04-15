// js dependencies
import { headers, showLoader, hideLoader, initHeader, initFooter, initBreadcrumbs, parseApiError, getCookie, onClick, simulateClick, getSiteId, link, toast } from '@kenzap/k-cloud';
import { timeConverterAgo} from "../_/_helpers.js"
import { HTMLContent } from "../_/_cnt_pages.js"

// where everything happens
const _this = {

    state: {
        firstLoad: true,
        ajaxQueue: 0,
        dataAPI: null,
        data: null
    },
    init: () => {
        
        _this.getData(); 
        _this.getAPIData();
    },
    getAPIData: () => {

        let params = new URLSearchParams();
        params.append("cmd", "get_pages");
        params.append("id", getSiteId());
        params.append("source", 'production');
        params.append("token", getCookie('kenzap_token'));

        // do API query
        fetch('https://siteapi.kenzap.cloud/v1/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/x-www-form-urlencoded',
                // 'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
            },
            body: params
        })
        .then(response => response.json())
        .then(response => {

            // hide UI loader
            hideLoader();

            if(response.success){

                _this.state.dataAPI = response;

                _this.startRender();

            }else{

                parseApiError(response);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    },
    getData: () => {

        // show loader during first load
        if (_this.state.firstLoad) showLoader();

        // do API query
        fetch('https://api-v1.kenzap.cloud/', {
            method: 'post',
            headers: headers,
            body: JSON.stringify({
                query: {
                    user: {
                        type:       'authenticate',
                        fields:     ['avatar'],
                        token:      getCookie('kenzap_token')
                    },
                    locale: {
                        type:       'locale',
                        id:         getCookie('lang')
                    }
                }
            })
        })
        .then(response => response.json())
        .then(response => {

            _this.state.data = response;

            // hide UI loader
            hideLoader();
            
            if(response.success){

                // init header
                initHeader(response);

                _this.startRender();

            }else{

                parseApiError(response);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    },
    startRender: () => {

        // only start when both apis have loaded
        if(_this.state.data == null || _this.state.dataAPI == null) return;

        // get core html content 
        _this.loadPageStructure();  

        // render table
        _this.renderPage(_this.state.data);

        // bind content listeners
        _this.initListeners();
    
        // initiate footer
        _this.initFooter();

        // first load
        _this.state.firstLoad = false;

    },
    renderPage: (product) => {

        let d = document;

        // initiate breadcrumbs
        initBreadcrumbs(
            [
                { link: link('/'), text: __('Dashboard') },
                { text: __('Pages') },
            ]
        );

        // bind api keys with form fields
        if (typeof(_this.state.dataAPI.keys) !== 'undefined') {
  
            d.querySelector("#api-public").value = _this.state.dataAPI.keys.public.token;
            d.querySelector("#api-restricted" ).value = _this.state.dataAPI.keys.restricted.token;
            d.querySelector("#api-private" ).value = _this.state.dataAPI.keys.private.token;
        }

        // populate user table
        let list = '';
        for (let i in _this.state.dataAPI.list) {

            list += _this.rowStruct(i);
        }

        // empty user table
        if (_this.state.dataAPI.list.length == 0) {
  
            d.querySelector(".list").innerHTML = `<tr><td colspan="5">${ __('No users to display. Please add one by clicking on the button below.') }</td></tr>`;
          
        }else{

            d.querySelector(".list").innerHTML = list;
        }
    },
    rowStruct: (i) => {

        return `
        <tr>
          <td class="destt" style="max-width:250px;min-width:250px;">
            <div>
              <a class="text-dark" href="/edit-page/?slug=${ _this.state.dataAPI.list[i].key + '&sid='+getSiteId() }" ><b>${ _this.state.dataAPI.list[i].title }</b><i style="color:#9b9b9b;font-size:15px;margin-left:8px;" title="Edit page" class="mdi mdi-pencil menu-icon edit-page"></i></a>
            </div>
          </td>
          <td>
            <span>${ _this.getStatus(_this.state.dataAPI.list[i].status) }</span>
          </td>
          <td class="">
            <span>${ timeConverterAgo( _this.state.data.meta.time, _this.state.dataAPI.list[i].time ) }</span>
          </td>
          <td>
            <div class="d-flex justify-content-end">
                <svg xmlns="http://www.w3.org/2000/svg" data-kid='${ _this.state.dataAPI.list[i].key }' data-key="${ _this.state.dataAPI.list[i].key }" width="16" height="16" fill="currentColor" class="bi bi-trash set-home me-3 ${ _this.state.dataAPI.list[i].key == _this.state.dataAPI.home? 'text-primary':'text-secondary' }" viewBox="0 0 16 16">
                    <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" data-kid='${ _this.state.dataAPI.list[i].key }' data-key="${ _this.state.dataAPI.list[i].key }" width="16" height="16" fill="currentColor" class="bi bi-trash text-danger remove-page" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
            </div>
          </td>
        </tr>`;
    },
    getType: (t) => {

        let html = '';
        switch(t){
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
    initHeader: (response) => {

        onClick('.nav-back', (e) => {

            e.preventDefault();
            console.log('.nav-back');
            let link = document.querySelector('.bc ol li:nth-last-child(2)').querySelector('a');
            simulateClick(link);
        });
    },
    initListeners: () => {

        console.log('initListeners ');

        // remove product
        onClick('.remove-page', _this.listeners.removePage);

        // set as home page
        onClick('.set-home', _this.listeners.setHome);

        if(!_this.state.firstLoad) return;

        // add user button
        onClick('.btn-add', _this.listeners.addPage);

        // add modal confirm button
        onClick('.btn-modal', _this.listeners.modalSuccessBtn);
    },
    listeners: {

        addPage: () => {

            let modal = document.querySelector(".modal");
            let modalCont = new bootstrap.Modal(modal);
            
            modal.querySelector(".modal-title").innerHTML = __('Add page');
            modal.querySelector(".btn-primary").innerHTML = __('Add');
            modal.querySelector(".btn-secondary").innerHTML = __('Cancel');

            let modalHTml = `
            <div class="form-cont">
                <div class="form-group mb-3">
                    <label for="ptitle" class="form-label">${ __('Title') }</label>
                    <input type="text" class="form-control" id="ptitle" autocomplete="off" placeholder="${ __('About Us') }">
                </div>
                <div class="form-group mb-3">
                    <label for="pdesc" class="form-label">${ __('Description') }</label>
                    <textarea class="form-control" id="pdesc" rows="4" placeholder="${ __('Our company creates services for..') }"></textarea>
                </div>
                <div class="form-group mb-3 d-none">
                    <label for="ptemplate" class="form-label">${ __('Template (Optional)') }</label>
                    <input type="text" class="form-control" id="ptemplate" autocomplete="off" placeholder="universal">
                </div>
            </div>
            `;
    
            modal.querySelector(".modal-body").innerHTML = modalHTml;

            _this.listeners.modalSuccessBtnFunc = (e) => {

                e.preventDefault();

                if(modal.querySelector(".btn-primary").dataset.loading === 'true') return;

                modal.querySelector(".btn-primary").dataset.loading = true;
                modal.querySelector(".btn-primary").innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' + __('Loading..');

                let ptitle = modal.querySelector("#ptitle").value;
                let pdesc = modal.querySelector("#pdesc").value;
                let template = 'universal';

                if(ptitle.length<2){ alert(__('Please provide a longer title.')); return false; }

                let params = new URLSearchParams();
                params.append("cmd", "create_page");
                params.append("id", getSiteId());
                params.append("t", ptitle);
                params.append("d", pdesc);
                params.append("template", template);
                params.append("token", getCookie('kenzap_token'));

                // send data
                fetch('https://siteapi.kenzap.cloud/v1/', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/x-www-form-urlencoded',
                        // 'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
                    },
                    body: params 
                })
                .then(response => response.json())
                .then(response => {

                    modal.querySelector(".btn-primary").innerHTML = __('Add');
                    if (response.success){

                        let toast = new bootstrap.Toast(document.querySelector('.toast'));
                        document.querySelector('.toast .toast-body').innerHTML = __('Page created');  
                        toast.show();

                        _this.getAPIData();
                        modal.querySelector(".btn-primary").dataset.loading = false;
                        modalCont.hide();

                    }else{

                        parseApiError(response);
                    }
                    
                    console.log('Success:', response);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }

            modalCont.show();

            setTimeout( () => modal.querySelector("#ptitle").focus(), 100 );

        },
        removePage: (e) => {

            e.preventDefault();

            let key = e.currentTarget.dataset.key;

            let c = confirm( __('Remove this page?') );

            if(!c) return;

            let params = new URLSearchParams();
            params.append("cmd", "remove_page");
            params.append("id", getSiteId());
            params.append("slug", key);
            params.append("token", getCookie('kenzap_token'));

            // send data
            fetch('https://siteapi.kenzap.cloud/v1/', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/x-www-form-urlencoded',
                    // 'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
                },
                body: params
            })
            .then(response => response.json())
            .then(response => {

                if (response.success){

                    _this.getAPIData();

                    let toast = new bootstrap.Toast(document.querySelector('.toast'));
                    document.querySelector('.toast .toast-body').innerHTML = __('Page removed');  
                    toast.show();

                }else{

                    parseApiError(response);
                }
                
                console.log('Success:', response);
            })
            .catch(error => {

                console.error('Error:', error);
            });
        },
        setHome: (e) => {

            e.preventDefault();

            let key = e.currentTarget.dataset.key;

            let c = confirm( __('Set as home page?') );

            if(!c) return;

            let params = new URLSearchParams();
            params.append("cmd", "set_homepage");
            params.append("id", getSiteId());
            params.append("key", key);
            params.append("token", getCookie('kenzap_token'));

            // send data
            fetch('https://siteapi.kenzap.cloud/v1/', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/x-www-form-urlencoded',
                    // 'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
                },
                body: params
            })
            .then(response => response.json())
            .then(response => {

                if (response.success){

                    _this.getAPIData();

                    let toast = new bootstrap.Toast(document.querySelector('.toast'));
                    document.querySelector('.toast .toast-body').innerHTML = __('New home page is set up');  
                    toast.show();

                }else{

                    parseApiError(response);
                }
                
                console.log('Success:', response);
            })
            .catch(error => {

                console.error('Error:', error);
            });
        },
        modalSuccessBtn: (e) => {
            
            _this.listeners.modalSuccessBtnFunc(e);
        },
        modalSuccessBtnFunc: null
    },
    getStatus: (st) => {

        st = parseInt(st);
        switch(st){
          case 0: return '<div class="badge bg-warning">Draft</div>';
          case 1: return '<div class="badge bg-primary">Published</div>';
          case 3: return '<div class="badge bg-danger">Unpublished</div>';
          default: return '<div class="badge bg-warning text-dark">Drafts</div>';
        }
    },
    loadPageStructure: () => {

        if(!_this.state.firstLoad) return;

        // get core html content 
        document.querySelector('#contents').innerHTML = HTMLContent(__);
    },
    initFooter: () => {
        
        initFooter(__('Created by %1$Kenzap%2$. ❤️ Licensed %3$GPL3%4$.', '<a class="text-muted" href="https://kenzap.com/" target="_blank">', '</a>', '<a class="text-muted" href="https://github.com/kenzap/dashboard" target="_blank">', '</a>'), __('Copyright © %1$ %2$Dashboard%3$ Extension', new Date().getFullYear(), '<a class="text-muted" href="https://github.com/kenzap/dashboard" target="_blank">', '</a>'));
 
        // initFooter(__('Copyright © '+new Date().getFullYear()+' <a class="text-muted" href="https://kenzap.com/" target="_blank">Kenzap</a>. All rights reserved.'), __('Kenzap Cloud Services - Dashboard'));
    }
}

_this.init();
