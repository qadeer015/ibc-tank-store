function ibcInitProductPage() {
    const dataEl = document.getElementById("product-images-data");
    if (!dataEl) return;

    let images;
    try {
        images = JSON.parse(dataEl.textContent);
    } catch(e) {
        images = [];
    }

    if (!images || !images.length) return;

    const mainImg = document.getElementById("mainProductImage");
    if (!mainImg) return;

    const thumbs = document.querySelectorAll(".ibc-thumb-item");
    const nextBtn = document.querySelector(".ibc-gallery-next");
    const prevBtn = document.querySelector(".ibc-gallery-prev");

    let currentIndex = 0;

    function updateMainImage(index) {
        currentIndex = index;
        mainImg.src = images[index];
        mainImg.dataset.index = index;

        thumbs.forEach(t => t.classList.remove("active"));
        if (thumbs[index]) thumbs[index].classList.add("active");
    }

    // Thumbnail click
    thumbs.forEach((thumb, index) => {
        thumb.addEventListener("click", () => updateMainImage(index));
    });

    // Prev / Next buttons
    if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            updateMainImage((currentIndex - 1 + images.length) % images.length);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            updateMainImage((currentIndex + 1) % images.length);
        });
    }

    // Open Fancybox on main image click
    mainImg.addEventListener("click", () => {
        if (typeof Fancybox !== "undefined") {
            Fancybox.show(
                images.map(src => ({ src, type: "image" })),
                {
                    startIndex: currentIndex,
                    Thumbs: { autoStart: true }
                }
            );
        }
    });
}

function ibcInitTabs() {
    document.querySelectorAll('.ibc-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            document.querySelectorAll('.ibc-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.ibc-tab-content').forEach(c => c.style.display = 'none');
            
            const target = document.getElementById(tabId);
            if (target) target.style.display = 'block';
        });
    });
}

