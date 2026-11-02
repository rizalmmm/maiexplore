// Mai Explore Komodo — ad pixels. IDs are set in window.MAI_TRACKING (see the
// "TRACKING PIXELS" block in the page <head>); an empty ID means that pixel is off.
(function () {
  "use strict";

  var cfg = window.MAI_TRACKING || {};
  var meta = (cfg.metaPixelId || "").trim();
  var tiktok = (cfg.tiktokPixelId || "").trim();
  var ga4 = (cfg.ga4Id || "").trim();

  // Meta (Facebook / Instagram) Pixel base code
  if (meta) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", meta);
    window.fbq("track", "PageView");
  }

  // TikTok Pixel base code
  if (tiktok) {
    !function (w, d, t) { w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || []; ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"]; ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; }; for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]); ttq.instance = function (t) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e; }; ttq.load = function (e, n) { var r = "https://analytics.tiktok.com/i18n/pixel/events.js"; ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r; ttq._t = ttq._t || {}; ttq._t[e] = +new Date(); ttq._o = ttq._o || {}; ttq._o[e] = n || {}; var s = d.createElement("script"); s.type = "text/javascript"; s.async = !0; s.src = r + "?sdkid=" + e + "&lib=" + t; var f = d.getElementsByTagName("script")[0]; f.parentNode.insertBefore(s, f); }; }(window, document, "ttq");
    window.ttq.load(tiktok);
    window.ttq.page();
  }

  // Google Analytics 4
  if (ga4) {
    var g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga4);
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", ga4);
  }

  // One event name (Meta standard event) mapped to each platform's equivalent
  var EVENTS = {
    InitiateCheckout: { tiktok: "InitiateCheckout", ga4: "begin_checkout" }, // clicked a "Book" button
    Lead: { tiktok: "SubmitForm", ga4: "generate_lead" },                  // sent the booking form to WhatsApp
    Contact: { tiktok: "Contact", ga4: "contact_whatsapp" }                // tapped the direct WhatsApp number
  };
  var fired = {};

  window.maiTrack = function (name, params, once) {
    if (once && fired[name]) return;
    fired[name] = true;
    var map = EVENTS[name] || {};
    params = params || {};
    if (meta && window.fbq) window.fbq("track", name, params);
    if (tiktok && window.ttq) window.ttq.track(map.tiktok || name, params);
    if (ga4 && window.gtag) window.gtag("event", map.ga4 || name, params);
  };

  // Any element with data-track="EventName" fires that event when clicked.
  // Add data-track-once to count it at most once per page view.
  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest("[data-track]") : null;
    if (!el) return;
    window.maiTrack(el.getAttribute("data-track"), {
      content_name: "Daily Dive Trip Komodo",
      content_category: "Diving"
    }, el.hasAttribute("data-track-once"));
  });
})();
