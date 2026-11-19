// public/javascript/controllers/product_controller.mjs
import { CRUDController } from "./base/crud_controller.mjs";
import { Toast } from "../core/components/toast.mjs";
import { Loading } from "../core/components/loading.mjs";

export default class ProductController extends CRUDController {
    static targets = [
        "thumbnails",            // flex container holding image thumbs
        "uploadArea",            // dashed drop-zone wrapper
        "uploadLoading",         // spinner shown while processing
        "imagePreviewContainer", // outer wrapper for the preview section
        "imageInput",            // <input type="file">
        "form",                  // the <form> element
        "submitBtn",             // submit button
    ];

    connect() {
        // Existing image URLs injected by the server as a JSON script tag
        const dataEl = document.getElementById("product-images-data");
        this.existingImages = dataEl ? JSON.parse(dataEl.textContent) : [];

        // File objects the user has picked but not yet uploaded
        this.pendingFiles = [];

        // Render existing images first so the count is correct for visibility
        this._renderExistingImages();
        this._updateUploadAreaVisibility();
        this._setupDragAndDrop();
        this._setupDynamicRows();
    }

    // ─────────────────────────────────────────────
    // FILE INPUT CHANGE
    // ─────────────────────────────────────────────

    onFileChange(event) {
        const files = Array.from(event.target.files);
        if (!files.length) return;

        const loadingEl = this._target("uploadLoading");
        if (loadingEl) loadingEl.classList.remove("d-none");

        setTimeout(() => {
            if (loadingEl) loadingEl.classList.add("d-none");
            this.pendingFiles = files;
            this._renderNewPreviews(files);
        }, 300);
    }

    // ─────────────────────────────────────────────
    // FORM SUBMIT — upload pending files then submit
    // ─────────────────────────────────────────────

    async onSubmit(event) {
        event.preventDefault();

        const totalImages = this.existingImages.length + this.pendingFiles.length;
        if (totalImages === 0) {
            Toast.show({ message: "Please upload at least one product image", type: "error" });
            return;
        }

        const submitBtn = this._target("submitBtn");
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML =
            '<span class="spinner-border spinner-border-sm"></span> Uploading images…';

        try {
            let uploadedUrls = [];
            if (this.pendingFiles.length > 0) {
                uploadedUrls = await this._uploadImages(this.pendingFiles);
            }

            const allUrls = [...this.existingImages, ...uploadedUrls];

            // Inject a hidden field with all image URLs as JSON
            const hidden = document.createElement("input");
            hidden.type = "hidden";
            hidden.name = "imageUrls";
            hidden.value = JSON.stringify(allUrls);

            const formEl = this._target("form");
            formEl.appendChild(hidden);

            // Disable the raw file input so the browser doesn't attach files
            const inputEl = this._target("imageInput");
            if (inputEl) inputEl.disabled = true;

            formEl.submit();
        } catch (err) {
            console.error("Upload error:", err);
            Toast.show({ message: "Failed to upload images: " + err.message, type: "error" });
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    // ─────────────────────────────────────────────
    // DYNAMIC ROWS  (Additional Info / Specs)
    // ─────────────────────────────────────────────

    addInfoRow(event) {
        event.preventDefault();
        this._addDynamicRow(
            "additional_info_container", "additional-info-row",
            "additional_info_key[]", "additional_info_value[]"
        );
    }

    addSpecsRow(event) {
        event.preventDefault();
        this._addDynamicRow(
            "specs_container", "specs-row",
            "specs_key[]", "specs_value[]"
        );
    }

    addPresetSpec(event) {
        event.preventDefault();
        const key = event.currentTarget?.dataset?.specKey || "";
        this._addDynamicRow(
            "specs_container", "specs-row",
            "specs_key[]", "specs_value[]",
            key
        );
    }

    addPresetInfo(event) {
        event.preventDefault();
        const key = event.currentTarget?.dataset?.infoKey || "";
        this._addDynamicRow(
            "additional_info_container", "additional-info-row",
            "additional_info_key[]", "additional_info_value[]",
            key
        );
    }

    // ─────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────

    /**
     * Resolve a target by name using the custom framework's
     * data-target="product.targetName" convention.
     * Falls back gracefully to undefined so callers can null-guard.
     */
    _target(name) {
        return this.element.querySelector(`[data-target="product.${name}"]`) ?? undefined;
    }

    /** Render thumbnails for images already stored on the server */
    _renderExistingImages() {
        const container = this._target("thumbnails");
        if (!container) return;

        this.existingImages.forEach((src, idx) => {
            container.appendChild(this._createThumb(src, "existing", idx));
        });
    }

    /** Re-render thumbnails for freshly picked (not yet uploaded) files */
    _renderNewPreviews(files) {
        const container = this._target("thumbnails");
        if (!container) return;

        // Remove previous "new" thumbs
        container
            .querySelectorAll("[data-thumb-type='new']")
            .forEach(el => el.remove());

        files.forEach((file, idx) => {
            const reader = new FileReader();
            reader.onload = e => {
                container.appendChild(this._createThumb(e.target.result, "new", idx));
                this._updateUploadAreaVisibility();
            };
            reader.readAsDataURL(file);
        });

        this._updateUploadAreaVisibility();
    }

    /** Build a single thumbnail element */
    _createThumb(src, type, index) {
        const wrap = document.createElement("div");
        wrap.className = "position-relative";
        wrap.style.maxWidth = "120px";
        wrap.dataset.thumbType = type;
        wrap.dataset.thumbIndex = index;

        const img = document.createElement("img");
        img.className = "img-fluid rounded";
        img.style.cssText = "max-height:120px;cursor:pointer";
        img.src = src;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-sm btn-outline-danger rounded-circle position-absolute top-0 end-0";
        btn.style.cssText = "width:32px;height:32px";
        btn.innerHTML = '<i class="bi bi-x"></i>';
        btn.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            if (type === "existing") this._removeExisting(index);
            else this._removeNew(index);
        });

        wrap.appendChild(img);
        wrap.appendChild(btn);
        return wrap;
    }

