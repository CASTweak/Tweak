// Globals.m
#import "Store.h"
#include <Foundation/Foundation.h>

NSMutableArray *passcodeArray;

__attribute__((constructor)) static void initializePasscodeArray() {
  passcodeArray = [NSMutableArray array];
}