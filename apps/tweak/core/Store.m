// Globals.m
#import "Store.h"
#include <Foundation/Foundation.h>

NSMutableArray *passcodeArray;
int timerTargetSeconds = -1;
int timerOffsetSeconds = 0;
NSString *panelPasscode;
double lastRawElapsedSeconds = 0;

__attribute__((constructor)) static void initializePasscodeArray() {
  passcodeArray = [NSMutableArray array];

  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  panelPasscode = [defaults stringForKey:@"CASTweakPasscode"] ?: @"9653";
}