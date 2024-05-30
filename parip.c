#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char* peerId;
    char* profile;
    char* name;
} User;

typedef struct {
    User* session;
    char* members[100];
    int member_count;
} AuthStore;

AuthStore authStore;

void endCall() {
    printf("Call ended.\n");
    // Release media devices (stubbed)
}

void answerCall(const char* call) {
    printf("Answering call from %s\n", call);
    // Access media devices (stubbed)
    endCall();
}

void handleIncomingCall(const char* call) {
    printf("Incoming call from %s\n", call);
    // User interaction to accept or reject call
    char response;
    printf("Accept call? (y/n): ");
    scanf(" %c", &response);
    if (response == 'y') {
        answerCall(call);
    } else {
        printf("Call rejected.\n");
    }
}

void pusherClient_subscribe(const char* channel) {
    printf("Subscribed to channel: %s\n", channel);
    // Handle incoming call event
    handleIncomingCall("peer_123");
}

void initiateCall(const char* remotePeerId) {
    printf("Initiating call to %s\n", remotePeerId);
    // Access media devices and initiate call (stubbed)
    endCall();
}

void onPeerOpen(const char* id) {
    printf("My peer ID is: %s\n", id);
    authStore.session->peerId = strdup(id);
}

void onPeerCall(const char* call) {
    printf("Receiving call from: %s\n", call);
    answerCall(call);
}

void setupPeer() {
    // Simulating PeerJS behavior
    onPeerOpen("my_peer_id");

    // Simulate an incoming call
    onPeerCall("peer_456");
}

int main() {
    // Initialize AuthStore
    authStore.session = (User*)malloc(sizeof(User));
    authStore.session->name = "John Doe";
    authStore.session->profile = "/images/placeholder.jpg";
    authStore.member_count = 0;

    // Setup Peer
    setupPeer();

    // Subscribe to pusher channel
    pusherClient_subscribe("video-call-channel");

    // Simulate a call initiation
    initiateCall("peer_789");

    // Clean up
    free(authStore.session->peerId);
    free(authStore.session);

    return 0;
}
