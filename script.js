const FORM_ENDPOINT = 'https://formsubmit.co/ajax/vscivilandinteriors@gmail.com';

const form = document.getElementById('queryForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const submitAnotherBtn = document.getElementById('submitAnotherBtn');
const formNextUrl = document.getElementById('formNextUrl');

const isLocalFile = window.location.protocol === 'file:';
const thankYouUrl = new URL('thank-you.html', window.location.href).href;

if (formNextUrl) {
  formNextUrl.value = thankYouUrl;
}

function clearErrors() {
  form.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));
  const toast = form.querySelector('.error-toast');
  if (toast) toast.remove();
}

function showError(message) {
  clearErrors();
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.textContent = message;
  form.prepend(toast);
}

function validateForm() {
  clearErrors();
  let valid = true;

  const requiredFields = ['name', 'email', 'phone', 'message'];
  requiredFields.forEach((id) => {
    const field = document.getElementById(id);
    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    }
  });

  const email = document.getElementById('email');
  if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    email.classList.add('error');
    valid = false;
  }

  const phone = document.getElementById('phone');
  if (phone.value.trim() && !/^[0-9+\s\-()]{7,15}$/.test(phone.value.trim())) {
    phone.classList.add('error');
    valid = false;
  }

  if (!valid) {
    showError('Please fill in all required fields correctly.');
  }

  return valid;
}

function showSuccess() {
  form.hidden = true;
  successMessage.hidden = false;
  successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

form.addEventListener('submit', async (e) => {
  if (!validateForm()) {
    e.preventDefault();
    return;
  }

  if (isLocalFile) {
    e.preventDefault();
    showError('Please open this site using start-server.bat (not as a local file). Email delivery only works through a web server.');
    return;
  }

  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.querySelector('span').textContent = 'Submitting...';

  const formData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    location: document.getElementById('location').value.trim() || 'Not provided',
    service: document.getElementById('service').value || 'Not specified',
    message: document.getElementById('message').value.trim(),
    _subject: 'New Query from M/S VS Civil & Interiors Website',
    _template: 'table',
    _captcha: 'false'
  };

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success === 'false' || result.success === false) {
      throw new Error(result.message || 'Submission failed. Please use start-server.bat to run the site.');
    }

    if (!response.ok) {
      throw new Error('Submission failed. Please try again.');
    }

    showSuccess();
  } catch (err) {
    showError(err.message || 'Something went wrong. Please try again or contact us directly via phone or email.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector('span').textContent = 'Submit Query';
  }
});

submitAnotherBtn.addEventListener('click', () => {
  form.reset();
  clearErrors();
  form.hidden = false;
  successMessage.hidden = true;
  document.getElementById('name').focus();
});

if (new URLSearchParams(window.location.search).get('submitted') === 'true') {
  showSuccess();
}
