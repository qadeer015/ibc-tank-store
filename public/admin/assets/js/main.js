/**
 * Template Name: NiceAdmin
 * Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
 * Updated: Apr 7 2025 with Bootstrap v5.3.5
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function() {
    "use strict";

    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }

    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
        if (all) {
            select(el, all).forEach(e => e.addEventListener(type, listener))
        } else {
            select(el, all).addEventListener(type, listener)
        }
    }

    /**
     * Easy on scroll event listener 
     */
    const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
    }

    /**
     * Sidebar toggle
     */
    if (select('.toggle-sidebar-btn')) {
        on('click', '.toggle-sidebar-btn', function(e) {
            select('body').classList.toggle('toggle-sidebar')
        })
    }

    /**
     * Search bar toggle
     */
    if (select('.search-bar-toggle')) {
        on('click', '.search-bar-toggle', function(e) {
            select('.search-bar').classList.toggle('search-bar-show')
        })
    }

    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
        let position = window.scrollY + 200
        navbarlinks.forEach(navbarlink => {
            if (!navbarlink.hash) return
            let section = select(navbarlink.hash)
            if (!section) return
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                navbarlink.classList.add('active')
            } else {
                navbarlink.classList.remove('active')
            }
        })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)

    /**
     * Toggle .header-scrolled class to #header when page is scrolled
     */
    let selectHeader = select('#header')
    if (selectHeader) {
        const headerScrolled = () => {
            if (window.scrollY > 100) {
                selectHeader.classList.add('header-scrolled')
            } else {
                selectHeader.classList.remove('header-scrolled')
            }
        }
        window.addEventListener('load', headerScrolled)
        onscroll(document, headerScrolled)
    }

    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top')
    if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
                backtotop.classList.add('active')
            } else {
                backtotop.classList.remove('active')
            }
        }
        window.addEventListener('load', toggleBacktotop)
        onscroll(document, toggleBacktotop)
    }

    /**
     * Initiate tooltips
     */
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    /**
     * Initiate quill editors
     */
    if (select('.quill-editor-default')) {
        new Quill('.quill-editor-default', {
            theme: 'snow'
        });
    }

    if (select('.quill-editor-bubble')) {
        new Quill('.quill-editor-bubble', {
            theme: 'bubble'
        });
    }

    if (select('.quill-editor-full')) {
        new Quill(".quill-editor-full", {
            modules: {
                toolbar: [
                    [{
                        font: []
                    }, {
                        size: []
                    }],
                    ["bold", "italic", "underline", "strike"],
                    [{
                            color: []
                        },
                        {
                            background: []
                        }
                    ],
                    [{
                            script: "super"
                        },
                        {
                            script: "sub"
                        }
                    ],
                    [{
                            list: "ordered"
                        },
                        {
                            list: "bullet"
                        },
                        {
                            indent: "-1"
                        },
                        {
                            indent: "+1"
                        }
                    ],
                    ["direction", {
                        align: []
                    }],
                    ["link", "image", "video"],
                    ["clean"]
                ]
            },
            theme: "snow"
        });
    }


    /**
     * Initiate Bootstrap validation check
     */
    var needsValidation = document.querySelectorAll('.needs-validation')

    Array.prototype.slice.call(needsValidation)
        .forEach(function(form) {
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })

    /**
     * Initiate Datatables
     */
    // datatables-config.js or add to your main.js
    $(document).ready(function () {
        // Configuration for different table types
        const tableConfigs = {
            'productsTable': {
                pageLength: 10,
                lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
                order: [[1, 'asc']], // Sort by Name column by default
                columnDefs: [
                    { orderable: false, targets: [0, 6] }, // Image and Actions columns not sortable
                    { className: "dt-center", targets: [1, 2, 3, 4, 5] }, // Center align these columns
                    { width: "60px", targets: [0] }, // Image column width
                    { width: "100px", targets: [6] } // Actions column width
                ],
                language: {
                    search: "",
                    searchPlaceholder: "Search products",
                    lengthMenu: "Show _MENU_",
                    info: "Showing _START_ to _END_ of _TOTAL_ products",
                    infoEmpty: "No products available",
                    infoFiltered: "(filtered from _MAX_ total products)"
                }
            },
            'categoriesTable': {
                pageLength: 10,
                lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
                order: [[0, 'asc']], // Sort by Name
                columnDefs: [
                    { orderable: false, targets: [1] }, // Actions column not sortable
                    { width: "200px", targets: [1] } // Actions column width
                ],
                language: {
                    search: "",
                    searchPlaceholder: "Search categories",
                    lengthMenu: "Show _MENU_",
                    info: "Showing _START_ to _END_ of _TOTAL_ categories",
                    infoEmpty: "No categories available"
                }
            },
            'customersTable': {
                pageLength: 10,
                lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
                order: [[0, 'asc']], // Sort by Name
                columnDefs: [
                    { orderable: false, targets: [3] }, // Actions column not sortable
                    { className: "dt-center", targets: [2, 3] }, // Center align date and actions
                    { width: "100px", targets: [3] } // Actions column width
                ],
                language: {
                    search: "",
                    searchPlaceholder: "Search customers",
                    lengthMenu: "Show _MENU_",
                    info: "Showing _START_ to _END_ of _TOTAL_ customers",
                    infoEmpty: "No customers available"
                }
            },
            'contactsTable': {
                pageLength: 10,
                lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
                order: [[3, 'desc']], // Sort by Date (newest first)
                columnDefs: [
                    { orderable: false, targets: [5] }, // Actions column not sortable
                    { className: "dt-center", targets: [1, 2, 3, 4, 5] }, // Center align these columns
                    { width: "120px", targets: [5] } // Actions column width
                ],
                language: {
                    search: "",
                    searchPlaceholder: "Search contacts",
                    lengthMenu: "Show _MENU_",
                    info: "Showing _START_ to _END_ of _TOTAL_ contacts",
                    infoEmpty: "No contacts available"
                },
                // Custom rendering for status column
                createdRow: function (row, data, dataIndex) {
                    // Highlight unread messages
                    if (data[4].includes('New') || data[4].includes('new')) {
                        $(row).addClass('table-warning');
                    }
                }
            }
        };

        // Initialize all DataTables
        $('.datatable').each(function () {
            const tableId = $(this).attr('id');
            const config = tableConfigs[tableId] || getDefaultConfig();

            const dataTable = $(this).DataTable(config);

            // Store reference for later use
            $(this).data('dataTable', dataTable);
        });

        // Row click functionality for all clickable rows
        $('.datatable tbody').on('click', 'tr td.click-able', function (e) {
            // Don't trigger if clicking on a link, button, or within dropdown
            if ($(e.target).is('a, button, .dropdown, .dropdown *') ||
                $(e.target).closest('.dropdown, .btn-group').length) {
                return;
            }

            const id = $(this).data('id');
            const type = $(this).data('of');

            if (id && type) {
                const urls = {
                    'products': `/admin/products/${id}`,
                    'customers': `/admin/customers/${id}`,
                    'contacts': `/admin/contacts/${id}`
                };

                if (urls[type]) {
                    window.location.href = urls[type];
                }
            }
        });

        // Default configuration for tables without specific config
        function getDefaultConfig() {
            return {
                pageLength: 10,
                lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
                language: {
                    search: "Search:",
                    lengthMenu: "Show _MENU_",
                    info: "Showing _START_ to _END_ of _TOTAL_ entries",
                    infoEmpty: "No entries available"
                },
                dom: '<"top"lf>rt<"bottom"ip><"clear">'
            };
        }
    });

    /**
     * Autoresize echart charts
     */
    const mainContainer = select('#main');
    if (mainContainer) {
        setTimeout(() => {
            new ResizeObserver(function() {
                select('.echart', true).forEach(getEchart => {
                    echarts.getInstanceByDom(getEchart).resize();
                })
            }).observe(mainContainer);
        }, 200);
    }

})();