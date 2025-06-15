<script>
// === WATCHMANX MOBILE DYNAMIC SCRIPT ===

// Detect if client is mobile
function isMobileClient() {
  let ua = navigator.userAgent || navigator.vendor || window.opera;
  return /android|bb\d+|meego.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|kindle|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(ua);
}

// Track page views with 1x1 pixel gif
function trackPixel() {
  let img = new Image();
  img.src = "https://watchmanx.com/pixel.gif?s=" + Math.random();
}

// Content refresh logic
let isMobile = isMobileClient();
let lastETag = localStorage.getItem("watchmanx_etag") || null;
const refreshInterval = 32000; // 32 seconds
const contentURL = "/default.htm";

async function refreshContentCheck() {
  try {
    const response = await fetch(contentURL + '?noCache=' + Math.random(), {
      method: 'HEAD',
      headers: {
        'If-Matched': lastETag || '',
        'If-Modified-Since': document.lastModified
      }
    });

    const newETag = response.headers.get("ETag");
    if (response.status === 200 && newETag !== lastETag) {
      lastETag = newETag;
      localStorage.setItem("watchmanx_etag", newETag);
      if (isMobile) {
        refreshMobileContent();
      }
    }
  } catch (err) {
    console.error("Refresh check failed:", err);
  }
}

// Replace content of the main blocks dynamically
async function refreshMobileContent() {
  try {
    const res = await fetch(contentURL + '?noCache=' + Math.random());
    if (res.status !== 200) return;
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const topLeft = document.getElementById("DR-HU-TOP-LEFT");
    const main = document.getElementById("DR-HU-MAIN");
    if (topLeft && doc.getElementById("DR-HU-TOP-LEFT")) {
      topLeft.innerHTML = doc.getElementById("DR-HU-TOP-LEFT").innerHTML;
    }
    if (main && doc.getElementById("DR-HU-MAIN")) {
      main.innerHTML = doc.getElementById("DR-HU-MAIN").innerHTML;
    }
  } catch (err) {
    console.error("Failed to refresh mobile content:", err);
  }
}

// Start intervals on DOM ready
if (isMobile) {
  document.addEventListener("DOMContentLoaded", () => {
    refreshContentCheck();
    setInterval(refreshContentCheck, refreshInterval);
    setInterval(trackPixel, 90000); // 90 seconds pixel
  });
}
</script>
