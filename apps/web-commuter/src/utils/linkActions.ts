// Opens a link: web pages in a new tab; tel: and mailto: hand off to the phone or mail app.
export function openURLSafe(url: string) {
  try {
    if (/^https?:/i.test(url)) window.open(url, "_blank", "noopener,noreferrer");
    else window.location.href = url;
  } catch (error) {
    console.error("Error opening link:", error);
  }
}

// Opens phone dialer.
export function callNumber(phone: string) {
  openURLSafe(`tel:${phone.replace(/\s+/g, "")}`);
}

// Opens default email client.
export function sendEmail(email: string, subject?: string) {
  const encodedSubject = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  openURLSafe(`mailto:${email}${encodedSubject}`);
}

// Opens an external website or social media page.
export function openWebsite(url: string) {
  openURLSafe(url.startsWith("http") ? url : `https://${url}`);
}
