class SidebarManager {
    constructor() {
        this.sidebar = document.getElementById("sidebar");
        this.isShrunk = this.sidebar?.classList.contains("shrink") || false;
        this.init();
    }

    init() {
        this.setupToggleButtons();
        this.preventTableInterference();
    }

    setupToggleButtons() {
        const mobileToggle = document.getElementById("mobileSidebarToggle");
        const desktopToggle = document.getElementById("desktopSidebarToggle");

        mobileToggle?.addEventListener("click", (e) => {
            e.stopPropagation();
            this.toggleMobile();
        });

        desktopToggle?.addEventListener("click", (e) => {
            e.stopPropagation();
            this.toggleDesktop();
        });
    }

    toggleMobile() {
        this.sidebar?.classList.toggle("show");
    }

    toggleDesktop() {
        // Don't toggle if we're on a page that should have fixed sidebar
        if (document.querySelector('.sidebar-fixed')) {
            return;
        }

        this.sidebar?.classList.toggle("shrink");
        this.isShrunk = !this.isShrunk;

        const linkElements = this.sidebar?.querySelectorAll(".nav-link");
        const sidebarTitle = document.getElementById("sidebarTitle");

        linkElements?.forEach(link => {
            link.classList.toggle("text-center");
        });

        sidebarTitle?.classList.toggle("d-none");
    }

    preventTableInterference() {
        // Prevent table clicks from affecting sidebar
        document.querySelectorAll('table').forEach(table => {
            table.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }

    // Method to force sidebar state
    forceExpand() {
        if (this.sidebar) {
            this.sidebar.classList.remove("shrink");
            this.sidebar.classList.add("show");
            this.sidebar.style.width = "240px";
        }
    }

    forceShrink() {
        if (this.sidebar) {
            this.sidebar.classList.add("shrink");
            this.sidebar.style.width = "70px";
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    const sidebarManager = new SidebarManager();

    // Force expanded sidebar on specific pages
    if (window.location.pathname.includes('/admin/settings') ||
        window.location.pathname.includes('/admin/products')) {
        sidebarManager.forceExpand();
    }
});