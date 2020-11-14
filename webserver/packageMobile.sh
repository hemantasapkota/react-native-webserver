#!/bin/bash
set -e
IOS_DEST=../ios/ReactNativeWebServer/AppWebServer/
IOS_FRAMEWORK_FILE=WebServer.framework

ANDROID_DEST=../android/app/libs/
ANDROID_FRAMEWORK_FILE=webserver.aar
ANDROID_FRAMEWORK_FILE_SOURCES=webserver-sources.jar

if [ $# -eq 0 ]
then
  echo "Specify a target: ios, android"
  exit
fi

gomobile bind -target $1 -v

if [ $1 = "ios" ]; then
  if [ ! -f "$IOS_DEST/$IOS_FRAMEWORK_FILE" ]; then
    rm -rf "$IOS_DEST/$IOS_FRAMEWORK_FILE"
  fi
  mv $IOS_FRAMEWORK_FILE $IOS_DEST
fi

if [ $1 = "android" ]; then
  if [ ! -f "$ANDROID_DEST/$ANDROID_FRAMEWORK_FILE" ]; then
    rm -rf "$ANDROID_DEST/$ANDROID_FRAMEWORK_FILE"
    cp -R $ANDROID_FRAMEWORK_FILE $ANDROID_DEST
    cp -R $ANDROID_FRAMEWORK_FILE_SOURCES $ANDROID_DEST
  fi
  rm -rf $ANDROID_FRAMEWORK_FILE
  rm -rf $ANDROID_FRAMEWORK_FILE_SOURCES
fi

