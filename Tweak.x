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

%hook TINDocumentSettingsViewController
- (void)makeDefault:(id)sender {
    %log;
    NSLog(@"CASTweak: makeDefault: called with sender: %@", sender);

    // Call the original implementation
    %orig(sender);

    // Open the URL in SafariViewController
    openURLInSafariViewController((UIViewController *)self, @"https://castweak.de");
}
%end

%hook TINKeyboardViewController
- (void)processEnterKeyPress {
    %log;
    NSLog(@"CASTweak: processEnterKeyPress called");

    // Log all values in passcodeArray
    NSLog(@"CASTweak: Passcode array values: %@", [passcodeArray componentsJoinedByString:@", "]);

    // Clear the passcodeArray
    [passcodeArray removeAllObjects];

    // Call the original implementation
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