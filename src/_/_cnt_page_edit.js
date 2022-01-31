export const HTMLContent = (__) => {

    return `
    <div class="container">
      <div class="d-flex justify-content-between bd-highlight mb-3">
          <nav class="bc" aria-label="breadcrumb"></nav>
          <div>
            <a style="margin-right:16px;" class="preview-link" target="_blank" href="#">preview <i class="mdi mdi-monitor"></i></a>
            <button class="btn btn-primary btn-publish" type="button">${ __('Publish') }</button>
          </div>
      </div>
      
      <div class="row">
        <div class="col-md-5 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card">
            <div class="accordion accordion-solid-header sections" id="sections" role="tablist" style="width:100%;">

                <div class="card border-white shadow-sm br nodrag">
                    <div class="card-header border-white bg-white" role="tab" id="section0">
                        <h6 class="mb-0"> 
                          <a data-bs-toggle="collapse" href="#collapses" data-section="s" aria-expanded="false" aria-controls="collapses" class="secos collapsed text-dark">Page Settings<div id="page_template"></div> </a>
                        </h6>
                    </div>
                    <div id="collapses" class="collapse" role="tabpanel" aria-labelledby="sections" data-parent="#sections">
                        <div class="card-body">
                            <div class="controls">
                                <div class="r row">
                                    <div class="col-md-12">
                                        <div class="form-group row">
                                            <label class="col-sm-6 col-form-label">Page title</label>
                                            <div class="col-sm-12">
                                                <input id="ptitle" type="text" data-key="heading" data-type="text"
                                                    class="text-input form-control inps" value="" name="ptitle">
                                                <p class="form-text mt-2">Used by search engines and browsers</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="r row">
                                    <div class="col-md-12">
                                        <div class="form-group row">
                                            <label class="col-sm-6 col-form-label">Description</label>
                                            <div class="col-sm-12">
                                                <textarea id="pdesc" type="text" data-key="info1_desc" data-type="text"
                                                    class="text-input form-control inps"
                                                    value="Various versions have evolved over the years, sometimes by accident."
                                                    name="pdesc" rows="4"></textarea>
                                                <p class="form-text mt-2">Used by search engines and browsers</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="r row">
                                    <div class="col-md-12">
                                        <div class="form-group row">
                                            <label class="col-sm-12 col-form-label">Heading font</label>
                                            <div class="col-sm-6">
                                                <select id="font_heading" class="font-input text-input form-control">\

                                                </select>
                                                <p class="form-text mt-2"></p>
                                            </div>
                                            <div class="col-sm-3">
                                                <select id="font_heading_type" class="font-input text-input form-control">\
                                                    <option value="sans-serif">Sans Serif</option>
                                                    <option value="serif">Serif</option>
                                                    <option value="monospace">Monospace</option>
                                                </select>
                                                <!-- <input id="heading_type" type="text" data-type="text" class="text-input form-control inps" value="" name="heading_type"> -->
                                                <p class="form-text mt-2"></p>
                                            </div>
                                            <div class="col-sm-3">
                                                <select id="font_heading_weight"
                                                    class="font-input text-input form-control">\
                                                    <option value="100">100</option>
                                                    <option value="200">200</option>
                                                    <option value="300">300</option>
                                                    <option value="400">400</option>
                                                    <option value="500">500</option>
                                                    <option value="600">600</option>
                                                    <option value="700">700</option>
                                                    <option value="800">800</option>
                                                </select>
                                                <!-- <input id="heading_weight" type="text" data-type="text" class="text-input form-control inps" value="" name="heading_weight"> -->
                                                <p class="form-text mt-2"></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="r row">
                                    <div class="col-md-12">
                                        <div class="form-group row">
                                            <label class="col-sm-12 col-form-label">Body font</label>
                                            <div class="col-sm-6">
                                                <select id="font_body" class="font-input text-input form-control">\

                                                </select>
                                                <p class="form-text mt-2"></p>
                                            </div>
                                            <div class="col-sm-3">
                                                <select id="font_body_type" class="font-input text-input form-control">\
                                                    <option value="sans-serif">Sans Serif</option>
                                                    <option value="serif">Serif</option>
                                                    <option value="monospace">Monospace</option>
                                                </select>
                                                <p class="form-text mt-2"></p>
                                            </div>
                                            <div class="col-sm-3">
                                                <select id="font_body_weight" class="font-input text-input form-control">\
                                                    <option value="100">100</option>
                                                    <option value="200">200</option>
                                                    <option value="300">300</option>
                                                    <option value="400">400</option>
                                                    <option value="500">500</option>
                                                    <option value="600">600</option>
                                                    <option value="700">700</option>
                                                    <option value="800">800</option>
                                                </select>
                                                <p class="form-text mt-2"></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="r row">
                                    <div class="col-md-12">
                                        <div class="form-group row">
                                            <label class="col-sm-6 col-form-label">CSS Rules</label>
                                            <div class="col-sm-12">
                                                <textarea id="css_rules" data-key="css_rules" data-type="css_rules"
                                                    class="csseditor-input form-control w-400" name="css_rules"> </textarea>
                                                <p class="form-text mt-2">Add custom CSS rules to adjust visual look
                                                    of the page.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" data-toggle="modal" data-target="#layouts" class="btn add-layout btn-outline-primary mt-2 nodrag">Add Layout</button>
            </div>
        </div>
        <div class="col-md-7 grid-margin grid-margin-lg-0 grid-margin-md-0 stretch-card preview border-white shadow-sm ">

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