#!/bin/bash

echo "🌀 TYPOCALYPSE Extension Test 🌀"
echo "================================"
echo ""

# Check if development server is running
if pgrep -f "plasmo dev" > /dev/null; then
    echo "✅ Development server is running"
else
    echo "❌ Development server is not running"
    echo "   Run: pnpm dev"
    exit 1
fi

# Check if build directory exists
if [ -d "build/chrome-mv3-dev" ]; then
    echo "✅ Build directory exists"
else
    echo "❌ Build directory not found"
    exit 1
fi

# Check if manifest exists and is valid
if [ -f "build/chrome-mv3-dev/manifest.json" ]; then
    echo "✅ Manifest file exists"
    
    # Basic validation
    if jq empty build/chrome-mv3-dev/manifest.json 2>/dev/null; then
        echo "✅ Manifest JSON is valid"
    else
        echo "❌ Manifest JSON is invalid"
    fi
else
    echo "❌ Manifest file not found"
fi

# Check if content scripts exist
content_scripts=("autocomplete" "cursorChaos" "ghostTyping")
for script in "${content_scripts[@]}"; do
    if ls build/chrome-mv3-dev/${script}.*.js 1> /dev/null 2>&1; then
        echo "✅ Content script ${script} built successfully"
    else
        echo "❌ Content script ${script} not found"
    fi
done

# Check if popup files exist
if [ -f "build/chrome-mv3-dev/popup.html" ]; then
    echo "✅ Popup HTML exists"
else
    echo "❌ Popup HTML not found"
fi

if ls build/chrome-mv3-dev/popup.*.js 1> /dev/null 2>&1; then
    echo "✅ Popup JavaScript built successfully"
else
    echo "❌ Popup JavaScript not found"
fi

echo ""
echo "📋 Installation Instructions:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' (top right toggle)"
echo "3. Click 'Load unpacked'"
echo "4. Select the 'build/chrome-mv3-dev' folder"
echo "5. The extension should appear in your toolbar!"
echo ""
echo "🎮 Usage:"
echo "1. Click the extension icon to open settings"
echo "2. Adjust chaos level and toggle features"
echo "3. Visit any website and experience the chaos!"
echo ""
