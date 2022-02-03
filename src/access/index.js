// js dependencies
import { getSiteId, simulateClick, getCookie, parseApiError, onClick, initBreadcrumbs, link } from "../_/_helpers.js"
import { showLoader, hideLoader, initHeader, initFooter } from "../_/_ui.js"
import { HTMLContent } from "../_/_cnt_access.js"

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
        params.append("cmd", "get_site_users");
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
                { text: __('Users & API key') },
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
        for (var i in _this.state.dataAPI.users) {

            list += _this.rowStruct(_this.state.dataAPI.kid, _this.state.dataAPI.users[i]);
        }

        // empty user table
        if (_this.state.dataAPI.users.length == 0) {
  
            d.querySelector(".list").innerHTML = `<tr><td colspan="5">${ __('No users to display. Please add one by clicking on the button below.') }</td></tr>`;
          
        }else{

            d.querySelector(".list").innerHTML = list;
        }
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
            case 'isolated':
                html = '<div title="Isolated" class="badge bg-success fw-light">Isolated</div>';
            break;
        }
        return html;
    },
    initListeners: () => {

        console.log('initListeners ');

        // remove product
        onClick('.remove-user', _this.listeners.removeUser);

        if(!_this.state.firstLoad) return;

        // add user button
        onClick('.btn-add', _this.listeners.addUser);

        // add modal confirm button
        onClick('.btn-modal', _this.listeners.modalSuccessBtn);
    },
    listeners: {

        addUser: () => {

            let modal = document.querySelector(".modal");
            let modalCont = new bootstrap.Modal(modal);
            
            modal.querySelector(".modal-title").innerHTML = __('Add User');
            modal.querySelector(".btn-primary").innerHTML = __('Add');
            modal.querySelector(".btn-secondary").innerHTML = __('Cancel');

            let modalHTml = `
            <div class="form-cont">
                <div class="form-group">
                    <label for="uid" class="form-label">${ __('User ID') }</label>
                    <input type="text" class="form-control" id="uid" autocomplete="off" placeholder="100000590923">
                    <p class="form-text">${ __('User ID can be found under') } <b>${ __('My Account &gt; My Profile</b> section.') }</p>
                </div>
                <div class="form-group">
                    <label for="ptitle" class="form-label">User Role</label>
                    <div class="form-check">
                        <label class="form-check-label">
                        <input type="radio" class="form-check-input" name="optionsRadios" id="radio_1" value="admin" checked="checked">
                        ${ __('Administrator') }
                        <i class="input-helper"></i></label>
                        <p class="form-text">${ __('Grants read, write permissions to data stored in this space. Allows API keys and user management.') }</p>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label" class="form-label">
                        <input type="radio" class="form-check-input" name="optionsRadios" id="radio_2" value="editor">
                        ${ __('Editor') }
                        <i class="input-helper"></i></label>
                        <p class="form-text">${ __('Grants read, write permissions to data stored in this space.') }</p>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label" class="form-label">
                        <input type="radio" class="form-check-input" name="optionsRadios" id="radio_3" value="viewer">
                        ${ __('Viewer') }
                        <i class="input-helper"></i></label>
                        <p class="form-text">${ __('Grants read permissions to data stored in this space.') }</p>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label" class="form-label">
                        <input type="radio" class="form-check-input" name="optionsRadios" id="radio_4" value="isolated">
                        ${ __('Isolated') }
                        <i class="input-helper"></i></label>
                        <p class="form-text">${ __('Grants read, write permissions to data stored by this user. Provides no access to other data stored in this space.') }</p>
                    </div>
                </div>
            </div>
            `;

            modal.querySelector(".modal-body").innerHTML = modalHTml;

            _this.listeners.modalSuccessBtnFunc = (e) => {

                e.preventDefault();

                if(modal.querySelector(".btn-primary").dataset.loading === 'true') return;

                modal.querySelector(".btn-primary").dataset.loading = true;
                modal.querySelector(".btn-primary").innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' + __('Loading..');

                let uid = modal.querySelector("#uid").value;
                let role = modal.querySelector(".modal.show input[type='radio']:checked").value;
                if(uid.length<2){ alert(__('Please provide longer user ID.')); return false; }

                let params = new URLSearchParams();
                params.append("cmd", "add_site_user");
                params.append("id", getSiteId());
                params.append("uid", uid);
                params.append("role", role);
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

                    modal.querySelector(".btn-primary").dataset.loading = false;

                    if (response.success){

                        _this.getAPIData();
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

            setTimeout( () => modal.querySelector("#uid").focus(), 100 );

        },
        removeUser: (e) => {

            e.preventDefault();

            let kid = e.currentTarget.dataset.kid;

            let c = confirm( __('Remove this user?') );

            if(!c) return;

            let params = new URLSearchParams();
            params.append("cmd", "remove_site_user");
            params.append("id", getSiteId());
            params.append("kid", kid);
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
