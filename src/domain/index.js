// js dependencies
import { getSiteId, simulateClick, getCookie, parseApiError, onClick, initBreadcrumbs, link } from "../_/_helpers.js"
import { showLoader, hideLoader, initHeader, initFooter } from "../_/_ui.js"
import { HTMLContent } from "../_/_cnt_domain.js"

// where everything happens
const _this = {

    state: {
        firstLoad: true,
        ajaxQueue: 0,
        tld: ['.kenzap.site', '.kenzap.tech', '.warung.menu'],
        tldType: 'custom',
        dataAPI: null,
        data: null
    },
    init: () => {
        
        _this.getData(); 
        _this.getAPIData();
    },
    getAPIData: () => {

        let params = new URLSearchParams();
        params.append("cmd", "get_site_domain");
        params.append("id", getSiteId());
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
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'text/plain',
                'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
                'Kenzap-Header': localStorage.hasOwnProperty('header'),
                'Kenzap-Token': getCookie('kenzap_token'),
                'Kenzap-Sid': getSiteId(),
            },
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
                { text: __('Domain settings') },
            ]
        )
        
        if (_this.state.dataAPI.domain) {

            // detect if kenzap domain
            for(let t in _this.state.tld){ if(_this.state.dataAPI.domain.indexOf(_this.state.tld[t])>0){ _this.state.tldType = _this.state.tld[t]; } }
            if(_this.state.tldType == 'custom'){
              
                d.querySelector(".val-tld").value = _this.state.dataAPI.domain;
                // $(".val-tld").val(_this.state.dataAPI.domain);
            }else{
  
                let val = _this.state.dataAPI.domain.replace(_this.state.tldType, "");

                d.querySelector(".val-tld").value = val;
                d.querySelector(".val-tld").innerHTML = _this.state.tldType;

                //   $(".val-tld").val(val);
                //   $(".btn-tld").html(_this.state.tldType);
            }
        };

        // // bind api keys with form fields
        // if (typeof(_this.state.dataAPI.keys) !== 'undefined') {
  
        //     d.querySelector("#api-public").value = _this.state.dataAPI.keys.public.token;
        //     d.querySelector("#api-restricted" ).value = _this.state.dataAPI.keys.restricted.token;
        //     d.querySelector("#api-private" ).value = _this.state.dataAPI.keys.private.token;
        // }

        // // populate user table
        // let list = '';
        // for (var i in _this.state.dataAPI.users) {

        //     list += _this.rowStruct(_this.state.dataAPI.kid, _this.state.dataAPI.users[i]);
        // }

        // // empty user table
        // if (_this.state.dataAPI.users.length == 0) {
  
        //     d.querySelector(".list").innerHTML = `<tr><td colspan="5">${ __('No users to display. Please add one by clicking on the button below.') }</td></tr>`;
          
        // }else{

        //     d.querySelector(".list").innerHTML = list;
        // }
    },
    rowStruct: (kid, user) => {
    
        let i = new Image();
        i.onload = function(){ document.querySelector('#img'+this.kid).setAttribute('src', this.src); };
        i.kid = user.kid;
        i.src = 'https://kenzap.b-cdn.net/150/a'+user.kid+'_1.jpeg';

        return `
        <tr data-sec="0" >
            <td>
                <b>${ user.kid }</b>
            </td>
            <td class="name">
                <div class="object-img">
                    <img id='img${ user.kid }' src="https://account.kenzap.com/images/default_avatar.jpg" alt="user avatar">
                </div>
                <b>${ user.name }</b>
            </td>
            <td>
                <b>${ _this.getType(user.role) }</b>
            </td>
            <td>
                <div class="d2 d-flex justify-content-end">
                    <a href="javascript:void(0);" onclick="javascript:;" >
                        <svg xmlns="http://www.w3.org/2000/svg" data-kid='${ user.kid }' width="16" height="16" fill="currentColor" class="bi bi-trash text-danger edit-user d-none" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </a>
                    <a href="javascript:void(0);" onclick="javascript:;" >
                        <svg xmlns="http://www.w3.org/2000/svg" style="${ parseInt(user.kid) == parseInt(kid) ? 'display:none;':'' }"  data-kid='${ user.kid }' width="16" height="16" fill="currentColor" class="bi bi-trash text-danger remove-user" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </a>
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


        if(!_this.state.firstLoad) return;

        // domain change listener
        onClick('.domain-list li a', _this.listeners.domainChange);

        // add user button
        onClick('.btn-apply', _this.listeners.applyChanges);

        // add modal confirm button
        // onClick('.btn-modal', _this.listeners.modalSuccessBtn);
    },
    listeners: {

        applyChanges: (e) => {

            e.preventDefault();

            showLoader();

            if(modal.querySelector(".btn-primary").dataset.loading === 'true') return;
            
            document.querySelector(".btn-apply").dataset.loading = true;

            // document.querySelector(".btn-apply").innerHTML =  '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' + __('Loading..');

            let domain = document.querySelector(".val-tld").value;

            let c = confirm(__('This will change your website URL permanently.'));

            if(!c) return;

            // initialzie toas
            let toast = new bootstrap.Toast(document.querySelector('.toast'));

            // add kenzap domain if no custom damain is provided
            if(_this.state.tldType != 'custom') domain += _this.state.tldType;

            // init params
            let params = new URLSearchParams();
            params.append("cmd", "set_site_domain");
            params.append("id", getSiteId());
            params.append("domain", domain);
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

                document.querySelector(".btn-apply").dataset.loading = false;
                // document.querySelector(".btn-apply").innerHTML = __('Apply changes');

                if (response.success){

                    document.querySelector('.toast .toast-body').innerHTML = __('Changes applied');  
                    toast.show();
                    // _this.getAPIData();
                }else{

                    parseApiError(response);
                }
                
                console.log('Success:', response);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
        domainChange: (e) => {

            e.preventDefault();
            
            // console.log(e.currentTarget.dataset.key);
    
            let btn = document.querySelector('.btn-tld');
            btn.innerHTML = e.currentTarget.innerHTML;
            _this.state.tldType = e.currentTarget.dataset.key;

            // if(e.currentTarget.dataset.key == "custom"){
            //     btn.innerHTML = __('All')
            //     // btn.dataset.value = '';
            // }else{
            //     btnos.innerHTML = _this.state.statuses[e.currentTarget.dataset.key].text;
            //     // btn.dataset.value = e.currentTarget.dataset.key;
            // }
        },

        modalSuccessBtn: (e) => {
            
            _this.listeners.modalSuccessBtnFunc(e);
        },

        modalSuccessBtnFunc: null
    },
    loadPageStructure: () => {

        if(!_this.state.firstLoad) return;

        // get core html content 
        document.querySelector('#contents').innerHTML = HTMLContent(__);
    },
    initFooter: () => {
        
        initFooter(__('Copyright © '+new Date().getFullYear()+' <a class="text-muted" href="https://kenzap.com/" target="_blank">Kenzap</a>. All rights reserved.'), __('Kenzap Cloud Services - Dashboard'));
    }
}

_this.init();
