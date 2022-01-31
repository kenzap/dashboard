// js dependencies
import { getSiteId, simulateClick, getCookie, parseApiError, onClick, initBreadcrumbs, toast } from "../_/_helpers.js"
import { showLoader, hideLoader, initFooter } from "../_/_ui.js"
import { homeContent } from "../_/_cnt_home.js"
import { i18n } from "../_/_i18n.js"
 
// references
const __ = i18n.__;

const CDN = 'https://kenzap-sites.oss-ap-southeast-1.aliyuncs.com';

/*
<div class="col-lg-4 grid-margin stretch-card mb-4">
    <div class="card border-white shadow-sm p-sm-2 anm br" data-ext="pages">
        <div class="card-body">
            <div class="d-flex flex-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="32" fill="currentColor" class="bi bi-pencil-square me-3 mr-md-0 mr-lg-4 text-primary" viewBox="0 0 16 16" style="min-width: 32px;">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
            </svg>
            <div class="mr-4 mr-md-0 mr-lg-4 text-left text-lg-left">
                <h5 class="card-title mb-0">Pages <button type="button" class="btn-close float-end fs-6" style="margin-top:-12px;margin-right:-12px"></button></h5>
                <p class="card-description mt-1 mb-0">Update content of your website. Create new pages or update existing layouts.</p>
                <div class="link-group">
                <a class="mt-2 text-md-tight" href="/pages/?sid=1000452" data-ext="pages">Edit</a>
                </div>
            </div>
            </div>                  
        </div>
    </div>
</div>
*/


