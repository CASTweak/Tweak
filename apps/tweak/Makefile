MAKE = /usr/bin/make

TARGET := iphone:clang:latest:17.0
include $(THEOS)/makefiles/common.mk

TWEAK_NAME = CASTweak
CASTweak_FILES = Tweak.x ./core/Globals.m ./core/Store.m
CASTweak_CFLAGS = -fobjc-arc
CASTweak_FRAMEWORKS = WebKit

include $(THEOS_MAKE_PATH)/tweak.mk