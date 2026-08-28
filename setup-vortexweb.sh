#!/bin/bash

mkdir -p src/assets

echo "Looking for VortexWeb assets in ~/Downloads..."

MARK=$(find ~/Downloads -iname "*vortexweb*v*navy*" -iname "*.png" 2>/dev/null | head -n 1)
WORDMARK=$(find ~/Downloads -iname "*vortexweb*wordmark*" -iname "*.png" 2>/dev/null | head -n 1)
AVATAR=$(find ~/Downloads -iname "*vortexweb*avatar*" -iname "*.png" 2>/dev/null | head -n 1)

if [ -n "$MARK" ]; then
  cp "$MARK" src/assets/vortex-mark.png
  echo "✅ Copied mark: $MARK"
else
  echo "❌ Mark not found"
fi

if [ -n "$WORDMARK" ]; then
  cp "$WORDMARK" src/assets/vortex-wordmark.png
  echo "✅ Copied wordmark: $WORDMARK"
else
  echo "❌ Wordmark not found"
fi

if [ -n "$AVATAR" ]; then
  cp "$AVATAR" src/assets/vortex-avatar.png
  echo "✅ Copied avatar: $AVATAR"
else
  echo "❌ Avatar not found"
fi

echo "Done. Check src/assets/ folder."
