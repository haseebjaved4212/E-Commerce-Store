# Buddy Shop — Mini E-Commerce

A compact, single-page mini e-commerce demo built with plain HTML, CSS, and JavaScript. This repository is designed as a learning / demo project: it showcases product listing, a cart sidebar, a checkout modal (mock), and non-persistent order flow using browser `localStorage`.

## Preview

- [Live Demo]()

## Features

- Product grid with categories filter
- Product detail single-view
- Add to cart, quantity editing, remove items
- Cart sidebar with running total
- Checkout modal with mock order flow
- Persistent cart using `localStorage`
- Non-blocking toast notifications (success, info, warning, error)

## Project structure

Files in the root:

- `index.html` — main HTML file (contains page structure and toast container).
- `style.css` — site styles and toast styles.
- `script.js` — all JavaScript logic (products, cart, UI helpers including `showToast`).
- `assets/` — product images used by the demo.

## How to run

1. Open the project folder in your file explorer.
2. Double-click `index.html` to open it in your default browser.

Or, for a simple local server (recommended for consistent behavior with images and browser features):

- With Python 3 installed (Windows PowerShell):

```powershell
# from the project folder
python -m http.server 8000; Start-Process "http://localhost:8000"
```

- With Node (http-server):

```powershell
npm install -g http-server; http-server -c-1
```

Then open `http://localhost:8000` in your browser.

## How it works (high-level)

- `PRODUCTS` in `script.js` is an in-memory list of demo products.
- Cart operations (`addToCart`, `removeFromCart`, `setQuantity`) read/write the cart to `localStorage` under the key `buddy_cart_v1`.
- `renderProducts()` and `renderCartSidebar()` update the DOM from JS state.
- `showToast(message, options)` provides an accessible, non-blocking notification; used across the app instead of `alert()`.

Example usage of `showToast`:

```js
showToast('Added to cart', { type: 'success', duration: 3000 });
```

Supported `type` values: `success`, `info`, `warning`, `error`.

## Customization

- Add/remove products: edit the `PRODUCTS` array in `script.js`.
- Change styles: modify `style.css` variables (`--brand`, `--accent`) and toast styles in the `#toast-container` / `.toast` rules.
- Persisting to a backend: replace the `saveCart`/`getCart` logic and call your API when placing an order.

## Accessibility notes

- The toast container uses `aria-live="polite"` and `aria-atomic="true"` to announce new messages without interrupting screen reader users.
- Keyboard users can dismiss a toast by focusing and pressing Enter (the toast is clickable to dismiss).
- Forms include semantic controls and `required` attributes for basic validation.

## Troubleshooting

- Images not showing? If you opened `index.html` directly and the browser blocks local file image loading, run a local server (see How to run).
- Toasts not appearing? Make sure `#toast-container` exists in `index.html` and `style.css` is loaded.

## Next steps / Enhancements

- Add persistent user sessions and backend APIs for real orders.
- Add animations for cart items and richer product galleries.
- Improve keyboard focus handling for toasts (focusable close button).

## License

MIT License — feel free to use and adapt this demo for learning and small projects.
