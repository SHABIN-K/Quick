"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import Peer, { MediaConnection } from "peerjs";
import { IoClose, IoVideocam } from "react-icons/io5";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useRef, useEffect, useCallback } from "react";

import useAuthStore from "@/store/useAuth";
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

  // Function to handle accepting an incoming call
  const handleAcceptCall = useCallback(() => {
    if (incomingCall) {
      // Answer the incoming call with current media stream
      const stream = mediaStreamRef.current;
      if (stream) {
        incomingCall.answer(stream);
        // Event listener for when remote stream is received
        incomingCall.on("stream", (remoteStream) => {
          console.log("Received remote stream: ", remoteStream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          }
        });
        // Event listener for call errors
        incomingCall.on("error", (err) => {
          console.error("Call error: ", err);
        });
        toast.success("Call accepted");
      }
    }
    // Reset incoming call state
    setIncomingCall(null);
  }, [incomingCall]);

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
    const peer = new Peer();

    peer.on("open", (id: string) => {
      console.log("my peer id is :", id);
      setRemotePeerIdValue(id);
    });

    // Event listener for incoming calls
    peer.on("call", (call: MediaConnection) => {
      console.log("Receiving call from: " + call.peer);
      setIncomingCall(call);
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
              handleAcceptCall();
              toast.dismiss(t.id);
            }}
          >
            answer
          </button>
        </span>
      ));
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
    console.log("Calling peer: " + remotePeerId);
    // Check if getUserMedia is supported by the browser
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Get user media with video and audio
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          // Set media stream to the currentUserVideoRef
          mediaStreamRef.current = mediaStream;
          if (currentUserVideoRef.current) {
            currentUserVideoRef.current.srcObject = mediaStream;
            currentUserVideoRef.current.play();
          }

          // Make a call to the remote peer
          if (peerInstance.current) {
            const call = peerInstance.current.call(remotePeerId, mediaStream);
            // Event listener for when remote stream is received
            call.on("stream", (remoteStream) => {
              console.log("Received remote stream: ", remoteStream);
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.play();
              }
            });
            // Event listener for call errors
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

  // Function to release media devices
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

  // Function to end the ongoing call
  const endCall = () => {
    // Close incoming call connection
    if (incomingCall) {
      incomingCall.close();
    }
    // Release media devices
    releaseMediaDevices();
    // Reset incoming call state
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
