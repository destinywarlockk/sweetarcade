#!/bin/bash
# Cache busting script for Sweetwater Arcade
# Run this before each commit to update cache-busting timestamps

TIMESTAMP=$(date +"%Y%m%d-%H%M")

echo "🔄 Updating cache-busting timestamps to: $TIMESTAMP"

# Update HTML file with new timestamps
sed -i.bak "s/v=[0-9]\{8\}-[0-9]\{4\}/v=$TIMESTAMP/g" index.html

# Remove backup file
rm -f index.html.bak

echo "✅ Cache-busting timestamps updated!"
echo "📝 Files updated: index.html"
echo "🚀 Ready to commit and push!"
