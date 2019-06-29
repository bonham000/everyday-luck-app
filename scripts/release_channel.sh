#!/bin/bash

# Set the release channel using the current Expo SDK version, e.g. production-33.0.0

export RELEASE_CHANNEL=production-$(cat app.json | jq '.expo.sdkVersion' | sed -e 's/^"//' -e 's/"$//')
echo "Set release channel to: $RELEASE_CHANNEL"
