// js dependencies
import { headers, showLoader, hideLoader, initHeader, initFooter, initBreadcrumbs, parseApiError, getCookie, onClick, simulateClick, getSiteId, link, toast } from '@kenzap/k-cloud';
import { timeConverterAgo } from "../_/_helpers.js"
import { HTMLContent } from "../_/_cnt_page_edit.js"

// where everything happens
const _this = {

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
    init: () => {
        
        _this.getData(); 
        _this.getAPIData();
    },
    getAPIData: () => {

        let params = new URLSearchParams();
        params.append("cmd", "get_site_data");
        params.append("id", getSiteId());
        params.append("fl", _this.getPageSlug());
        params.append("mode", _this.state.mode);
        params.append("source", 'pages');
        params.append("token", getCookie('kenzap_token'));

        // do API query
        fetch('https://siteapi.kenzap.cloud/v1/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + getCookie('kenzap_api_key'),
                'Kenzap-Header': localStorage.hasOwnProperty('header'),
                'Kenzap-Token': getCookie('kenzap_token'),
                'Kenzap-Sid': getSiteId(), 
            }, 
            body: params
        })
        .then(response => response.json())
        .then(response => {

            // hide UI loader
            // hideLoader();

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
            // hideLoader();
            
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

        // load dependencies
        if(_this.state.firstLoad){

            _this.laodScript('https://code.jquery.com/jquery-3.6.0.min.js');
            _this.laodScript('https://site.kenzap.cloud/js/controls/dragula.min.js');
            _this.laodScript('https://site.kenzap.cloud/js/controls-v2.js');
            _this.laodScript('https://site.kenzap.cloud/js/controls/ace.min.js');  
        }

        // get core html content 
        _this.loadPageStructure();  

        // render table
        setTimeout(function(){ _this.renderPage(); },2000);

        // bind content listeners
        _this.initListeners();
    
        // initiate footer
        _this.initFooter();

        // first load
        _this.state.firstLoad = false;

    },
    renderPage: () => {

        hideLoader();

        let d = document;

        // initiate breadcrumbs
        initBreadcrumbs(
            [
                { link: link('/'), text: __('Dashboard') },
                { link: link('/pages/'), text: __('Pages') },
                { text: __('Edit page') },
            ]
        );

        // bind data
        Controls.page = _this.state.dataAPI.data;

        // get public domain
        _this.state.domain = _this.state.dataAPI.domain;

        // preview
        _this.preview();
        
        // page settings
        _this.loadPageSettings();

        // TODO mobile app
        // if(_this.http_source!="mobile") initBreadcrumbs('sites/site/pages/',[{'text':Controls.page.title}]);
          
        // website preview link
        d.querySelector('.preview-link').setAttribute('href', "http://"+_this.state.domain+"/"+_this.getPageSlug()+"/?"+(Math.round(new Date().getTime()/1000)));

        // init sections
        _this.initSections();
    },
    preview: () => {

        // stop if no preview window present (mobile app version)
        if(!document.querySelector('.preview')) return;

        let url = "https://preview.kenzap.cloud/S"+getSiteId()+"/_site";
        // if(mode == 'production' && domain != undefined) url = 'https://'+domain;

        let slug = _this.getPageSlug();
        let iframe = document.querySelector('.preview iframe');
        let src = url+'/'+slug+'/?rand='+ (+ new Date());
        if(!iframe){

            document.querySelector('.preview').innerHTML = '<iframe src="'+src+'" class="card br iload" style="width:100%;border:none;height:100%;min-height:600px;border-radius:4px;" ></iframe>'
        }else{

            document.querySelector('.preview iframe').setAttribute('src', src);
            // $(".preview iframe").attr('src', src);
        }
        setTimeout(function(){ document.querySelector('.preview iframe').classList.remove('iload'); }, 1000); // $(".preview iframe").removeClass('iload'); 
    },
    loadPageSettings: () => {

        let d = document;

        // bind page settings 
        d.querySelector("#ptitle").value = Controls.page.title;
        d.querySelector("#pdesc").value = Controls.page.description;
        d.querySelector("#page_template").value = Controls.page.template+" template"; _this.state.page_template = Controls.page.template;

        // live update breadcrumb
        // $("#ptitle").keyup(function(){ Controls.page.title = this.value; $(".breadcrumb-item.active").html(this.value); controlsUpdates(); });
        // $("#pdesc").keyup(function(){ console.log(this.value); Controls.page.description = this.value; controlsUpdates(); });
    
        // console.log(Controls.page.typography.heading.font.value);
        if(Controls.page.typography == undefined) Controls.page.typography = JSON.parse("{\"title\":\"Fonts\",\"hint\":\"Font pairs, typography settings.\",\"heading\":{\"font\":{\"title\":\"Font\",\"input\":\"font\",\"value\":\"Poppins\",\"default\":\"\",\"hint\":\"\"},\"type\":{\"title\":\"Type\",\"input\":\"text\",\"value\":\"serif\",\"default\":\"\",\"hint\":\"\"},\"weight\":{\"title\":\"Weight\",\"input\":\"text\",\"value\":\"600\",\"default\":\"\",\"hint\":\"\"}},\"body\":{\"font\":{\"title\":\"Font\",\"input\":\"font\",\"value\":\"Poppins\",\"default\":\"\",\"hint\":\"\"},\"type\":{\"title\":\"Type\",\"input\":\"text\",\"value\":\"sans-serif\",\"default\":\"\",\"hint\":\"\"},\"weight\":{\"title\":\"Weight\",\"input\":\"text\",\"value\":\"400\",\"default\":\"\",\"hint\":\"\"}}}");
        if(Controls.page.cssrules == undefined){ Controls.page.cssrules = {}; }

        d.querySelector("#font_heading").value = Controls.page.typography.heading.font.value;
        d.querySelector("#font_heading_type").value = Controls.page.typography.heading.type.value;
        d.querySelector("#font_heading_weight").value = Controls.page.typography.heading.weight.value;

        d.querySelector("#font_body").value = Controls.page.typography.body.font.value;
        d.querySelector("#font_body_type").value = Controls.page.typography.body.type.value;
        d.querySelector("#font_body_weight").value = Controls.page.typography.body.weight.value;

        if(Controls.page.cssrules.value !== undefined){ d.querySelector("#css_rules").value = Controls.page.cssrules.value; }

        onChange('.font_heading', (e) => {

            e.preventDefault();
            Controls.page.typography.heading.font.value = e.currentTarget.value; _this.controlsUpdates();
        });

        onChange('.font_heading_type', (e) => {

            e.preventDefault();
            Controls.page.typography.heading.type.value = e.currentTarget.value; _this.controlsUpdates();
        });

        onChange('.font_heading_weight', (e) => {

            e.preventDefault();
            Controls.page.typography.heading.weight.value = e.currentTarget.value; _this.controlsUpdates();
        });



        onChange('.font_body', (e) => {

            e.preventDefault();
            Controls.page.typography.heading.font.value = e.currentTarget.value; _this.controlsUpdates();
        });

        onChange('.font_body_type', (e) => {

            e.preventDefault();
            Controls.page.typography.heading.type.value = e.currentTarget.value; _this.controlsUpdates();
        });

        onChange('.font_body_weight', (e) => {

            e.preventDefault();
            Controls.page.typography.heading.weight.value = e.currentTarget.value; _this.controlsUpdates();
        });

        // load font list
        fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBwIX97bVWr3-6AIUvGkcNnmFgirefZ6Sw', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/x-www-form-urlencoded',
            }
        })
        .then(response => response.json())
        .then(response => {

            let js = response;
            let flist = ''; for (let f in js.items) { flist += '<option value="' + js.items[f].family + '">' + js.items[f].family + '</option>'; }

            document.querySelector("#font_heading").innerHTML = flist;
            document.querySelector("#font_body").innerHTML = flist;
            document.querySelector('#font_heading [value="' + _this.state.dataAPI.data.typography.heading.font.value + '"]').selected = true;
            document.querySelector('#font_body [value="' + _this.state.dataAPI.data.typography.body.font.value + '"]').selected = true;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    },
    controlsUpdates: () => {

        // console.log('controlsUpdates');
        // console.log(Controls.obj);

        if(Controls.obj){

          let action = Controls.obj.action;

          // console.log(action);
          switch(action){

            case 'section-moveup': _this.state.changes = true; _this.initSections(); break;
            case 'section-movedown': _this.state.changes = true; _this.initSections(); break;
            case 'section-copy': _this.state.changes = true; _this.initSections(); break;
            case 'section-remove': _this.state.changes = true; _this.initSections(); break;
            case 'edit': _this.state.changes = true; break;
            case 'copy': _this.state.changes = true; break;
            case 'remove': _this.state.changes = true; break;
          }
        }
    
        // if(_this.state.changes && window.location.href.indexOf("#")==-1){ history.pushState({pageID: 'pages'}, 'Cloud', window.location.pathname + "#changes"); }
        if(_this.state.timer) clearTimeout(_this.state.timer);

        _this.state.timer = setTimeout(function(){
    
          if(Controls.page) _this.setSiteData({mode: "preview", section: "", data: Controls.page});
          
        }, 1000);
    },
    initSections: () => {   
        
        // clear any previous sections
        // document.querySelector('.sections > .card.lay').remove();
        document.querySelectorAll('.sections > .card.lay').forEach(e => e.remove());

        // $(".sections > .card.lay").remove();

        // initialize sections and load layout editing controls
        Controls.init(".sections", Controls.page, _this.controlsUpdates, 'sections');
    
        // activate sections drag and drop events
        _this.initDragula();
    },
    initDragula: () => {

        if(_this.state.dragulaInit) return;
    
        console.log("initDragula");
        _this.state.dragulaInit = true;
        let drag = dragula([document.querySelector('.sections')],{
    
            // direction: 'vertical',
            moves: function (el, source, handle, sibling) {
                if(_this.state.http_source=="mobile") { return false; }
                return el.classList.contains('lay') && el.querySelector('[data-bs-toggle="collapse"]').classList.contains('collapsed');
            },
            accepts: function (el, target, source, sibling) {
                return true;
            }
        });
    
        drag.on('drop', function(el) {
        
            console.log("drop");
            // dataGG = JSON.parse(JSON.stringify(dataG));
            let i = 0;
            let temp = JSON.parse(JSON.stringify(Controls.page));

            document.querySelectorAll('.sections .seco').forEach( (e) => { 
                
                let ind = e.currentTarget.dataset.section;
                Controls.page.sections[i] = temp.sections[ind];
                
                console.log(ind +" "+i);
                i++;   
            });

            // $( ".sections .seco" ).each(function() {
        
            //     let ind = this.dataset.section;
            //     Controls.page.sections[i] = temp.sections[ind];
                
            //     console.log(ind +" "+i);
            //     i++;    
            // });
        
            // reassign section indexes
            _this.setSiteData({mode: "preview", section: "", data: Controls.page});
        
            _this.initSections();
        });
    },
    setSiteData: (obj) => {
      
        // console.log(obj);
        // return;
        if(obj.mode == 'production'){ showLoader(); }
    
        $(".preview iframe").addClass('iload');
        if(_this.state.xhr) _this.state.xhr.abort();
        _this.state.xhr = $.post("https://siteapi.kenzap.cloud/v1/", { cmd: 'set_site_data', id: getSiteId(), fl: _this.getPageSlug(), page_meta: _this.state.page_meta, mode: _this.state.mode, section: obj.section, source: 'pages', data: obj.data, mode: obj.mode, token: getCookie('kenzap_token') }, function(data, status){
    
            // alert(JSON.stringify(data));
            // $( "#loader" ).fadeOut( "fast" ); 
            
            if(data.success){
    
                _this.state.changes = false;
    
                // notify
                if(obj.mode == 'production'){ 

                    toast(__('Latest changes are now online.'));
                }
    
                hideLoader();

                // refresh preview
                _this.preview();
    
            }else{
    
                parseError(data);
            }
    
        },'json');
    },
    rowStruct: (i) => {

        return `
        <tr>
          <td class="destt" style="max-width:250px;min-width:250px;">
            <div>
              <a class="text-dark" href="/edit-page/?id=${ _this.state.dataAPI.list[i].key + '&sid='+getSiteId() }" ><b>${ _this.state.dataAPI.list[i].title }</b><i style="color:#9b9b9b;font-size:15px;margin-left:8px;" title="Edit page" class="mdi mdi-pencil menu-icon edit-page"></i></a>
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
    getPageSlug: () => {

        let urlParams = new URLSearchParams(window.location.search);
        let slug = urlParams.get('slug') ? urlParams.get('slug') : "";
        return slug;

        // return 'about-us';

        // let url = new URL(window.location.href);
        // let id = url.pathname.trim().split('/').slice(-3)[0];
        // return id;
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

        console.log('initListeners');

        // actions listeners
        // onClick('.acc2', _this.listeners.actions);

        // set as home page
        // onClick('.set-home', _this.listeners.setHome);

        if(!_this.state.firstLoad) return;

        // add user button
        onClick('.btn-publish', _this.listeners.publish);

        // add layout button
        onClick('.add-layout', _this.listeners.addLayout);

        // add modal confirm button
        onClick('.btn-modal', _this.listeners.modalSuccessBtn);
    },
    listeners: {

        // actions: (e) => {

        //     let modal = document.querySelector(".modal");
        //     let modalCont = new bootstrap.Modal(modal);
        //     modal.querySelector(".modal-dialog").style.maxWidth = '500px';
            
        //     modal.querySelector(".modal-title").innerHTML = __('Action');
        //     modal.querySelector(".btn-primary").style.display = 'none';
        //     modal.querySelector(".btn-secondary").innerHTML = __('Cancel');

        //     let html = '\
        //     <nav id="context-menu" class="context-menu">\
        //       <ul class="context-menu__items">\
        //         <li class="context-menu__item">\
        //           <a href="#" class="context-menu__link acc" data-acc="moveup">\
        //             Move Up <i class="mdi mdi-arrow-up"></i> \
        //           </a>\
        //         </li>\
        //         <li class="context-menu__item">\
        //           <a href="#" class="context-menu__link acc" data-acc="movedown">\
        //             Move Down <i class="mdi mdi-arrow-down"></i> \
        //           </a>\
        //         </li>\
        //         <li class="context-menu__item">\
        //           <a href="#" class="context-menu__link acc" data-acc="copy">\
        //             Duplicate <i class="mdi mdi-content-duplicate"></i> \
        //           </a>\
        //         </li>\
        //         <li class="context-menu__item">\
        //           <a href="#" class="context-menu__link acc" data-acc="settings" >\
        //             Advanced <i class="mdi mdi-brush"></i> \
        //           </a>\
        //         </li>\
        //         <li class="context-menu__item">\
        //           <a href="#" class="context-menu__link acc" data-acc="remove">\
        //             Delete <i class="mdi mdi-trash-can-outline "></i> \
        //           </a>\
        //         </li>\
        //       </ul>\
        //     </nav>';

        //     modal.querySelector(".modal-body").innerHTML = html;
            
        //     modalCont.show();
        // },
        publish: (e) => {
            
            if(document.querySelector("#ptitle").value.length<1){ alert(__('Please enter page title to save changes.')); return false; }
    
            e.preventDefault();

            // mode = (this.dataset.mode!=undefined)?this.dataset.mode:"production";
            if(Controls.page) _this.setSiteData({mode: "production", section: "", data: Controls.page});
        },
        addLayout: (e) => {

            let modal = document.querySelector(".modal");
            let modalCont = new bootstrap.Modal(modal);
            modal.querySelector(".modal-dialog").style.maxWidth = '700px';
            let CDN2 = 'https://static.kenzap.com';
            
            modal.querySelector(".modal-title").innerHTML = __('Add layout');
            modal.querySelector(".btn-primary").style.display = 'none';
            modal.querySelector(".btn-secondary").innerHTML = __('Cancel');

            showLoader();

            // init params
            let params = new URLSearchParams();
            params.append("cmd", "preview_sections");
            params.append("template", 'page_template');
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

                    Controls.layouts = response;
                    let html = '';
                    html += '<div class="row">';
                    for (let key in response.res) {
        
                        html += '<div class="col-md-6" style="margin:16px 0;">';
                        html += '<h4>'+response.res[key]['meta']['title'];
                        html += '<div class="br-wrapper br-theme-css-stars"><select id="profile-rating" name="rating" autocomplete="off" style="display: none;"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select><div class="br-widget"><a href="#" data-rating-value="1" data-rating-text="1" class="br-selected"></a><a href="#" data-rating-value="2" data-rating-text="2" class="br-selected"></a><a href="#" data-rating-value="3" data-rating-text="3" class="br-selected"></a><a href="#" data-rating-value="4" data-rating-text="4" class="br-selected"></a><a href="#" data-rating-value="5" data-rating-text="5" class="br-selected br-current"></a></div></div>';
                        html += '</h4>';
                        html += '<img alt="'+response.res[key]['meta']['title']+'" style="max-width:100%;" src="'+CDN2+'/preview/'+response.res[key]['template']+'-'+response.res[key]['meta']['slug']+'-600.jpeg?'+response.res[key]['meta']['updated']+'" />';
                        html += '<a class="sclick csection" data-index="'+key+'" >Choose this section</a>';
                        html += '</div>';
                    }
                    html += '</div>';

                    modal.querySelector(".modal-body").innerHTML = html;

                    onClick('.sclick', _this.listeners.sectionClick);

                }else{

                    simulateClick( simulateClick(document.querySelector('.modal .btn-close')) );
                    toast(__('No available layouts found.'));
                    // parseApiError(response);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

            modalCont.show();
        },
        sectionClick: (e) => {

            simulateClick(document.querySelector('.modal .btn-close'));
            // $("#close-layouts").trigger('click');

            let layout = Controls.layouts.res[e.currentTarget.dataset.index]['extra'];
            let layout_id = Controls.layouts.res[e.currentTarget.dataset.index]['id'];
            if(Controls.page.sections == undefined) Controls.page.sections = [];
            console.log(Controls.page);
            Controls.page.sections.push(layout);
            // console.log(dataG);
            // console.log(layout);

            // preload layout
            $.post("https://siteapi.kenzap.cloud/v1/", { cmd: 'preload_layout', id: getSiteId(), layout_id: layout_id, token: getCookie('kenzap_token') }, function(data, status){

                if(data.success){

                    _this.controlsUpdates();
                    // refresh preview
                    // preview();
                    // console.log("preview");
                }else{

                    parseError(data);
                }
            },'json');

            // refresh sections 
            _this.initSections();   
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
    laodScript: (script) => {

        // if(tab4Loaded) return;
        let sjs = document.createElement("script");
        sjs.setAttribute("src", script+"?"+(new Date().getTime()));
        document.body.appendChild(sjs);
        // tab4Loaded = true;
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
