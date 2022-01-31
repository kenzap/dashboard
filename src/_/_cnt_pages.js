export const HTMLContent = (__) => {

    return `
    <div class="container">
      <div class="d-flex justify-content-between bd-highlight mb-3">
          <nav class="bc" aria-label="breadcrumb"></nav>
          <button class="btn btn-primary btn-add" type="button">${ __('Add page') }</button>
      </div> 
      
      <div class="row">

        <div class="col-md-12 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card">
          <div class="card border-white shadow-sm  br">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover table-borderless align-middle table-striped table-p-list">
                  <thead>
                    <tr>
                      <th>${ __('Page') }</th>
                      <th>${ __('Status') }</th>
                      <th>${ __('Last update') }</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody class="list"> </tbody>
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