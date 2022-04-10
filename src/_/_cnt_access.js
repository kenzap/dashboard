export const HTMLContent = (__) => {

    return `
    <div class="container">
        <div class="d-flex justify-content-between bd-highlight mb-3">
            <nav class="bc" aria-label="breadcrumb"></nav>
            <div class="ms-2 dropdown">
              <button class="btn btn btn-outline-primary dropdown-toggle  h-space" type="button" id="accessOptions" data-bs-toggle="dropdown" aria-expanded="false" >${ __('Options') }</button>
              <ul class="dropdown-menu accessOptionsList" aria-labelledby="accessOptions">
                <li><a class="dropdown-item btn-add-user" href="#">${ __('Add user') }</a></li>
                <li><a class="dropdown-item btn-add-key" href="#">${ __('Add API Key') }</a></li>
                <li><a class="dropdown-item btn-add-space" href="#">${ __('New space') }</a></li>
   
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item btn-rename-space" href="#">${ __('Space name') }</a></li>
                <li><a class="dropdown-item text-danger btn-remove-space" href="#">${ __('Remove space') }</a></li></ul>
            </div>
              
            <button class="btn btn-primary btn-add d-none" type="button">${ __('Add user') }</button>
        </div> 
        
        <div class="row">
            <div class="col-md-7 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card">
              <div class="card border-white shadow-sm br">
                <div class="card-body">
                  <h4 class="card-title mb-4">${ __('Users') }</h4>
                  <div class="table-responsive table-nav">
                    <table class="table table-hover table-borderless align-middle table-striped table-p-list">
                      <thead>
                        <tr>
                          <th>${ __('ID') }</th>
                          <th>${ __('Name') }</th>
                          <th>${ __('Rights') }</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody class="list">

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-5 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card">
              <div class="card border-white shadow-sm br">
                <div class="card-body">
                  <h4 class="card-title mb-4">${ __('API Keys') }</h4>
                  <div class="table-responsive table-nav">
                    <table class="table table-hover table-borderless align-middle table-striped table-p-list">
                      <thead>
                        <tr>
                          <th>${ __('Key') }</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody class="list-keys">

                      </tbody>
                    </table>
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