function ibcInitRatingForm() {
    const ratingForm = document.getElementById('ratingForm');
    const modalElement = document.getElementById('reviewModal');
    if (!ratingForm || !modalElement || typeof bootstrap === 'undefined') return;

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    const errorElement = document.getElementById('reviewFormError');
    const submitButton = document.getElementById('submitReviewBtn');
    const loadingElement = document.getElementById('reviewModalLoading');
    const nicknameInput = document.getElementById('reviewNickname');
    const emailInput = document.getElementById('reviewEmail');
    const reviewStatusBadge = document.getElementById('reviewStatusBadge');
    const productId = window.location.pathname.split('/').filter(Boolean).pop();
    const reviewDraftKey = `ibc-review-draft:${productId}`;
    const nicknameStorageKey = 'ibc-review-nickname';
    const emailStorageKey = 'ibc-review-email';
    const ratingInputs = Array.from(ratingForm.querySelectorAll('input[name="rating"]'));
    const ratingMessage = document.getElementById('reviewRatingMsg');
    const ratingDescriptions = {
        1: 'Poor',
        2: 'Fair',
        3: 'Average',
        4: 'Good',
        5: 'Excellent'
    };
    const reviewFields = [
        {
            input: document.getElementById('reviewText'),
            count: document.getElementById('reviewTextCount'),
            error: document.getElementById('reviewTextError'),
            validate: input => {
                if (!input.value.trim()) return 'Required: Review.';
                const remaining = input.minLength - input.value.length;
                return remaining > 0 ? `${remaining} ${remaining === 1 ? 'character' : 'characters'} too short` : '';
            }
        },
        {
            input: document.getElementById('reviewTitle'),
            count: document.getElementById('reviewTitleCount'),
            error: document.getElementById('reviewTitleError'),
            validate: input => input.value.trim() ? '' : 'Required: Review Title.'
        },
        {
            input: document.getElementById('reviewNickname'),
            count: document.getElementById('reviewNicknameCount'),
            error: document.getElementById('reviewNicknameError'),
            validate: input => {
                if (!input.value.trim()) return 'Required: Nickname.';
                const remaining = input.minLength - input.value.length;
                return remaining > 0 ? `${remaining} ${remaining === 1 ? 'character' : 'characters'} too short` : '';
            }
        },
        {
            input: document.getElementById('reviewEmail'),
            error: document.getElementById('reviewEmailError'),
            validate: input => {
                if (!input.value.trim()) return 'Required: Email.';
                return input.validity.typeMismatch ? 'invalid email' : '';
            }
        }
    ].filter(field => field.input);

    function updateReviewField(field, showValidation = true) {
        if (field.count) field.count.textContent = String(field.input.value.length);
        if (!field.error || !showValidation) return;

        const message = field.validate(field.input);
        field.error.textContent = message;
        field.input.setAttribute('aria-invalid', String(Boolean(message)));
    }

    function validateReviewFields(showValidation = true) {
        let fieldsValid = true;
        reviewFields.forEach(field => {
            if (field.validate(field.input)) fieldsValid = false;
            updateReviewField(field, showValidation);
        });
        return fieldsValid && ratingForm.checkValidity();
    }

    function selectRating(value) {
        const selectedInput = ratingInputs.find(input => input.value === String(value));
        if (!selectedInput) return;

        selectedInput.checked = true;
        if (ratingMessage) {
            ratingMessage.textContent = `${value} out of 5 stars selected. Product is ${ratingDescriptions[value]}.`;
        }
        ratingForm.querySelectorAll('.ibc-rating-input label').forEach(label => {
            label.classList.toggle('active', label.htmlFor === selectedInput.id);
        });
    }

    function setReviewLoading(isLoading) {
        if (loadingElement) loadingElement.hidden = !isLoading;
        const modalContent = modalElement.querySelector('.modal-content');
        if (modalContent) modalContent.setAttribute('aria-busy', String(isLoading));
    }

    function showReviewError(message) {
        if (!errorElement) return;
        errorElement.textContent = message;
        errorElement.hidden = false;
    }

    function restoreReviewData() {
        const savedDraft = window.localStorage.getItem(reviewDraftKey);
        const savedNickname = window.localStorage.getItem(nicknameStorageKey) || '';
        const savedEmail = window.localStorage.getItem(emailStorageKey) || '';

        nicknameInput.value = savedNickname;
        emailInput.value = savedEmail;
        const nicknameField = nicknameInput.closest('[data-review-identity-field]');
        const emailField = emailInput.closest('[data-review-identity-field]');
        nicknameField.classList.toggle('d-none', Boolean(savedNickname && nicknameInput.checkValidity()));
        emailField.classList.toggle('d-none', Boolean(savedEmail && emailInput.checkValidity()));

        if (savedDraft) {
            const draft = JSON.parse(savedDraft);
            if (!draft || typeof draft !== 'object' || Array.isArray(draft)) {
                throw new Error('The saved review draft has an invalid format.');
            }

            document.getElementById('reviewText').value = typeof draft.review === 'string' ? draft.review : '';
            document.getElementById('reviewTitle').value = typeof draft.review_title === 'string' ? draft.review_title : '';
            document.getElementById('reviewCheckbox').checked = draft.termsAccepted === true;
            if (draft.rating) selectRating(draft.rating);
        }

        if (reviewStatusBadge) {
            reviewStatusBadge.textContent = savedDraft ? 'Edit' : 'In progress';
        }
        reviewFields.forEach(field => updateReviewField(field, false));
        validateReviewFields(false);
    }

    function saveReviewDraft() {
        const selectedRating = ratingInputs.find(input => input.checked);
        const draft = {
            rating: selectedRating ? selectedRating.value : '',
            review: document.getElementById('reviewText').value,
            review_title: document.getElementById('reviewTitle').value,
            termsAccepted: document.getElementById('reviewCheckbox').checked
        };
        window.localStorage.setItem(reviewDraftKey, JSON.stringify(draft));
    }

    function saveIdentityField(input, storageKey) {
        const value = input.value.trim();
        if (value) {
            window.localStorage.setItem(storageKey, value);
        } else {
            window.localStorage.removeItem(storageKey);
        }
    }

    function clearReviewError() {
        if (!errorElement) return;
        errorElement.textContent = '';
        errorElement.hidden = true;
    }

    modalElement.addEventListener('show.bs.modal', () => {
        setReviewLoading(true);
        window.requestAnimationFrame(() => {
            try {
                restoreReviewData();
            } catch (error) {
                showReviewError(error.message || 'Unable to load your saved review data.');
            } finally {
                setReviewLoading(false);
            }
        });
    });

    document.querySelectorAll('[data-review-rating]').forEach(button => {
        button.addEventListener('click', () => {
            selectRating(button.dataset.reviewRating);
            clearReviewError();
            modal.show();
        });
    });

    document.querySelectorAll('[data-review-open]').forEach(button => {
        button.addEventListener('click', () => {
            clearReviewError();
            modal.show();
        });
    });

    ratingInputs.forEach(input => {
        input.addEventListener('change', () => {
            selectRating(input.value);
        });
    });

    reviewFields.forEach(field => {
        field.input.addEventListener('focus', () => updateReviewField(field));
        field.input.addEventListener('input', () => {
            updateReviewField(field);
            try {
                if (field.input === nicknameInput) {
                    saveIdentityField(nicknameInput, nicknameStorageKey);
                } else if (field.input === emailInput) {
                    saveIdentityField(emailInput, emailStorageKey);
                } else {
                    saveReviewDraft();
                }
            } catch (error) {
                showReviewError(error.message || 'Unable to save your review data in this browser.');
            }
        });
        field.input.addEventListener('blur', () => updateReviewField(field));
    });

    [[nicknameInput, nicknameStorageKey], [emailInput, emailStorageKey]].forEach(([input, storageKey]) => {
        input.addEventListener('change', () => {
            try {
                saveIdentityField(input, storageKey);
            } catch (error) {
                showReviewError(error.message || 'Unable to save your contact details in this browser.');
            }
        });
    });

    ratingInputs.forEach(input => {
        input.addEventListener('change', () => {
            try {
                saveReviewDraft();
            } catch (error) {
                showReviewError(error.message || 'Unable to save your review in this browser.');
            }
        });
    });

    document.getElementById('reviewCheckbox').addEventListener('change', () => {
        try {
            saveReviewDraft();
        } catch (error) {
            showReviewError(error.message || 'Unable to save your review in this browser.');
        }
    });

    document.querySelectorAll('[data-review-info]').forEach(button => {
        const modalId = button.dataset.reviewInfo === 'terms'
            ? 'reviewTermsModal'
            : 'reviewGuidelinesModal';
        const infoModalElement = document.getElementById(modalId);
        if (!infoModalElement) return;

        const infoModal = bootstrap.Modal.getOrCreateInstance(infoModalElement);
        button.addEventListener('click', () => infoModal.show());

        infoModalElement.addEventListener('show.bs.modal', () => {
            const openModalCount = document.querySelectorAll('.modal.show').length;
            const stackingOffset = openModalCount * 10;
            infoModalElement.style.zIndex = String(1055 + stackingOffset);
            infoModalElement.addEventListener('shown.bs.modal', () => {
                const backdrops = document.querySelectorAll('.modal-backdrop');
                const backdrop = backdrops[backdrops.length - 1];
                if (backdrop) backdrop.style.zIndex = String(1050 + stackingOffset);
            }, { once: true });
        });

        infoModalElement.addEventListener('hidden.bs.modal', () => {
            infoModalElement.style.removeProperty('z-index');
            if (document.querySelector('.modal.show')) {
                document.body.classList.add('modal-open');
            }
        });
    });

    ratingForm.addEventListener('submit', async event => {
        event.preventDefault();
        setReviewLoading(true);
        await new Promise(resolve => window.requestAnimationFrame(resolve));
        validateReviewFields();
        setReviewLoading(false);
        if (!ratingForm.reportValidity()) return;

        const formData = new FormData(ratingForm);
        const reviewData = Object.fromEntries(formData.entries());
        reviewData.rating = Number(reviewData.rating);

        clearReviewError();
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            saveReviewDraft();
            saveIdentityField(nicknameInput, nicknameStorageKey);
            saveIdentityField(emailInput, emailStorageKey);

            const response = await fetch(`/reviews/${encodeURIComponent(productId)}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(reviewData)
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to submit review.');
            }

            window.location.reload();
        } catch (error) {
            if (errorElement) {
                errorElement.textContent = error.message || 'An error occurred while submitting your review.';
                errorElement.hidden = false;
            }
            else console.error('Review submission failed:', error);
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="bi bi-check-circle me-1"></i> Submit review';
        }
    });

    if (new URLSearchParams(window.location.search).get('action') === 'write_a_review') {
        modal.show();
    }
}

// Initialize immediately (script is at bottom of page, DOM is ready)
ibcInitProductPage();
ibcInitTabs();
ibcInitRatingForm();