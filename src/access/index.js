// js dependencies
import { headers, showLoader, hideLoader, initHeader, initFooter, initBreadcrumbs, parseApiError, getCookie, onClick, getSiteId, link, toast } from '@kenzap/k-cloud';
import { HTMLContent } from "../_/_cnt_access.js"

// where everything happens
const _this = {

    state: {
        firstLoad: true,
        ajaxQueue: 0,
        dataAPI: null,
        data: null,
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
        .catch(error => { parseApiError(error); });
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
                        source:      ['extension'],
                        key:         'dashboard',
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
        .catch(error => { parseApiError(error); });
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

        // populate API key table
        let listKeys = '';
        for (let key of _this.state.dataAPI.keys) {

            listKeys += _this.rowKeysStruct(key);
        }

        // empty user table
        if (listKeys == '') {
  
            d.querySelector(".list-keys").innerHTML = `<tr><td colspan="2">${ __('No API keys to display.') }</td></tr>`;
          
        }else{

            d.querySelector(".list-keys").innerHTML = listKeys;
        }

        // populate user table
        let listUsers = '';
        for (let i in _this.state.dataAPI.users) {

            listUsers += _this.rowUserStruct(_this.state.dataAPI.kid, _this.state.dataAPI.users[i]);
        }

        // empty user table
        if (_this.state.dataAPI.users.length == 0) {
  
            d.querySelector(".list").innerHTML = `<tr><td colspan="5">${ __('No users to display.') }</td></tr>`;
          
        }else{

            d.querySelector(".list").innerHTML = listUsers;
        }
    },
    rowUserStruct: (kid, user) => {
    
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
    rowKeysStruct: (key) => {

        return `
        <tr data-sec="0" >
            <td>
                <div style="font-size:12px;">${ key.token }</div>
                <div>
                    <div title="API key" class="badge bg-light text-dark fw-light">${ key.type == 1 ? __('Frontend'):__('Backend') }</div>
                    <div title="API key" class="badge bg-light text-dark fw-light">${ key.perm == 1 ? __('Read only'):__('Read & write') }</div>
                    <div title="API key" class="badge bg-light text-dark fw-light">${ key.iso == 1 ? __('Isolated'):__('Non isolated') }</div>
        
                </div>
            </td>
            <td>
                <div class="d2 d-flex justify-content-end">
                    <a href="javascript:void(0);" onclick="javascript:;" >
                        <svg xmlns="http://www.w3.org/2000/svg" data-id='${ key.id }' width="16" height="16" fill="currentColor" data-id="${ key.id }" class="bi bi-trash text-danger rem-key" viewBox="0 0 16 16">
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

        // remove user from space
        onClick('.remove-user', _this.listeners.removeUser);

        // remove space API key
        onClick('.rem-key', _this.listeners.removeKey);

        if(!_this.state.firstLoad) return;

        // add user button
        onClick('.btn-add-user', _this.listeners.addUser);

        // add API key button
        onClick('.btn-add-key', _this.listeners.addKey);
        
        // add API key button
        onClick('.btn-remove-space', _this.listeners.removeSpace);

        // rename space
        onClick('.btn-rename-space', _this.listeners.renameSpace);
        
        // add new space
        onClick('.btn-add-space', _this.listeners.addSpace);

        // add modal confirm button
        onClick('.btn-modal', _this.listeners.modalSuccessBtn);
    },
    listeners: {

        addUser: () => {

            let modal = document.querySelector(".modal");
            let modalCont = new bootstrap.Modal(modal);
            
            modal.querySelector(".modal-title").innerHTML = __('Add User');
            modal.querySelector(".btn-primary").innerHTML = __('Add');
            modal.querySelector(".btn-primary").classList.remove('btn-danger');
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
                })
                .catch(error => { parseApiError(error); });
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
            })
            .catch(error => { parseApiError(error); });
        },
        removeKey: (e) => {

            e.preventDefault();

            let c = confirm( __('Remove this key?') );

            if(!c) return;

            let params = new URLSearchParams();
            params.append("cmd", "remove_cloud_api_key");
            params.append("sid", getSiteId());
            params.append("id", e.currentTarget.dataset.id);
            params.append("token", getCookie('kenzap_token'));

            // send data
            fetch('https://siteapi.kenzap.cloud/v1/', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/x-www-form-urlencoded',
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
            })
            .catch(error => { parseApiError(error); });
        },
        addKey: () => {

            let modal = document.querySelector(".modal");
            let modalCont = new bootstrap.Modal(modal);
            
            modal.querySelector(".modal-title").innerHTML = __('New API Key');
            modal.querySelector(".btn-primary").innerHTML = __('Create');
            modal.querySelector(".btn-primary").classList.remove('btn-danger');
            modal.querySelector(".btn-secondary").innerHTML = __('Cancel');

            let modalHTml = `
            <div class="form-cont">
                <div class="form-group">

                    <label for="ptitle" class="form-label">${ __('Access type') }</label>
                    <div class="form-check">
                        <label class="form-check-label">
                        <input type="radio" class="form-check-input" name="key-type" id="radio_1" value="1" checked="checked">
                        ${ __('Frontend') }
                        <i class="input-helper"></i></label>
                        <p class="form-text">${ __('Allow signed in users access this cloud space data.') }</p>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label" class="form-label">
                        <input type="radio" class="form-check-input text-warning" name="key-type" id="radio_2" value="2" >
                        ${ __('Backend') }
                        <i class="input-helper"></i></label>
                        <p class="form-text">${ __('Allow API data access. Does not require user sign in. Never use backend keys for frontend queries.') }</p>
                    </div>

                    <label for="ptitle" class="form-label">${ __('Permissions') }</label>
                    <div class="form-check">
                        <label class="form-check-label" class="form-label">
                        <input type="radio" class="form-check-input" name="key-perm" id="radio_3" value="1" checked="checked">
                        ${ __('Read only') }
                        <i class="input-helper"></i></label>
                        <p class="form-text">${ __('Grants read permissions to data stored in this space.') }</p>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label" class="form-label">
                        <input type="radio" class="form-check-input" name="key-perm" id="radio_4" value="2">
                        ${ __('Read & write') }
                        <i class="input-helper"></i></label>
                        <p class="form-text">${ __('Grants read and write permissions to data stored in this space.') }</p>
                    </div>

                    <label for="ptitle" class="form-label">${ __('Isolated') }</label>
                    <div class="form-check">
                        <label class="form-check-label" class="form-label">
                        <input type="radio" class="form-check-input" name="key-iso" id="radio_4" value="1" checked="checked">
                        ${ __('Yes') }
                        <i class="input-helper"></i></label>
                        <p class="form-text">${ __('Can only access data generated by same API key or user.') }</p>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label" class="form-label">
                        <input type="radio" class="form-check-input" name="key-iso" id="radio_5" value="2">
                        ${ __('No') }
                        <i class="input-helper"></i></label>
                        <p class="form-text">${ __('Can access any data in this space.') }</p>
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

                let type = modal.querySelector(".modal.show input[name='key-type']:checked").value;
                let perm = modal.querySelector(".modal.show input[name='key-perm']:checked").value;
                let iso = modal.querySelector(".modal.show input[name='key-iso']:checked").value;
                
                let params = new URLSearchParams();
                params.append("cmd", "add_cloud_api_key");
                params.append("id", getSiteId());
                params.append("type", type);
                params.append("perm", perm);
                params.append("iso", iso);
                params.append("token", getCookie('kenzap_token'));

                // send data
                fetch('https://siteapi.kenzap.cloud/v1/', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/x-www-form-urlencoded',
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
                })
                .catch(error => { parseApiError(error); });
            }

            modalCont.show();

            // setTimeout( () => modal.querySelector("#uid").focus(), 100 );
        },
        removeSpace: (e) => {

            let modal = document.querySelector(".modal");
            let modalCont = new bootstrap.Modal(modal);
            
            modal.querySelector(".modal-title").innerHTML = __('Remove cloud space #' + getSiteId() + '?');
            modal.querySelector(".btn-primary").innerHTML = __('Confirm');
            modal.querySelector(".btn-primary").classList.add('btn-danger');
            modal.querySelector(".btn-secondary").innerHTML = __('Cancel');

            let modalHTml = `
            <div class="form-cont">
                <div class="form-group d-none">
                    <label for="uid" class="form-label">${ __('User ID') }</label>
                    <input type="text" class="form-control" id="uid" autocomplete="off" placeholder="100000590923">
                    <p class="form-text">${ __('User ID can be found under') } <b>${ __('My Account &gt; My Profile</b> section.') }</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-exclamation-circle text-danger mb-3" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
                <p>${ __('After this operation <b>all cloud stored data</b>, translations, saved extensions, API keys and user access rules will be entirely removed from Kenzap servers.</p><p>Please confirm to continue.</p>') }</p>
            </div>`;

            modal.querySelector(".modal-body").innerHTML = modalHTml;

            _this.listeners.modalSuccessBtnFunc = (e) => {

                e.preventDefault();
                
                let params = new URLSearchParams();
                params.append("cmd", "remove_cloud_space");
                params.append("id", getSiteId());
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

                        localStorage.removeItem('header-version', '');

                        location.reload();

                        // _this.getAPIData();

                        // modalCont.hide();

                    }else{

                        parseApiError(response);
                    }
                })
                .catch(error => { parseApiError(error); });
            };

            modalCont.show();

        },
        addSpace: (e) => {

            let modal = document.querySelector(".modal");
            let modalCont = new bootstrap.Modal(modal);
            
            modal.querySelector(".modal-title").innerHTML = __('Create new cloud space');
            modal.querySelector(".btn-primary").innerHTML = __('Create');
            modal.querySelector(".btn-primary").classList.remove('btn-danger');
            modal.querySelector(".btn-secondary").innerHTML = __('Cancel');

            let modalHTml = `
            <div class="form-cont">
                <div class="form-group">
                    <label for="s-name" class="form-label">${ __('Space name') }</label>
                    <input type="text" class="form-control" id="s-name" autocomplete="off" value="">
                    <p class="form-text">${ __('New cloud space name') }</p>
                </div>
                <div class="form-group">
                    <label for="s-desc" class="form-label">${ __('Description (optional)') }</label>
                    <textarea type="text" class="form-control" id="s-desc" autocomplete="off" rows="2" placeholder=""></textarea>
                    <p class="form-text">${ __('Short cloud space description') }</p>
                </div>
            </div>`;

            modal.querySelector(".modal-body").innerHTML = modalHTml;

            _this.listeners.modalSuccessBtnFunc = (e) => {

                e.preventDefault();

                let name = document.querySelector('#s-name').value;
                let desc = document.querySelector('#s-desc').value;
                if(name.length < 5){ alert(__('Please provide a longer name')); return; }
                // if(desc.length < 5){ alert(__('Please provide a longer name')); return; }
                
                let params = new URLSearchParams();
                params.append("cmd", "new_cloud_space");
                params.append("id", getSiteId());
                params.append("title", name);
                params.append("desc", desc);
                params.append("token", getCookie('kenzap_token'));
    
                // send data
                fetch('https://siteapi.kenzap.cloud/v1/', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/x-www-form-urlencoded',
                    },
                    body: params 
                })
                .then(response => response.json())
                .then(response => {

                    modal.querySelector(".btn-primary").dataset.loading = false;

                    if (response.success){

                        localStorage.removeItem('header-version', '');

                        location.reload();

                    }else{

                        parseApiError(response);
                    }
                })
                .catch(error => { parseApiError(error); });
            };

            modalCont.show();
        },
        renameSpace: (e) => {

            let modal = document.querySelector(".modal");
            let modalCont = new bootstrap.Modal(modal);
            
            modal.querySelector(".modal-title").innerHTML = __('Rename cloud space #' + getSiteId() + '?');
            modal.querySelector(".btn-primary").innerHTML = __('Rename');
            modal.querySelector(".btn-primary").classList.remove('btn-danger');
            modal.querySelector(".btn-secondary").innerHTML = __('Cancel');

            let modalHTml = `
            <div class="form-cont">
                <div class="form-group">
                    <label for="current-name" class="form-label">${ __('Current name') }</label>
                    <input type="text" class="form-control border-0" id="current-name" disabled="true" autocomplete="off" value="${ document.querySelector('#spaceSelect').innerHTML }">
                    <p class="form-text">${ __('Current cloud space name') }</p>
                </div>
                <div class="form-group">
                    <label for="new-name" class="form-label">${ __('New name') }</label>
                    <input type="text" class="form-control" id="new-name" autocomplete="off" placeholder="My Space">
                    <p class="form-text">${ __('New cloud space name') }</p>
                </div>
            </div>`;

            modal.querySelector(".modal-body").innerHTML = modalHTml;

            _this.listeners.modalSuccessBtnFunc = (e) => {

                e.preventDefault();

                let name = document.querySelector('#new-name').value;
                if(name.length < 5){ alert(__('Please provide a longer name')); return; }
                
                let params = new URLSearchParams();
                params.append("cmd", "rename_cloud_space");
                params.append("id", getSiteId());
                params.append("title", name);
                params.append("token", getCookie('kenzap_token'));
    
                // send data
                fetch('https://siteapi.kenzap.cloud/v1/', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/x-www-form-urlencoded',
                    },
                    body: params 
                })
                .then(response => response.json())
                .then(response => {

                    modal.querySelector(".btn-primary").dataset.loading = false;

                    if (response.success){

                        localStorage.removeItem('header-version', '');

                        location.reload();

                    }else{

                        parseApiError(response);
                    }
                })
                .catch(error => { parseApiError(error); });
            };

            modalCont.show();
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
        
        initFooter(__('Created by %1$Kenzap%2$. ❤️ Licensed %3$GPL3%4$.', '<a class="text-muted" href="https://kenzap.com/" target="_blank">', '</a>', '<a class="text-muted" href="https://github.com/kenzap/dashboard" target="_blank">', '</a>'), __('Copyright © %1$ %2$Dashboard%3$ Extension', new Date().getFullYear(), '<a class="text-muted" href="https://github.com/kenzap/dashboard" target="_blank">', '</a>'));
        // initFooter(__('Copyright © '+new Date().getFullYear()+' <a class="text-muted" href="https://kenzap.com/" target="_blank">Kenzap</a>. All rights reserved.'), __('Kenzap Cloud Services - Dashboard'));
    }
}

_this.init();
