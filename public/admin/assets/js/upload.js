
// ============================================
// UNIFIED PRODUCT FORM SCRIPT
// Handles image uploads, dynamic rows, and form validation
// Compatible with both edit and new product pages
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const imageInput = document.getElementById('imageInput');
    const thumbnails = document.getElementById('thumbnails');
    const uploadArea = document.getElementById('uploadArea');
    const uploadLoading = document.getElementById('uploadLoading');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const form = document.querySelector('form');

    // Parse existing images from server (edit page only)
    const existingImagesData = document.getElementById('product-images-data');
    const existingImages = existingImagesData ? JSON.parse(existingImagesData.textContent) : [];

    // ============================================
    // IMAGE UPLOAD FUNCTIONALITY
    // ============================================

    // Initialize image previews
    function initializeImagePreviews() {
        // Render existing images (edit page)
        renderExistingImages();

        // Render new image previews
        if (imageInput && imageInput.files.length > 0) {
            renderNewPreviews(imageInput.files);
        }

        updateUploadAreaVisibility();
    }

    // Render existing images with delete buttons
    function renderExistingImages() {
        if (existingImages.length === 0) return;

        existingImages.forEach((src, idx) => {
            const wrap = createImageThumbnail(src, 'existing', idx);
            thumbnails.appendChild(wrap);
        });
    }

    // Create thumbnail element for an image
    function createImageThumbnail(src, type = 'new', index = null) {
        const wrap = document.createElement('div');
        wrap.className = 'position-relative';
        wrap.style.maxWidth = '120px';
        wrap.setAttribute('data-type', type);
        if (index !== null) wrap.setAttribute('data-index', index);

        const img = document.createElement('img');
        img.className = 'img-fluid rounded';
        img.style.maxHeight = '120px';
        img.style.cursor = 'pointer';
        img.src = src;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-sm btn-outline-danger rounded-circle position-absolute top-0 end-0';
        btn.innerHTML = '<i class="bi bi-x"></i>';
        btn.style.width = '32px';
        btn.style.height = '32px';

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (type === 'existing') {
                removeExistingImage(index);
            } else {
                removeNewImage(index);
            }
        });

        wrap.appendChild(img);
        wrap.appendChild(btn);
        return wrap;
    }

    // Remove existing image
    function removeExistingImage(index) {
        // Remove from DOM
        const thumbnail = thumbnails.querySelector(`[data-type="existing"][data-index="${index}"]`);
        if (thumbnail) thumbnail.remove();

        // Remove from existingImages array
        existingImages.splice(index, 1);

        // Remove hidden input if it exists
        const hiddenInputsContainer = document.getElementById('existingImagesInputs');
        if (hiddenInputsContainer) {
            const hiddenInputs = hiddenInputsContainer.querySelectorAll('input[name="existingImages"]');
            if (hiddenInputs[index]) hiddenInputs[index].remove();
        }

        updateUploadAreaVisibility();
    }

    // Remove newly uploaded image
    function removeNewImage(index) {
        const dt = new DataTransfer();
        const files = Array.from(imageInput.files);
        files.forEach((f, i) => {
            if (i !== index) dt.items.add(f);
        });
        imageInput.files = dt.files;
        renderNewPreviews(imageInput.files);
    }

    // Render new file previews
    function renderNewPreviews(files) {
        // Clear existing new previews
        thumbnails.querySelectorAll('[data-type="new"]').forEach(el => el.remove());

        // Render new files
        Array.from(files).forEach((file, idx) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const wrap = createImageThumbnail(e.target.result, 'new', idx);
                thumbnails.appendChild(wrap);
            };
            reader.readAsDataURL(file);
        });

        updateUploadAreaVisibility();
    }

    // Update upload area visibility
    function updateUploadAreaVisibility() {
        const totalImages = thumbnails.children.length;
        const maxImages = 4;

        if (totalImages >= maxImages) {
            uploadArea.classList.add('d-none');
        } else {
            uploadArea.classList.remove('d-none');
        }

        // Show preview container if there are images
        if (totalImages >= 0) {
            imagePreviewContainer.classList.remove('d-none');
        }
    }

    // Image input change handler
    if (imageInput) {
        imageInput.addEventListener('change', function () {
            uploadLoading.classList.remove('d-none');
            setTimeout(() => {
                uploadLoading.classList.add('d-none');
                renderNewPreviews(this.files);
            }, 300);
        });
    }

    // ============================================
    // DRAG AND DROP FUNCTIONALITY
    // ============================================

    function setupDragAndDrop() {
        const uploadContainer = document.querySelector('.image-upload-container');
        if (!uploadContainer) return;

        uploadContainer.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('border-primary');
            const placeholder = this.querySelector('.upload-placeholder');
            if (placeholder) placeholder.classList.add('text-primary');
        });

        uploadContainer.addEventListener('dragleave', function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('border-primary');
            const placeholder = this.querySelector('.upload-placeholder');
            if (placeholder) placeholder.classList.remove('text-primary');
        });

        uploadContainer.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('border-primary');
            const placeholder = this.querySelector('.upload-placeholder');
            if (placeholder) placeholder.classList.remove('text-primary');

            if (e.dataTransfer.files.length && imageInput) {
                imageInput.files = e.dataTransfer.files;
                const event = new Event('change', { bubbles: true });
                imageInput.dispatchEvent(event);
            }
        });
    }

    // ============================================
    // DYNAMIC ROWS FOR ADDITIONAL INFO & SPECS
    // ============================================

    // Setup add row buttons
    function setupDynamicRows() {
        const addInfoBtn = document.getElementById('add_additional_info_row');
        const addSpecsBtn = document.getElementById('add_specs_row');

        if (addInfoBtn) {
            addInfoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                addDynamicRow('additional_info_container', 'additional-info-row');
            });
        }

        if (addSpecsBtn) {
            addSpecsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                addDynamicRow('specs_container', 'specs-row');
            });
        }

        // Initialize delete buttons
        updateDeleteButtons();
    }

    // Add a new dynamic row
    function addDynamicRow(containerId, rowClass) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const newRow = document.createElement('div');
        newRow.className = `row ${rowClass} mb-2`;

        // Determine input names based on container
        let keyName = 'additional_info_key[]';
        let valueName = 'additional_info_value[]';

        if (containerId === 'specs_container') {
            keyName = 'specs_key[]';
            valueName = 'specs_value[]';
        }

        newRow.innerHTML = `
            <div class="col-md-5">
                <input type="text" class="form-control" placeholder="Key" name="${keyName}">
            </div>
            <div class="col-md-5">
                <input type="text" class="form-control" placeholder="Value" name="${valueName}">
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-outline-danger btn-sm w-100 delete-row">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;

        container.appendChild(newRow);
        updateDeleteButtons();
    }

    // Update delete buttons visibility and functionality
    function updateDeleteButtons() {
        document.querySelectorAll('.delete-row').forEach((btn) => {
            // Remove old listeners by cloning
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            // Add new listener
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const row = newBtn.closest('.row');
                const container = row.parentElement;
                row.remove();
                updateDeleteButtonsVisibility(container);
            });
        });

        // Update visibility for all containers
        document.querySelectorAll('[id$="_container"]').forEach((container) => {
            updateDeleteButtonsVisibility(container);
        });
    }

    // Update delete button visibility for a specific container
    function updateDeleteButtonsVisibility(container) {
        if (!container) return;

        const rows = container.querySelectorAll('.row');
        rows.forEach((row) => {
            const deleteBtn = row.querySelector('.delete-row');
            if (deleteBtn) {
                // Show delete button only if more than one row exists
                deleteBtn.style.display = rows.length > 1 ? 'block' : 'none';
            }
        });
    }

    // ============================================
    // FORM VALIDATION
    // ============================================

    if (form) {
        form.addEventListener('submit', function (e) {
            // Check if at least one image exists
            const existingCount = existingImages.length;
            const newCount = imageInput && imageInput.files ? imageInput.files.length : 0;
            const totalImages = existingCount + newCount;

            if (totalImages === 0) {
                e.preventDefault();
                alert('Please upload at least one product image');
                return false;
            }
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    initializeImagePreviews();
    setupDragAndDrop();
    setupDynamicRows();
});
