#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <SafariServices/SafariServices.h>
#import <sys/sysctl.h>
#import <ifaddrs.h>
#import <net/if.h>
#import <net/if_dl.h>
#import <SystemConfiguration/CaptiveNetwork.h>
#import "Utils.x"

// Forward declare the TINAssessmentManager class
@interface TINAssessmentManager : NSObject
- (void)assessmentSessionDidBegin:(id)session;
@end

// Forward declare the TINAssessmentManager class
@interface ExamModeControlleriOS : NSObject
@property(nonatomic) int summaryDialogWillAppear;
@property(retain, nonatomic) NSMutableArray *activities;
@end

// Define the TINDocumentPageViewController class with the necessary methods and properties
@interface TINDocumentPageViewController : UIViewController
@property (nonatomic, readonly) UIViewController *presentedViewController;
- (void)dismissViewControllerAnimated:(BOOL)flag completion:(void (^)(void))completion;
- (void)presentViewController:(UIViewController *)viewControllerToPresent animated:(BOOL)flag completion:(void (^)(void))completion;
@end

// Bypass entitlement checks
%hook TINAssessmentManager
- (void)assessmentSession:(id)session failedToBeginWithError:(NSError *)error {
    NSLog(@"CASTweak: assessmentSession:failedToBeginWithError: called with session: %@, error: %@", session, error);
    [self assessmentSessionDidBegin:session];
    return;
}
%end

%hook ExamModeControlleriOS
- (void)applicationDidBecomeActive {
    %log;
    NSLog(@"CASTweak: applicationDidBecomeActive called");

    // Retrieve and modify the activities array
    NSMutableArray *activities = [self valueForKey:@"activities"];

    NSLog(@"CASTweak: Original Activities array: %@", activities);

    //log the index of each activity
    for (int i = 0; i < activities.count; i++) {
        NSLog(@"CASTweak: Activity at index %d: %@", i, activities[i]);
    }

    if (activities.count >= 1) {
        // Remove the last activity from the array
        [activities removeObjectsInRange:NSMakeRange(activities.count - 1, 1)];
        // Set the modified activities array back
        [self setValue:activities forKey:@"activities"];
    }

    //%orig;

    NSLog(@"CASTweak: Modified Activities array: %@", activities);
}
%end

%hook TINDocumentPageViewController

- (void)showDocumentSettings:(id)sender {
    %log;
    NSLog(@"CASTweak: showDocumentSettings: called with sender: %@", sender);
    
    // Get the local IP address
    NSString *localIPAddress = getLocalIPAddress();
    NSLog(@"CASTweak: Local IP Address: %@", localIPAddress);
    
    // Get the local IP address
    NSString *publicIPAddress = getPublicIPAddress();
    NSLog(@"CASTweak: Public IP Address: %@", publicIPAddress);

    NSString *deviceUUID = getDeviceIdentifierForVendor();
    NSLog(@"CASTweak: Device UUID: %@", deviceUUID);

    // Open an in-app browser with a specific URL
    NSURL *url = [NSURL URLWithString:@"https://google.com"];
    NSLog(@"CASTweak: Attempting to open URL: %@", url);

    if ([[UIApplication sharedApplication] canOpenURL:url]) {
        NSLog(@"CASTweak: URL can be opened");
        SFSafariViewController *safariViewController = [[SFSafariViewController alloc] initWithURL:url];

        // Check if the view controller is already presenting another view controller
        if (self.presentedViewController) {
            NSLog(@"CASTweak: Already presenting a view controller, dismissing it first");
            [self dismissViewControllerAnimated:NO completion:^{
                [self presentViewController:safariViewController animated:YES completion:^{
                    NSLog(@"CASTweak: Successfully presented SFSafariViewController with URL: %@", url);
                }];
            }];
        } else {
            [self presentViewController:safariViewController animated:YES completion:^{
                NSLog(@"CASTweak: Successfully presented SFSafariViewController with URL: %@", url);
            }];
        }
    } else {
        NSLog(@"CASTweak: URL cannot be opened: %@", url);
    }

    %orig(sender);
    return;
}

%end

%hook TINAlertManager
+ (void)createAndDisplayAlertWithTitle:(NSString *)title message:(NSString *)message actions:(NSArray *)actions animated:(BOOL)animated completion:(void (^)(void))completion presenter:(UIViewController *)presenter {
    %log;
    NSLog(@"CASTweak: createAndDisplayAlertWithTitle:message:actions:animated:completion:presenter: called with title: %@, message: %@", title, message);

    %orig(title, message, actions, animated, completion, presenter);
}
%end