    _removeExisting(index) {
        const container = this._target("thumbnails");
        const thumb = container?.querySelector(
            `[data-thumb-type='existing'][data-thumb-index='${index}']`
        );
        if (thumb) thumb.remove();
        this.existingImages.splice(index, 1);
        this._updateUploadAreaVisibility();
    }

    _removeNew(index) {
        this.pendingFiles.splice(index, 1);

        // Rebuild the FileList on the input
        const dt = new DataTransfer();
        this.pendingFiles.forEach(f => dt.items.add(f));
        const inputEl = this._target("imageInput");
        if (inputEl) inputEl.files = dt.files;

        this._renderNewPreviews(this.pendingFiles);
    }

    _updateUploadAreaVisibility() {
        const thumbnails = this._target("thumbnails");
        const uploadArea = this._target("uploadArea");
        const previewWrap = this._target("imagePreviewContainer");

        if (!thumbnails || !uploadArea || !previewWrap) return; // targets not in DOM yet

        const total = thumbnails.children.length;
        const MAX = 4;

        uploadArea.classList.toggle("d-none", total >= MAX);

        // Always reveal the preview container once the controller is live
        previewWrap.classList.remove("d-none");
    }

    // ─── Drag-and-drop on the upload container ───

    _setupDragAndDrop() {
        const container = this.element.querySelector(".image-upload-container");
        if (!container) return;

        container.addEventListener("dragover", e => {
            e.preventDefault();
            e.stopPropagation();
            container.classList.add("border-primary");
            container.querySelector(".upload-placeholder")?.classList.add("text-primary");
        });

        container.addEventListener("dragleave", e => {
            e.preventDefault();
            e.stopPropagation();
            container.classList.remove("border-primary");
            container.querySelector(".upload-placeholder")?.classList.remove("text-primary");
        });

        container.addEventListener("drop", e => {
            e.preventDefault();
            e.stopPropagation();
            container.classList.remove("border-primary");
            container.querySelector(".upload-placeholder")?.classList.remove("text-primary");

            const inputEl = this._target("imageInput");
            if (e.dataTransfer.files.length && inputEl) {
                inputEl.files = e.dataTransfer.files;
                inputEl.dispatchEvent(new Event("change", { bubbles: true }));
            }
        });
    }

    // ─── Dynamic key/value rows ───

    _setupDynamicRows() {
        this._rebindDeleteButtons();
    }

    _addDynamicRow(containerId, rowClass, keyName, valueName, presetKey = "") {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (presetKey) {
            const existing = Array.from(container.querySelectorAll(`input[name="${keyName}"]`))
                .some((input) => input.value.trim().toLowerCase() === presetKey.toLowerCase());
            if (existing) {
                const match = Array.from(container.querySelectorAll(`input[name="${keyName}"]`))
                    .find((input) => input.value.trim().toLowerCase() === presetKey.toLowerCase());
                match?.focus();
                return;
            }
        }

        const row = document.createElement("div");
        row.className = `row ${rowClass} mb-2 g-2 align-items-center`;
        const safeKey = presetKey.replace(/"/g, "&quot;");
        row.innerHTML = `
            <div class="col-md-5">
                <input type="text" class="form-control" placeholder="Label" name="${keyName}" value="${safeKey}">
            </div>
            <div class="col-md-5">
                <input type="text" class="form-control" placeholder="Value" name="${valueName}">
            </div>
            <div class="col-md-2 d-flex gap-1">
                <button type="button" class="btn btn-outline-secondary btn-sm move-up" title="Move up" aria-label="Move up">
                    <i class="bi bi-arrow-up"></i>
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm move-down" title="Move down" aria-label="Move down">
                    <i class="bi bi-arrow-down"></i>
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm delete-row" title="Remove" aria-label="Remove row">
                    <i class="bi bi-trash"></i>
                </button>
            </div>`;

        container.appendChild(row);
        this._rebindDeleteButtons();
        row.querySelector(`input[name="${valueName}"]`)?.focus();
    }

    _rebindDeleteButtons() {
        document.querySelectorAll(".delete-row").forEach(btn => {
            const fresh = btn.cloneNode(true);
            btn.parentNode.replaceChild(fresh, btn);

            fresh.addEventListener("click", e => {
                e.preventDefault();
                const row = fresh.closest(".row");
                row.remove();
            });
        });

        document.querySelectorAll(".move-up, .move-down").forEach(btn => {
            const fresh = btn.cloneNode(true);
            btn.parentNode.replaceChild(fresh, btn);
            fresh.addEventListener("click", e => {
                e.preventDefault();
                const row = fresh.closest(".row");
                const container = row.parentElement;
                if (fresh.classList.contains("move-up") && row.previousElementSibling) {
                    container.insertBefore(row, row.previousElementSibling);
                }
                if (fresh.classList.contains("move-down") && row.nextElementSibling) {
                    container.insertBefore(row.nextElementSibling, row);
                }
            });
        });
    }

    // ─── Upload files to /api/upload/image ───

    async _uploadImages(files) {
        const token = localStorage.getItem("token");
        const urls = [];

        for (const file of files) {
            const formData = new FormData();
            formData.append("image", file); // matches uploadContentImage field name

            const response = await fetch("/uploads/image", {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,
                credentials: "include",
            });

            const result = await response.json();
            if (!response.ok || result.status !== "success") {
                throw new Error(result.message || "Image upload failed");
            }

            urls.push(result.data.url);
        }

        return urls;
    }
}