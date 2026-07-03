(function () {
    var modalEl = document.getElementById('formStatusModal');

    if (!modalEl) {
        document.body.insertAdjacentHTML('beforeend',
            '<div class="modal fade" id="formStatusModal" tabindex="-1" aria-labelledby="formStatusTitle" aria-hidden="true">' +
                '<div class="modal-dialog modal-dialog-centered">' +
                    '<div class="modal-content form-status-modal">' +
                        '<div class="modal-body text-center py-4 px-4">' +
                            '<div id="formStatusIcon" class="form-status-icon mb-3"></div>' +
                            '<h4 id="formStatusTitle" class="form-status-title mb-2"></h4>' +
                            '<p id="formStatusMessage" class="form-status-message mb-4"></p>' +
                            '<button type="button" class="btn btn-style" data-bs-dismiss="modal">OK</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
        modalEl = document.getElementById('formStatusModal');
    }

    var iconEl = document.getElementById('formStatusIcon');
    var titleEl = document.getElementById('formStatusTitle');
    var messageEl = document.getElementById('formStatusMessage');
    var modal = new bootstrap.Modal(modalEl);

    function showStatus(type, title, message) {
        var isSuccess = type === 'success';

        iconEl.innerHTML = isSuccess
            ? '<i class="fas fa-check-circle"></i>'
            : '<i class="fas fa-exclamation-circle"></i>';
        iconEl.className = 'form-status-icon mb-3 ' + (isSuccess ? 'is-success' : 'is-error');

        titleEl.textContent = title;
        messageEl.textContent = message;
        modal.show();
    }

    function handleSubmit(event) {
        event.preventDefault();

        var form = event.target;
        var submitBtn = form.querySelector('[type="submit"]');
        var originalBtnText = submitBtn ? submitBtn.innerHTML : '';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending...';
        }

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form)
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.success) {
                    form.reset();
                    var subjectField = form.querySelector('[name="subject"]');
                    var isCareerForm = subjectField && subjectField.value.toLowerCase().indexOf('career') !== -1;
                    showStatus(
                        'success',
                        'Thank You!',
                        isCareerForm
                            ? 'Your application has been submitted successfully. We\'ll be in touch soon.'
                            : 'Your message has been sent successfully. We\'ll get back to you soon.'
                    );
                } else {
                    showStatus(
                        'error',
                        'Submission Failed',
                        data.message || 'Something went wrong. Please try again.'
                    );
                }
            })
            .catch(function () {
                showStatus(
                    'error',
                    'Submission Failed',
                    'Unable to send your message. Please check your connection and try again.'
                );
            })
            .finally(function () {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            });
    }

    document.querySelectorAll('form[action*="api.web3forms.com"]').forEach(function (form) {
        form.addEventListener('submit', handleSubmit);
    });
})();
