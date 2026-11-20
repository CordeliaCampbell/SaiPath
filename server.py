"""Sai Path local server.

Serves the app and saves your progress to progress.json (next to this file),
so it survives browser changes, cleared caches, and restarts.

Run:  python server.py        then open http://localhost:8766
"""
import json
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
PROGRESS = os.path.join(ROOT, "progress.json")
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8766


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def _json(self, code, body):
        data = json.dumps(body).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path == "/api/progress":
            if os.path.exists(PROGRESS):
                with open(PROGRESS, encoding="utf-8") as f:
                    return self._json(200, json.load(f))
            return self._json(200, {})
        if self.path.endswith("progress.json"):
            return self.send_error(404)
        return super().do_GET()

    def do_POST(self):
        if self.path != "/api/progress":
            return self.send_error(404)
        length = int(self.headers.get("Content-Length", 0))
        if length > 5_000_000:
            return self.send_error(413)
        try:
            data = json.loads(self.rfile.read(length) or b"{}")
            if not isinstance(data, dict):
                raise ValueError
        except ValueError:
            return self._json(400, {"ok": False})
        tmp = PROGRESS + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        os.replace(tmp, PROGRESS)  # atomic write, never leaves a half-saved file
        return self._json(200, {"ok": True})

    def end_headers(self):
        # always serve fresh app files so updates show up immediately
        if not self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        if "/api/" not in (args[0] if args else ""):
            super().log_message(fmt, *args)


if __name__ == "__main__":
    print(f"Sai Path running at http://localhost:{PORT}  (progress -> {PROGRESS})")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
