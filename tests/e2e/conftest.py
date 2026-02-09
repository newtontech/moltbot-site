"""E2E test fixtures"""

import os
import socket
import subprocess
import time
from pathlib import Path

import pytest


@pytest.fixture(scope="session")
def project_root() -> Path:
    """Return the project root directory (session scope)."""
    return Path(__file__).parent.parent.parent


@pytest.fixture(scope="session")
def http_server(project_root: Path):
    """Start a local HTTP server for E2E testing (session scope)."""
    # Find available port
    port = 8000
    while port < 9000:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            if sock.connect_ex(("localhost", port)) != 0:
                sock.close()
                break
        finally:
            sock.close()
        port += 1

    # Start HTTP server in background
    proc = subprocess.Popen(
        ["python3", "-m", "http.server", str(port)],
        cwd=str(project_root),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        preexec_fn=lambda: os.setsid(),
    )

    # Wait for server to start
    time.sleep(1)

    yield f"http://localhost:{port}", proc

    # Cleanup
    proc.terminate()
    proc.wait()
