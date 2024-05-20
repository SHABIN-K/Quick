"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { Channel } from "pusher-js";
import Peer, { MediaConnection } from "peerjs";
import { IoClose, IoVideocam } from "react-icons/io5";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useRef, useEffect, useCallback } from "react";

import useAuthStore from "@/store/useAuth";
import { pusherClient } from "@/config/pusher";
import useOtherUser from "@/hooks/useOtherUser";
import { Conversation, User } from "@/shared/types";

interface AddMemberModalProps {
  isOpen?: boolean;
  onClose: () => void;
  data: Conversation & {
    users: User[];
  };
}
const VideoCall: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const otherUser = useOtherUser(data);
  const { session } = useAuthStore();

  const [incomingCall, setIncomingCall] = useState<MediaConnection | null>(
    null
  );
  const [remotePeerIdValue, setRemotePeerIdValue] = useState<string>("");
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const peerInstance = useRef<Peer | null>(null);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  // Function to handle accepting an incoming call
  const handleAcceptCall = useCallback(async (callerId: MediaConnection) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        mediaStreamRef.current = mediaStream;
        if (currentUserVideoRef.current) {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();
        }

        if (peerInstance.current) {
          const call = peerInstance.current.call(callerId, mediaStream);
          call.on("stream", (remoteStream) => {
            console.log("Received remote stream: ", remoteStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteVideoRef.current.play();
            }
          });
          call.on("error", (err) => {
            console.error("Call error: ", err);
          });
          toast.success("Call accepted");
        }
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    } else {
      console.error(
        "Media devices API or getUserMedia method is not available."
      );
    }
    // Reset incoming call state
    setIncomingCall(null);
  }, []);

  // Function to handle rejecting an incoming call
  const handleRejectCall = useCallback(() => {
    // Close incoming call connection
    if (incomingCall) {
      incomingCall.close();
    }
    toast.error("Call rejected");
    // Reset incoming call state
    setIncomingCall(null);
  }, [incomingCall]);

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe("private-video-call");
      setActiveChannel(channel);
    }

    channel.bind("pusher:subscription_succeeded", (hello: any) => {
      console.log(hello);
      console.log("Successfully subscribed to the video call channel.");
    });

    channel.bind(
      "incoming-call",
      ({
        callerId,
        calleeId,
      }: {
        callerId: MediaConnection;
        calleeId: string;
      }) => {
        if (calleeId === session.id) {
          console.log("Incoming call from: ", callerId);
          toast((t) => (
            <span>
              Incoming call
              <button
                onClick={() => {
                  handleRejectCall();
                  toast.dismiss(t.id);
                }}
              >
                reject
              </button>
              <button
                onClick={() => {
                  handleAcceptCall(callerId); // Pass callerId to handleAcceptCall
                  toast.dismiss(t.id);
                }}
              >
                answer
              </button>
            </span>
          ));
          setIncomingCall(callerId); // Store callerId for potential video call display
        }
      }
    );

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("private-video-call");
        setActiveChannel(null);
      }
    };
  }, [activeChannel, handleAcceptCall, handleRejectCall, session.id]);

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id: string) => {
      console.log("my peer id is :", id);
      setRemotePeerIdValue(id);
    });

    // Event listener for incoming calls
    peer.on("call", (call: MediaConnection) => {
      console.log("Receiving call from: " + call.peer);
      setIncomingCall(call);
    });

    // Save the Peer instance to the ref
    peerInstance.current = peer;

    // Cleanup function
    return () => {
      // Destroy Peer instance and release media devices
      peer.destroy();
      releaseMediaDevices();
    };
  }, [handleAcceptCall, handleRejectCall]);

  // Function to initiate a call to a remote peer
  const initiateCall = (remotePeerId: string) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          mediaStreamRef.current = mediaStream;
          if (currentUserVideoRef.current) {
            currentUserVideoRef.current.srcObject = mediaStream;
            currentUserVideoRef.current.play();
          }

          if (peerInstance.current) {
            const call = peerInstance.current.call(remotePeerId, mediaStream);
            call.on("stream", (remoteStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.play();
              }
            });
            call.on("error", (err) => {
              console.error("Call error: ", err);
            });
          }
        })
        .catch((error) => {
          console.error("Error accessing media devices.", error);
        });
    } else {
      console.error(
        "Media devices API or getUserMedia method is not available."
      );
    }
  };

  const releaseMediaDevices = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (currentUserVideoRef.current) {
      currentUserVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const endCall = () => {
    if (incomingCall) {
      incomingCall.close();
    }
    releaseMediaDevices();
    setIncomingCall(null);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="overflow-hidden rounded-lg bg-white px-3 py-3 shadow-xsl transition-all w-full lg:min-w-[800px] sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="min-h-[500px] bg-[url(/background.jpg)] rounded-lg p-2  ">
                  <div className="flex flex-col items-center">
                    <div className="mt-2 justify-between">
                      <Image
                        alt="Avatar"
                        src={otherUser?.profile || "/images/placeholder.jpg"}
                        className="rounded-full lg:min-w-36 lg:min-h-36 min-w-24"
                        height={150}
                        width={150}
                      />
                      <p className="text-black capitalize text-xl font-bold mt-6">
                        {otherUser?.name}
                      </p>
                      <p className="text-gray-700 capitalize text-base font-semibold">
                        start video call
                      </p>
                    </div>
                    <div className="flex gap-7">
                      <video
                        ref={currentUserVideoRef}
                        autoPlay
                        playsInline
                        style={{
                          width: "300px",
                          height: "200px",
                          borderRadius: "14px",
                          backgroundColor: "black",
                        }}
                      />
                      <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        style={{
                          width: "300px",
                          height: "200px",
                          borderRadius: "14px",
                          backgroundColor: "black",
                        }}
                      />
                    </div>
                    <div className="flex mt-5 gap-4">
                      <IoClose
                        className="h-12 w-12 p-2 bg-white rounded-full text-gray-600"
                        onClick={endCall}
                      />
                      <IoClose
                        className="h-12 w-12 p-2 bg-white rounded-full text-gray-600"
                        onClick={onClose}
                      />
                      <IoVideocam
                        className="h-12 w-12 p-3 bg-sky-500 hover:bg-sky-600 rounded-full text-gray-100"
                        onClick={() => initiateCall(remotePeerIdValue)}
                      />
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default VideoCall;

/* 

 {incomingCall && (
                        <Fragment>
                          <button
                            className="h-12 w-12 p-3 bg-green-500 hover:bg-green-600 rounded-full text-gray-100"
                            //onClick={handleAcceptCall}
                          >
                            Accept
                          </button>
                          <button
                            className="h-12 w-12 p-3 bg-red-500 hover:bg-red-600 rounded-full text-gray-100"
                            //onClick={handleRejectCall}
                          >
                            Reject
                          </button>
                        </Fragment>
                      )}

*/
