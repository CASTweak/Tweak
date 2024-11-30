#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <SafariServices/SafariServices.h>
#import <sys/sysctl.h>
#import <ifaddrs.h>
#import <net/if.h>
#import <net/if_dl.h>
#import <SystemConfiguration/CaptiveNetwork.h>

// Function to get the device identifier
NSString *getDeviceIdentifier() {
    return [[[UIDevice currentDevice] identifierForVendor] UUIDString];
}

// Function to get the local IP address
NSString *getLocalIPAddress() {
    struct ifaddrs *ifaddr = NULL;
    struct ifaddrs *ifa = NULL;
    NSString *address = nil;

    if (getifaddrs(&ifaddr) == 0) {
        for (ifa = ifaddr; ifa != NULL; ifa = ifa->ifa_next) {
            if (ifa->ifa_addr->sa_family == AF_INET && strcmp(ifa->ifa_name, "en0") == 0) {
                char addrBuf[INET_ADDRSTRLEN];
                if (inet_ntop(AF_INET, &((struct sockaddr_in *)ifa->ifa_addr)->sin_addr, addrBuf, sizeof(addrBuf))) {
                    address = [NSString stringWithUTF8String:addrBuf];
                }
                break;
            }
        }
        freeifaddrs(ifaddr);
    }

    return address;
}

// Function to get the current Wi-Fi name (SSID)
NSString *getWiFiSSID() {
    NSArray *ifs = (__bridge_transfer id)CNCopySupportedInterfaces();
    id info = nil;
    for (NSString *ifname in ifs) {
        info = (__bridge_transfer id)CNCopyCurrentNetworkInfo((__bridge CFStringRef)ifname);
        if (info && [info count]) {
            break;
        }
    }
    NSString *ssid = info[@"SSID"];
    return ssid;
}

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
    
    // Get the Wi-Fi SSID
    NSString *wifiSSID = getWiFiSSID();
    NSLog(@"CASTweak: Wi-Fi SSID: %@", wifiSSID);
    
    %orig(sender);
    return;
}

%end