// where everything happens
const _this = {

    state: {
        firstLoad: true,
        ajaxQueue: 0,
        modalCont: null,
        ext_ids: null
    },
    init: () => {
        
        _this.getData(); 
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
                    }, 
                    dashboard: {
                        type:       'dashboard',
                    }
                }
            })
        })
        .then(response => response.json())
        .then(response => {

            // hide UI loader
            hideLoader();

            if(response.success){

                // initiate locale
                i18n.init(response.locale);

                // get core html content 
                _this.loadHomeStructure();  

                // render table
                _this.renderPage(response);

                // init header
                _this.initHeader(response);

                // bind content listeners
                _this.initListeners();
            
                // initiate footer
                _this.initFooter();

                // first load
                _this.state.firstLoad = false;

            }else{

                parseApiError(response);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    },
    renderPage: (response) => {

        let d = document;
        let html = '';
        // console.log(response.dashboard.extensions);
        _this.state.ext_ids = response.dashboard.ext_ids;
        if(response.dashboard.ext_ids) response.dashboard.ext_ids.forEach(el => {
            
            console.log(el);
            // console.log(response.dashboard.extensions[el].links);

            if(response.dashboard.extensions[el].links) response.dashboard.extensions[el].links.forEach(el_card => {

                // render links
                let links = '';
                el_card.links.forEach(link => {
                    links += `<a class="mt-2 me-2 text-md-tight" href="${ response.dashboard.extensions[el].domain ? 'https://' + response.dashboard.extensions[el].domain + '.kenzap.cloud' + link.slug : link.slug }?sid=${ getSiteId() }" data-ext="pages">${ link.text }</a>`;
                });

                // render icon
                let icon = '';
                icon = el_card.icon;

                html += `
                <div class="col-lg-4 grid-margin stretch-card mb-4">
                    <div class="card border-white shadow-sm p-sm-2 anm br" data-ext="${ el }">
                        <div class="card-body">
                            <div class="d-flex flex-row">
                            ${ icon }
                            <div class="mr-4 mr-md-0 mr-lg-4 text-left text-lg-left">
                                <h5 class="card-title mb-0">${ el_card.title } <button type="button" data-id="${ el }" class="d-none btn-close float-end fs-6 rm-ext" ></button></h5>
                                <p class="card-description mt-1 mb-0">${ el_card.description }</p>
                                <div class="link-group">
                                    ${ links }
                                </div>
                            </div>
                            </div>                  
                        </div>
                    </div>
                </div>`;
            });
        });

        html += `
        <div class="col-lg-4 grid-margin stretch-card mb-4">
            <div class="add-card border-white p-sm-2 anm br" data-ext="">
                <div class="card-body">
                    <div class="d-flex flex-row justify-content-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" fill="currentColor" style="color:#ccc;" class="bi bi-plus-circle justify-content-center p-3" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
                        </svg>
                    </div>                  
                </div>
            </div>
        </div>`;

        d.querySelector(".dash-menu .row").innerHTML = html;
        
        // initiate breadcrumbs
        initBreadcrumbs(
            [
                { text: __('Dashboard') },
            ]
        );
    },
    initHeader: (response) => {

        onClick('.nav-back', (e) => {

            e.preventDefault();
            console.log('.nav-back');
            let link = document.querySelector('.bc ol li:nth-last-child(2)').querySelector('a');
            simulateClick(link);
        });
    },
    initListeners: (type = 'partial') => {

        console.log('initListeners ');

        // block click listener
        onClick('.link-group a', _this.listeners.blockClick);

        // add card listener
        onClick('.add-card', _this.listeners.blockAddClick);

        // remove card listener
        onClick('.rm-ext', _this.listeners.blockRemoveClick);

        // listeners that can be initiated only once
        if(type == 'all'){

            // // product save button
            // onClick('.btn-save', _this.listeners.saveProduct);
            
            // // modal success button
            // onClick('.p-modal .btn-primary', _this.listeners.modalSuccessBtn);
        }
    },
    listeners: {

        blockClick: (e) => {

            
            // let href = e.currentTarget.getAttribute('href');
            // console.log();

        },
        blockAddClick: (e) => {

            let modal = document.querySelector(".modal");
            _this.state.modalCont = new bootstrap.Modal(modal);
            modal.querySelector(".modal-dialog").style.maxWidth = '700px';
            let CDN2 = 'https://static.kenzap.com';
            
            modal.querySelector(".modal-title").innerHTML = __('Add extension');
            modal.querySelector(".btn-primary").style.display = 'none';
            modal.querySelector(".btn-secondary").innerHTML = __('Cancel');

            // init params
            let params = new URLSearchParams();
            params.append("cmd", "preview_extensions");
            params.append("s", '');
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
                // hideLoader();

                if(response.success){
                   
                    let html = '';
                    html += '<div class="row">';
                    for (let key in response.res) {

                        // check if extension already added
                        html += '<div class="col-md-6" style="margin:16px 0;">';
                        html += '<h4>'+response.res[key]['extra']['title'];
                        html += '<div class="br-wrapper br-theme-css-stars"><select id="profile-rating" name="rating" autocomplete="off" style="display: none;"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select><div class="br-widget"><a href="#" data-rating-value="1" data-rating-text="1" class="br-selected"></a><a href="#" data-rating-value="2" data-rating-text="2" class="br-selected"></a><a href="#" data-rating-value="3" data-rating-text="3" class="br-selected"></a><a href="#" data-rating-value="4" data-rating-text="4" class="br-selected"></a><a href="#" data-rating-value="5" data-rating-text="5" class="br-selected br-current"></a></div></div>';
                        html += '</h4>';
                        html += '<img alt="'+response.res[key]['extra']['title']+'" style="max-width:100%;" src="'+CDN2+'/preview/'+response.res[key]['id']+'-600.jpeg?'+response.res[key]['extra']['updated']+'" />';
                        if(_this.state.ext_ids[key]){
                            html += '<span class="csection" data-id="'+response.res[key]['id']+'" data-index="'+key+'" >' + __('Already added') + '</a>';
                        }else{
                            html += '<a class="sclick csection" data-id="'+response.res[key]['id']+'" data-index="'+key+'" >' + __('Choose this extensions') + '</a>';
                        }
                        html += '</div>';
                    }
                    html += '</div>';

                    modal.querySelector(".modal-body").innerHTML = html;

                    _this.state.modalCont.show();

                    onClick('.sclick', _this.listeners.sectionClick);

                }else{

                    simulateClick(document.querySelector('.modal .btn-close'));
                    toast(__('No available extensions found.'));
                    // parseApiError(response);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        },
        blockRemoveClick: (e) => {

            let c = confirm(__('Remove extension from dashboard?'))
            if(!c) return;

            // init params
            let params = new URLSearchParams();
            params.append("cmd", "remove_extension");
            params.append("sid", getSiteId());
            params.append("id", e.currentTarget.dataset.id);
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

                if(response.success){

                    _this.getData(); 
                    toast(__('Extension removed.'));
                }else{

                    toast(__('Something went wrong, try again later.'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
        sectionClick: (e) => {

            _this.state.modalCont.hide();
            _this.launcher(e.currentTarget.dataset.id);
            console.log(e.currentTarget.dataset.id);

        },
        modalSuccessBtn: (e) => {
            
            console.log('calling modalSuccessBtnFunc');
            _this.listeners.modalSuccessBtnFunc(e);
        },
        modalSuccessBtnFunc: null
    },
    launcher: (extensions) => {

        // init params
        let params = new URLSearchParams();
        params.append("cmd", "init_extensions");
        params.append("extensions", extensions);
        params.append("sid", getSiteId());
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

            if(response.success){

                _this.getData();

                toast(__('New extension successfully added.'));
            }else{

                toast(__('Can not add extension. Please try again later.'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    },
    loadHomeStructure: () => {

        if(!_this.state.firstLoad) return;

        // get core html content 
        document.querySelector('#contents').innerHTML = homeContent(__);
    },
    initFooter: () => {
        
        initFooter(__('Copyright © '+new Date().getFullYear()+' <a class="text-muted" href="https://kenzap.com/" target="_blank">Kenzap</a>. All rights reserved.'), __('Kenzap Cloud Services - Dashboard'));
    }
}

_this.init();
