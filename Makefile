TARGET := iphone:clang:latest:17.0


include $(THEOS)/makefiles/common.mk

TWEAK_NAME = CASTweak

CASTweak_FILES = Tweak.x
CASTweak_CFLAGS = -fobjc-arc

include $(THEOS_MAKE_PATH)/tweak.mk
