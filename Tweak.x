#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <SafariServices/SafariServices.h>

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
    %orig(sender);
    return;
}

%end