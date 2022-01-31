export const HTMLContent = (__) => {

    return `
    <div class="container">
      <div class="d-flex justify-content-between bd-highlight mb-3">
          <nav class="bc" aria-label="breadcrumb"></nav>
          <button class="btn btn-primary btn-add d-none" type="button">${ __('Add user') }</button>
      </div> 
      
      <div class="row">
        <div class="col-md-12 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card">
          <div class="card border-white shadow-sm br">
            <div class="card-body">
              <h4 class="mb-4">${ __('Domain Settings') }</h4>
              <p class="card-description">${ __('Connect your cloud space with a range of free premium domains.') }</p>
              <div class="domain" style="max-width: 500px;"> 

                <div class="form-group">
                  <div class="input-group">

                    <div class="input-group">
                      <input type="text" style="text-align:right;" class="form-control val-tld" aria-label="">
                      <button class="btn btn-sm btn-outline-primary dropdown-toggle btn-tld" data-bs-toggle="dropdown" aria-expanded="false">.kenzap.site</button>
                      <ul class="dropdown-menu dropdown-menu-end domain-list">
                        <li><a class="dropdown-item" href="#" data-key='.kenzap.site'>.kenzap.site</a></li>
                        <li><a class="dropdown-item d-none" href="#" data-key='.warung.menu'>.warung.menu</a></li>
                        <li><a class="dropdown-item d-none" href="#" data-key='.kenzap.tech'>.kenzap.tech</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" data-key='custom'>My domain</a></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h5 class="card-title mt-4">${ __('* kenzap.site domain') }</h5>
                <p class="form-text" >${ __('1. Choose free premium domain from the list above') }</p>
                <p class="form-text" >${ __('2. Hit publish button below') }</p>
                <hr> 
                <h5 class="card-title mt-4">${ __('* my domain') }</h5>
                <p class="form-text" >${ __('1. Purchase domain with your registrar') }</p>
                <p class="form-text" >${ __('2. Point this domain to Kenzap Cloud') }</p>
                <p class="form-text" >${ __('3. Type your domain in the field above') }</p>
                <p class="form-text" >${ __('4. Hit publish button below') }</p>
      
              </div>
              <div class="d-flex justify-content-between bd-highlight mb-1 mt-4 align-items-center">
                <button type="button" class="btn btn-outline-primary btn-fw btn-icon-text nav-deactivate btn-apply" id="publish">${ __('Apply changes') }</button>
                <p class="float-right form-text ms-3 mt-3">Contact support <a href="mailto:support@kenzap.com">support@kenzap.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>    
    </div>

    <div class="modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary btn-modal"></button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"></button>
                </div>
            </div>
        </div>
    </div>

    <div class="position-fixed bottom-0 p-2 m-4 end-0 align-items-center">
        <div class="toast hide align-items-center text-white bg-dark border-0" role="alert" aria-live="assertive"
            aria-atomic="true" data-bs-delay="3000">
            <div class="d-flex">
                <div class="toast-body"></div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
                    aria-label="Close"></button>
            </div>
        </div>
    </div>
    `;
}