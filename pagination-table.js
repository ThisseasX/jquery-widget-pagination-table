$.widget("thiss.paginationTable", {

    options: {
        items: [],
        itemsPerPage: 10
    },

    _create: function () {
        if (!Array.isArray(items) || !items.length > 0) {
            throw new Error('Items array cannot be empty.');
        }

        this.currentPage = 0;
        const template = `
        <div class="row">
            <div class="col-auto">
                <ul id="pagination" class="pagination justify-content-center"></ul>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Item</th>
                        </tr>
                    </thead>
                    <tbody id="list"></tbody>
                </table>
            </div>
        </div>`;


        this.element.html(template);

        this._renderList();
        this._renderPagination();

        this._attachEvents();
    },

    _attachEvents: function () {
        this._on(this.element, {
            "click .page-previous": e => {
                e.preventDefault();
                e.stopPropagation();
                this._pageChange(-1);
            },

            "click .page-number": e => {
                e.preventDefault();
                e.stopPropagation();
                this._pageClick(e.target);
            },

            "click .page-next": e => {
                e.preventDefault();
                e.stopPropagation();
                this._pageChange(1);
            }
        })
    },

    _renderList: function () {
        const frag = document.createDocumentFragment();

        const start = this.options.itemsPerPage * this.currentPage;
        const end = this.options.itemsPerPage + start;

        for (let i = start; i < end; i++) {
            if (!items[i]) break;
            $('<tr>')
                .append($('<td>')
                    .text(items[i]))
                .appendTo(frag);
        }

        $('#list', this.element).html(frag);
    },

    _renderPagination: function () {
        const frag = document.createDocumentFragment();

        this._createPaginationButton({
            frag,
            outerClasses: 'page-item',
            innerClasses: ['btn', 'btn-primary', 'page-link', 'page-previous'],
            text: 'Previous'
        });

        this._getPages().forEach(page => {
            this._createPaginationButton({
                frag,
                outerClasses: [page == this.currentPage + 1 ? 'active' : '', 'page-item'],
                innerClasses: ['btn', 'btn-primary', 'page-link', 'page-number'],
                text: page
            });
        });

        this._createPaginationButton({
            frag,
            outerClasses: 'page-item',
            innerClasses: ['btn', 'btn-primary', 'page-link', 'page-next'],
            text: 'Next'
        });

        $('#pagination', this.element).html(frag);
    },

    _createPaginationButton: function (options) {
        const { frag, outerClasses, innerClasses, text } = options;

        $('<li>')
            .addClass(outerClasses)
            .append($('<a>')
                .addClass(innerClasses)
                .attr('href', '#')
                .text(text))
            .appendTo(frag);
    },

    _pageChange: function (i) {
        i = i > 0 ? 1 : -1;
        this.currentPage = this._constrainPage(this.currentPage + i);
        this._renderList();
        this._renderPagination();
    },

    _goToPage: function (pageNumber) {
        this.currentPage = this._constrainPage(pageNumber);
    },

    _pageClick: function (element) {
        const num = +element.innerText;
        this._goToPage(num - 1);
        this._renderList();
        this._renderPagination();
    },

    _getPages: function () {
        const total = items.length;
        const remainder = total % this.options.itemsPerPage;

        const pages = ~~(total / this.options.itemsPerPage);
        const extraPage = !!remainder;
        return new Array(pages + extraPage).fill().map((_, i) => i + 1);
    },

    _constrainPage: function (i) {
        return Math.min(Math.max(i, 0), this._getPages().length - 1);
    }
});
