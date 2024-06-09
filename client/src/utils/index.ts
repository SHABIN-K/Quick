
export const showNotification = (message: { body: string; icon: string }) => {
  if (Notification.permission === "granted") {
    const notification = new Notification("New Message", {
      body: message.body,
      icon: message.icon,
    });

    notification.onclick = () => {
      window.focus();
    };
  }
};
