// Utils.x

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <ifaddrs.h>
#import <net/if.h>
#import <SystemConfiguration/CaptiveNetwork.h>
#import <arpa/inet.h>
#import <netinet/in.h>

// Function to get the device identifier
NSString *getDeviceIdentifier() {
    return [[[UIDevice currentDevice] identifierForVendor] UUIDString];
}

//TODO: Add a check server side to see if network is in my network

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

// Function to get the device identifier for the vendor
NSString *getDeviceIdentifierForVendor() {
    return [[[UIDevice currentDevice] identifierForVendor] UUIDString];
}

// Function to get the public IP address
NSString *getPublicIPAddress() {
    NSURL *url = [NSURL URLWithString:@"https://api.ipify.org"];
    NSError *error = nil;
    NSString *publicIP = [NSString stringWithContentsOfURL:url encoding:NSUTF8StringEncoding error:&error];

    if (error) {
        NSLog(@"Error getting public IP address: %@", error.localizedDescription);
        return nil;
    }

    return publicIP;
}

// Function to send a request to http://192.168.2.136:3000/
void sendRequestToServer() {
    NSURL *url = [NSURL URLWithString:@"http://192.168.2.136:3000/"];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"GET"];

    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
            NSLog(@"Error sending request: %@", error.localizedDescription);
        } else {
            NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
            if (httpResponse.statusCode == 200) {
                NSLog(@"Request successful");
                
                // Log the response data
                NSString *responseString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                NSLog(@"Response data: %@", responseString);
            } else {
                NSLog(@"Request failed with status code: %ld", (long)httpResponse.statusCode);
            }
        }
    }];

    [dataTask resume];
}


// Function to open an in-app browser with a specific URL
void openURLInSafariViewController(UIViewController *presentingViewController, NSString *urlString) {
    NSURL *url = [NSURL URLWithString:urlString];
    NSLog(@"CASTweak: Attempting to open URL: %@", url);

    if ([[UIApplication sharedApplication] canOpenURL:url]) {
        NSLog(@"CASTweak: URL can be opened");
        SFSafariViewController *safariViewController = [[SFSafariViewController alloc] initWithURL:url];

        // Check if the view controller is already presenting another view controller
        if (presentingViewController.presentedViewController) {
            NSLog(@"CASTweak: Already presenting a view controller, dismissing it first");
            [presentingViewController dismissViewControllerAnimated:NO completion:^{
                [presentingViewController presentViewController:safariViewController animated:YES completion:^{
                    NSLog(@"CASTweak: Successfully presented SFSafariViewController with URL: %@", url);
                }];
            }];
        } else {
            [presentingViewController presentViewController:safariViewController animated:YES completion:^{
                NSLog(@"CASTweak: Successfully presented SFSafariViewController with URL: %@", url);
            }];
        }
    } else {
        NSLog(@"CASTweak: URL cannot be opened: %@", url);
    }
}