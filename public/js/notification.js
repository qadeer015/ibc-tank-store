// public/js/notification.js
class CustomNotification {
  constructor(message, type = "success", autoclose = true, duration = 3000) {
    this.message = message,
      this.type = type,
      this.autoclose = autoclose,
      this.duration = duration
    this.show(this.message, this.type, this.duration, this.autoclose);
  }

  show(message, type, duration, autoclose) {
    const existingAlert = document.querySelector('.alert.alert-dismissible.fade');
    if (existingAlert) {
      existingAlert.remove();
    }

    const alertEl = document.createElement("div");
    alertEl.classList.add("position-fixed", "alert", `alert-${type}`, "alert-dismissible", "fade", "show");
    alertEl.style.zIndex = "9999";
    alertEl.style.right = "10px";
    alertEl.style.top = "10px";

    const messageEL = document.createElement("div");
    messageEL.style.maxWidth = "300px";
    messageEL.style.wordBreak = "break-all";
    messageEL.style.whiteSpace = "pre-line";
    messageEL.setAttribute("role", "alert");
    messageEL.textContent = message;

    alertEl.appendChild(messageEL);
    document.body.appendChild(alertEl);

    if (autoclose) {
      setTimeout(() => {
        messageEL.remove();
        alertEl.remove();
      }, duration)
    } else {
      const hideBtnEl = document.createElement("button");
      hideBtnEl.classList.add("btn-close");
      hideBtnEl.setAttribute("data-bs-dismiss", "alert");
      hideBtnEl.setAttribute("aria-label", "Close");
      alertEl.appendChild(hideBtnEl);
    }
  }
}

// Make it available globally
window.CustomNotification = CustomNotification;