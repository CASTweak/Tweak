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
    return;
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

    %orig(sender);
    return;
}

%end