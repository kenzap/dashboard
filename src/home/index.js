// dependencies
import { H, showLoader, __html, html, hideLoader, initHeader, initFooter, initBreadcrumbs, parseApiError, getCookie, onClick, getSiteId, toast, spaceID } from '@kenzap/k-cloud';
import { homeContent } from "../_/_cnt_home.js"
import { getAPI, getParam } from "../_/_helpers.js"

// where everything happens
const _this = {

    state: {
        firstLoad: true,
        extLoad: false,
        ajaxQueue: 0,
        modalCont: null,
        ext_ids: null,
        
    },
    init: () => {
        
        _this.getData(); 
    },
    getData: () => {

        // show loader during first load
        if (_this.state.firstLoad) showLoader();
 
        // do API query
        fetch(getAPI(), {
            method: 'post',
            headers: {
                ...H(), 
                'Kenzap-Ott': getParam('ott')
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
                        source:      ['extension'],
                        key:         'dashboard',
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

                // init header
                initHeader(response);

                // get core html content 
                _this.loadHomeStructure();  

                // render table
                _this.render(response);

                // check launcher  
                _this.checkLauncher();

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
    render: (response) => {

        let d = document;
        let html = '';
        let forceSubscribe = false;
        _this.state.ext_ids = response.dashboard.ext_ids;
        _this.state.extensions = [];
        if(!response.dashboard.subscription) response.dashboard.subscription = { 'time': 0, 'paid': false };

        // console.log(response.dashboard.extensions);
        if(response.dashboard.ext_ids) response.dashboard.ext_ids.forEach(el => {
    
            // console.log("init card for ext: " + el);
            // console.log(response.dashboard.extensions[el]);

 
            if(response.dashboard.extensions[el]) if(response.dashboard.extensions[el].links) response.dashboard.extensions[el].links.forEach(el_card => {
                
                el_card.price = response.dashboard.extensions[el].price;
                // el_card.description = response.dashboard.extensions[el].description;
                // el_card.icon = response.dashboard.extensions[el].icon;
                // el_card.links = response.dashboard.extensions[el].links;
                // el_card.title = response.dashboard.extensions[el].title;

                // console.log(el_card);
            
                _this.state.extensions.push(el_card);
            });
        });

        // initiate breadcrumbs
        initBreadcrumbs(
            [
                { text: __html('Home') },
            ]
        );

        // response.meta.time
        // console.log((response.meta.time - response.dashboard.created) > 3600 * 24 * 30);

        // check subscription status
        if((response.meta.time - response.dashboard.created) > 3600 * 24 * 30 && !response.dashboard.subscription.paid){ forceSubscribe = true;_this.subscribe(); }

        // console.log(response.dashboard.extensions);
        if(response.dashboard.ext_ids) response.dashboard.ext_ids.forEach(el => {
            
            // console.log("init card for ext: " + el);
            // console.log(response.dashboard.extensions[el]);

            if(response.dashboard.extensions[el]) if(response.dashboard.extensions[el].links) response.dashboard.extensions[el].links.forEach(el_card => {

                // console.log(el_card);
                // _this.state.extensions.forEach(el_card => {

                // render links
                let links = '';
                el_card.links.forEach(link => {
                    links += `<a class="mt-2 me-2 text-md-tight ${ forceSubscribe && el_card.price ? 'text-light force-sub': '' }" href="${ response.dashboard.extensions[el].domain ? 'https://' + response.dashboard.extensions[el].domain + '.kenzap.cloud' + link.slug : link.slug }?sid=${ getSiteId() }" data-ext="pages">${ link.text }</a>`;
                });

                // render icon
                let icon = '';
                icon = el_card.icon;

                html += `
                <div class="col-lg-4 grid-margin stretch-card mb-4 ">
                    <div class="card border-white shadow-sm p-sm-2 anm br ${ forceSubscribe && el_card.price ? 'bg-danger': '' }" data-ext="${ el }">
                        <div class="card-body">
                            <div class="d-flex flex-row">
                                ${ forceSubscribe && el_card.price ? icon.replace('text-primary', 'text-light') : icon }
                                <div class="mr-4 mr-md-0 mr-lg-4 text-left text-lg-left ${ forceSubscribe && el_card.price ? 'text-light': '' }">
                                    <h5 class="card-title mb-0">${ el_card.title } <button type="button" data-id="${ el }" class="d-none btn-close float-end fs-6 rm-ext" ></button></h5>
                                    <p class="card-description mt-1 mb-0" >${ el_card.description }</p>
                                    <div class="link-group">
                                        ${ links }
                                    </div>
                                </div>
                            </div>                  
                        </div>
                    </div>
                </div>`;
                // });

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

        if(getParam('msg') == 'thank-you') _this.thankyou();
    },
    initListeners: (type = 'partial') => {

        // block click listener
        onClick('.link-group a', _this.listeners.blockClick);

        // add card listener
        onClick('.add-card', _this.listeners.blockAddClick);

        // remove card listener
        onClick('.rm-ext', _this.listeners.blockRemoveClick);

        // override click with force subscription
        onClick('.force-sub', _this.listeners.forceSub);

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
        forceSub: (e) => {

            e.preventDefault();

            _this.subscribe();
        },
        blockAddClick: (e) => {

            let modal = document.querySelector(".modal");
            _this.state.modalCont = new bootstrap.Modal(modal);
            modal.querySelector(".modal-dialog").style.maxWidth = '900px';
            let CDN2 = 'https://static.kenzap.com';
            
            modal.querySelector(".modal-title").innerHTML = __html('Add extension');
            modal.querySelector('.modal-footer').innerHTML = `
                <button type="button" class="btn btn-secondary " data-bs-dismiss="modal">${ __html('Close') }</button>
            `;
            // modal.querySelector(".btn-primary").style.display = 'none';
            // modal.querySelector(".btn-secondary").innerHTML = __html('Cancel');

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

                if(response.success){
                   
                    let html = '', key = 0;
                    html += '<div class="row">';
                    for (let row of response.res) {

                        // check if extension already added
                        html += '<div class="col-md-6" style="margin:16px 0;">';
                        html += '<h4>'+row['extra']['title'];
                        html += '<div class="br-wrapper br-theme-css-stars"><select id="profile-rating" name="rating" autocomplete="off" style="display: none;"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select><div class="br-widget"><a href="#" data-rating-value="1" data-rating-text="1" class="br-selected"></a><a href="#" data-rating-value="2" data-rating-text="2" class="br-selected"></a><a href="#" data-rating-value="3" data-rating-text="3" class="br-selected"></a><a href="#" data-rating-value="4" data-rating-text="4" class="br-selected"></a><a href="#" data-rating-value="5" data-rating-text="5" class="br-selected br-current"></a></div></div>';
                        html += '</h4>';
                        html += '<img alt="'+row['extra']['title']+'" class="ext-preview" src="'+CDN2+'/preview/'+row['id']+'-600.jpeg?'+row['extra']['updated']+'" />';
                        if(_this.state.ext_ids.includes(row['id'])){
                            html += '<span class="csection" data-id="'+row['extra']['slug']+'" data-index="'+key+'" >' + __html('Already added') + '</a>';
                        }else{
                            html += '<a class="sclick csection" data-id="'+row['extra']['slug']+'" data-index="'+key+'" >' + __html('Choose this extensions') + '</a>';
                        }
                        html += '</div>';
                        key++;
                    }
                    html += '</div>';

                    modal.querySelector(".modal-body").innerHTML = html;

                    _this.state.modalCont.show();

                    onClick('.sclick', _this.listeners.sectionClick);

                }else{

                    simulateClick(document.querySelector('.modal .btn-close'));
                    toast(__html('No available extensions found.'));
                    // parseApiError(response);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
        blockRemoveClick: (e) => {

            let c = confirm(__html('Remove extension from dashboard?'))
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
                    toast(__html('Extension removed.'));
                }else{

                    toast(__html('Something went wrong, try again later.'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
        sectionClick: (e) => {

            _this.state.modalCont.hide();
            _this.launcher(e.currentTarget.dataset.id);
        },
        modalSuccessBtn: (e) => {
            
            _this.listeners.modalSuccessBtnFunc(e);
        },
        modalSuccessBtnFunc: null
    },
    subscribe: () => {

        // console.log(_this.state.extensions);
        let total = _this.state.extensions.length ? _this.state.extensions.map((ext, i) => { return ext.price ? parseInt(ext.price) : 0 }).reduce((a, b) => a + b) : 0;

        // skip subscription if all extensions are free of charge 
        if(total==0) return;

        let modal = document.querySelector(".modal");
        _this.state.modalCont = new bootstrap.Modal(modal);
        modal.querySelector(".modal-dialog").style.maxWidth = '700px';
        modal.querySelector(".modal-title").innerHTML = __html('Cloud Subscription');
        // modal.querySelector(".btn-primary").style.display = 'none';
        modal.querySelector(".btn-secondary").innerHTML = __html('Cancel');
        modal.querySelector('.modal-footer').innerHTML = `
            <button type="button" class="btn btn-primary btn-modal btn-pay">${ __html('Subscribe') }</button>
            <button type="button" class="btn btn-secondary " data-bs-dismiss="modal">${ __html('Close') }</button>
        `;
        modal.querySelector(".modal-body").innerHTML = `

            <div class="form-cont ge-form">
                <img style="width:100%;max-height:240px;" class="mb-3" src="/assets/images/payment.svg">
                <div class="form-group row mb-3 d-none">
                    <label for="app-title" class="form-label col-lg-3 col-form-label">${ __html('Title') }</label>
                    <div class="col-lg-9">
                        <input type="text" class="form-control form-control-lg" id="app-title" autocomplete="off" placeholder="" value="freffre" maxlength="100">
                        <div class="invalid-feedback app-title-notice"></div> 
                        <p class="form-text">${ __html('Application title can be only defined once.') }</p>
                    </div>
                </div>

                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">${ __html('Active Extensions') }</th>
                            <th scope="col">${ __html('Price') }</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${
                            _this.state.extensions.map((ext, i) => {

                                return `
                                    <tr>
                                        <th scope="row">${ i+1 }</th>
                                        <td>${ ext.title }</td>
                                        <td>${ ext.price ? '$' + ext.price + '/month' : 'Free' }</td>
                                    </tr>
                                    `

                            }).join('')
                        }
                        <tr class="fs-6">
                            <th scope="row" colspan="2">${ __html('Total') }</th>
                            <td class="fw-bold">$${ html(total) }/month</td>
                        </tr>
                    </tbody>
                </table>
                <p class="form-text">${ __html('Activate your subscription to continue uninterrupted services.') }</p>
            </div>
            
        `;

        onClick('.btn-pay', e => {

            window.location = 'https://pay.kenzap.com/C253P'+spaceID()+'P01';
        });

        _this.state.modalCont.show();
    },
    thankyou: () => {

        let modal = document.querySelector(".modal");
        _this.state.modalCont = new bootstrap.Modal(modal);
        modal.querySelector(".modal-dialog").style.maxWidth = '600px';
        modal.querySelector(".modal-title").innerHTML = __html('Thank You');
        modal.querySelector(".btn-secondary").innerHTML = __html('close');
        modal.querySelector('.modal-footer').innerHTML = `
            <button type="button" class="btn btn-primary btn-modal btn-help">${ __html('Ask Question') }</button>
            <button type="button" class="btn btn-secondary btn-modal" data-bs-dismiss="modal">${ __html('Close') }</button>
        `;
        modal.querySelector(".modal-body").innerHTML = `

            <div class="form-cont ge-form">
                <img style="width:100%;max-height:240px;" class="mb-3" src="/assets/images/welcome.svg">
                <p class="form-text-">${ __html('Welcome to the Kenzap Cloud Community. Enjoy uninterrupted services and piority product support. If you have questions, please do not hesitate to get in touch with us.') }</p>
                
            </div>
        `;


        onClick('.btn-help', e => {

            window.location = 'https://kenzap.com/kenzap-cloud/';
        });

        _this.state.modalCont.show();

    },
    launcher: (extensions) => {

        // console.log("Adding "+extensions);

        // init params
        let params = new URLSearchParams();
        params.append("cmd", "init_extensions");
        params.append("extensions", extensions);
        params.append("sid", getSiteId());
        params.append("token", getCookie('kenzap_token'));
        
        // check if extension is not already installed
        if(document.querySelector('.anm[data-ext="'+extensions+'"]')) return;
        if(_this.state.modalCont) _this.state.modalCont.hide();

        // console.log(extensions);
        // return;

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

                toast(__html('New extension successfully added.'));
            }else{

                toast(__html('Can not add extension. Please try again later.'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    },
    checkLauncher: () => {

        if(_this.state.extLoad) return;

        // init params
        let params = new URLSearchParams(window.location.search);
        if(params.get("launcher")){
         
            let exts = params.get("launcher").split(',');
            exts.forEach(id => _this.state.ext_ids.includes(id) ? '' : _this.launcher(id));
            _this.state.extLoad = true;
        }
    },
    loadHomeStructure: () => {

        if(!_this.state.firstLoad) return;

        // get core html content 
        document.querySelector('#contents').innerHTML = homeContent(__);
    },
    initFooter: () => {
        
        initFooter(__html('Created by %1$Kenzap%2$. ❤️ Licensed %3$GPL3%4$.', '<a class="text-muted" href="https://kenzap.com/" target="_blank">', '</a>', '<a class="text-muted" href="https://github.com/kenzap/dashboard" target="_blank">', '</a>'), '');

    }
}

_this.init();
