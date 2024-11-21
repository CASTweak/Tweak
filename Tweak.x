#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <SafariServices/SafariServices.h>

// Forward declare the TINDocumentPageViewController class
@interface TINDocumentPageViewController : UIViewController
@end

%hook TINDocumentPageViewController

- (void)openHelp:(id)sender {
    %log; // Log the method call

    // Log the sender object
    NSLog(@"openHelp: called with sender: %@", sender);

    // Call the original method
    %orig(sender);

    // Log after calling the original method
    NSLog(@"Original openHelp: method called");

    // Open an in-app browser with a specific URL
    NSURL *url = [NSURL URLWithString:@"https://www.example.com"];
    NSLog(@"Attempting to open URL: %@", url);

    if ([[UIApplication sharedApplication] canOpenURL:url]) {
        NSLog(@"URL can be opened");
        SFSafariViewController *safariViewController = [[SFSafariViewController alloc] initWithURL:url];
        
        // Check if the view controller is already presenting another view controller
        if (self.presentedViewController) {
            NSLog(@"Already presenting a view controller, dismissing it first");
            [self dismissViewControllerAnimated:NO completion:^{
                [self presentViewController:safariViewController animated:YES completion:^{
                    NSLog(@"Successfully presented SFSafariViewController with URL: %@", url);
                }];
            }];
        } else {
            [self presentViewController:safariViewController animated:YES completion:^{
                NSLog(@"Successfully presented SFSafariViewController with URL: %@", url);
            }];
        }
    } else {
        NSLog(@"URL cannot be opened: %@", url);
    }
}

%end