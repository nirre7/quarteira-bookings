#!/bin/bash

cd android || exit
./gradlew assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk

