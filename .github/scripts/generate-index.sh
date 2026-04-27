#!/usr/bin/env bash

set -euo pipefail

GH_PAGES_DIR=${1:-gh-pages}
FRAMEWORK=${2:-""}
REPO_URL="https://github.com/rumatto/qa-automation-frameworks"

echo "Preparing gh-pages in $GH_PAGES_DIR"

mkdir -p "$GH_PAGES_DIR"

if [ -n "$FRAMEWORK" ]; then
  echo "Copying report for: $FRAMEWORK"

  SRC="$FRAMEWORK/allure-history/$FRAMEWORK"
  DEST="$GH_PAGES_DIR/$FRAMEWORK"

  if [ -d "$SRC" ]; then
    mkdir -p "$DEST"
    cp -r "$SRC"/* "$DEST"/
    echo "Copied $FRAMEWORK report"
  else
    echo "No report found at $SRC"
  fi
fi

INDEX_FILE="$GH_PAGES_DIR/index.html"

cat << 'EOF' > "$INDEX_FILE"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>QA Automation Frameworks</title>
    <style>
        :root {
            color-scheme: dark;
            --bg: #0d1117;
            --panel: #161b22;
            --panel-hover: #1f2630;
            --border: #30363d;
            --text: #e6edf3;
            --muted: #8b949e;
            --accent: #58a6ff;
            --accent-soft: #79c0ff;
            --button: #21262d;
            --button-hover: #30363d;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif;
            background: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 40px 24px;
        }

        h1 {
            color: var(--accent);
            margin: 0 0 12px;
        }

        p {
            margin: 0;
        }

        .container {
            max-width: 960px;
            margin: auto;
        }

        .hero {
            margin-bottom: 32px;
            text-align: center;
        }

        .hero p {
            color: var(--muted);
            max-width: 720px;
            margin: 0 auto;
            line-height: 1.6;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 20px;
        }

        .card {
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }

        .card:hover {
            background: var(--panel-hover);
            border-color: #3d444d;
            transform: translateY(-2px);
        }

        .card h2 {
            margin: 0 0 12px;
            color: var(--accent-soft);
        }

        .card p {
            color: var(--muted);
            line-height: 1.6;
            min-height: 72px;
        }

        .meta {
            margin-top: 14px;
            color: var(--muted);
            font-size: 14px;
        }

        .links a {
            display: inline-block;
            margin: 8px 10px 0 0;
            padding: 8px 12px;
            background: var(--button);
            border-radius: 6px;
            color: var(--text);
            text-decoration: none;
            transition: background 0.2s ease;
        }

        .links a:hover {
            background: var(--button-hover);
        }

        footer {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            color: var(--muted);
        }

        @media (max-width: 640px) {
            body {
                padding: 24px 16px;
            }

            .card p {
                min-height: 0;
            }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="hero">
        <h1>QA Automation Frameworks</h1>
        <p>
            Independent QA automation example projects collected in one monorepo.
            Open each project report directly from here, or jump to the project README for setup and local usage details.
        </p>
    </div>
    <div class="grid">
EOF

framework_card() {
  local slug=$1
  local title=$2
  local description=$3

  cat <<EOF >> "$INDEX_FILE"
        <div class="card">
            <h2>${title}</h2>
            <p>${description}</p>
            <div class="meta">Path: <code>${slug}</code></div>
            <div class="links">
                <a href="${REPO_URL}/blob/master/${slug}/README.md">Project README</a>
                <a href="./${slug}/">Open Report</a>
            </div>
        </div>
EOF
}

framework_card \
  "playwright-typescript" \
  "Playwright (TypeScript)" \
  "Playwright Test framework with page objects, shared fixtures, and HTML, JUnit, and Allure reporting."

framework_card \
  "selenium-python" \
  "Selenium (Python)" \
  "Pytest-based Selenium framework with page objects, shared fixtures, failure screenshots, and a bundled demo app."

framework_card \
  "selenium-java" \
  "Selenium (Java)" \
  "JUnit 5 Java framework with Selenium UI examples, RestAssured API examples, and bundled local demo app and API fixtures."

cat <<EOF >> "$INDEX_FILE"
        <div class="card">
            <h2>GitHub Actions</h2>
            <p>Workflow runs that build and publish the project reports.</p>
            <div class="meta">Source: repository automation</div>
            <div class="links">
                <a href="${REPO_URL}/actions">View Workflows</a>
            </div>
        </div>
    </div>
    <footer>
        QA Automation Frameworks • GitHub Pages
    </footer>
</div>
</body>
</html>
EOF

echo "Index generated at $INDEX_FILE"
