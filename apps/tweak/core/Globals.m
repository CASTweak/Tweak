// Globals.m
#import "Globals.h"
#include <Foundation/Foundation.h>

NSDictionary<NSNumber *, NSString *> *globalDictionary;

__attribute__((constructor)) static void initializeGlobalDictionary() {
  globalDictionary = @{
    @4080 : @"0",
    @3080 : @"1",
    @3090 : @"2",
    @3100 : @"3",
    @2080 : @"4",
    @2090 : @"5",
    @2100 : @"6",
    @1080 : @"7",
    @1090 : @"8",
    @1100 : @"9",
  };
}