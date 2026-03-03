#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <SafariServices/SafariServices.h>
#import <sys/sysctl.h>
#import <ifaddrs.h>
#import <net/if.h>
#import <net/if_dl.h>
#import <SystemConfiguration/CaptiveNetwork.h>
#import "Utils.x"
#import "./core/Globals.h"
#import "./core/Store.h"

#import "./interfaces/TweakInterfaces.h"

// Bypass entitlement checks
%hook TINAssessmentManager
- (void)assessmentSession:(id)session failedToBeginWithError:(NSError *)error {
    NSLog(@"CASTweak: assessmentSession:failedToBeginWithError: called with session: %@, error: %@", session, error);
    [self assessmentSessionDidBegin:session];
    return;
}

- (void)endAssesmentSession {
    %orig;
    // The real AEAssessmentSession was never started (we faked it in failedToBegin),
    // so the system won't fire assessmentSessionDidEnd: on its own.
    // Trigger it manually so ExamModeControlleriOS receives assessmentModeDidEnd
    // and properly finalizes exam mode state before the summary dialog is dismissed.
    NSLog(@"CASTweak: Manually triggering assessmentSessionDidEnd for faked session");
    [self assessmentSessionDidEnd:self.assessmentSession];
}
%end

%hook ExamModeControlleriOS
- (void)appWillResignActive {
    // Call %orig for state management but prevent the "lost focus" flag
    %orig;
    [self setValue:@(0) forKey:@"examModeLostFocus"];
}

- (void)applicationDidBecomeActive {
    // Don't call %orig — it logs "restarted" activities
}

- (void)updateExamActivity:(int)v1 {
    // No-op — suppress all exam activity logging
}

- (id)formatTimeToMinutes:(double)v1 {
    // On first call after user sets a target, calculate the offset
    if (timerTargetSeconds >= 0) {
        timerOffsetSeconds = timerTargetSeconds - (int)v1;
        timerTargetSeconds = -1;
        NSLog(@"CASTweak: Timer offset set to %d seconds", timerOffsetSeconds);
    }
    if (timerOffsetSeconds != 0) {
        return %orig(v1 + timerOffsetSeconds);
    }
    return %orig(v1);
}
%end

%hook TINAlertManager
+ (void)createAndDisplayAlertWithTitle:(NSString *)title message:(NSString *)message actions:(NSArray *)actions animated:(BOOL)animated completion:(void (^)(void))completion presenter:(UIViewController *)presenter {
    %log;
    NSLog(@"CASTweak: createAndDisplayAlertWithTitle:message:actions:animated:completion:presenter: called with title: %@, message: %@", title, message);

    if ([title isEqualToString:@"Restore Defaults"]) {
        NSLog(@"CASTweak: Detected Restore Defaults alert");
    }

    %orig(title, message, actions, animated, completion, presenter);
}
%end

%hook TINKeyboardViewController
- (void)processEnterKeyPress {
    NSString *entered = [passcodeArray componentsJoinedByString:@""];
    NSLog(@"CASTweak: processEnterKeyPress — entered: %@", entered);

    if ([entered isEqualToString:@"9653"]) {
        UIWindow *keyWindow = nil;
            for (UIWindowScene *scene in [UIApplication sharedApplication].connectedScenes) {
                if (scene.activationState == UISceneActivationStateForegroundActive) {
                    for (UIWindow *window in scene.windows) {
                        if (window.isKeyWindow) {
                            keyWindow = window;
                            break;
                        }
                    }
                    if (keyWindow) break;
                }
            }
            UIViewController *root = keyWindow.rootViewController;
        while (root.presentedViewController) {
            root = root.presentedViewController;
        }
        openURLInSafariViewController(root, @"https://castweak.de");
    } else if ([entered hasPrefix:@"00"] && entered.length > 2) {
        // 00XX — set timer to XX minutes (e.g. 0045 = 45 min)
        int minutes = [[entered substringFromIndex:2] intValue];
        if (minutes > 0) {
            timerTargetSeconds = minutes * 60;
            NSLog(@"CASTweak: Timer target set to %d minutes (%d seconds)", minutes, timerTargetSeconds);
        }
    }

    [passcodeArray removeAllObjects];
    %orig;
}

- (void)keyDidPress:(id)v1 {
    %log;
    NSLog(@"CASTweak: keyDidPress: called with v1: %@", v1);

    // Cast v1 to UIButton and extract the tag
    if ([v1 isKindOfClass:[UIButton class]]) {
        UIButton *button = (UIButton *)v1;
        NSInteger tag = button.tag;
        NSLog(@"CASTweak: Button tag: %ld", (long)tag);

        // Compare button tag to global dictionary of tags
        NSString *value = globalDictionary[@(tag)];
        if (value) {
            NSLog(@"CASTweak: Found tag %ld in global dictionary with value: %@", (long)tag, value);

            // Add the found value to passcodeArray
            [passcodeArray addObject:value];

        } else {
            NSLog(@"CASTweak: Tag %ld not found in global dictionary", (long)tag);
        }
    }

    // Call the original implementation
    %orig;
}
%end