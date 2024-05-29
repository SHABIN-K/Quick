"use client";

import Image from "next/image";
import { MediaConnection } from "peerjs";
import { IoClose, IoVideocam } from "react-icons/io5";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useCallback } from "react";

import useOpenStore from "@/store/useOpen";
import useOtherUser from "@/hooks/useOtherUser";
import { Conversation, User } from "@/shared/types";
import { useCallContext } from "@/context/CallContext";

interface AddMemberModalProps {
  data: Conversation & {
    users: User[];
  };
}

const VideoCall: React.FC<AddMemberModalProps> = ({ data }) => {
  const {
    peer,
    callStatus,
    currentCall,
    setCallStatus,
    setCurrentCall,
    incommingCall,
    setIncommingCall,
    releaseMediaDevices,
    mediaStreamRef,
    currentUserVideoRef,
    remoteVideoRef,
  } = useCallContext();
  const otherUser = useOtherUser(data);
  const { isVideoCall, setIsVideoCall } = useOpenStore();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState<string>("");

  useEffect(() => {
    setRemotePeerIdValue(otherUser?.id as string);
  }, [otherUser?.id]);

  const renderVideo = useCallback(
    (stream: MediaStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.onloadedmetadata = () => {
          remoteVideoRef.current?.play().catch((error) => {
            console.error("Error playing remote video", error);
          });
        };
      }
    },
    [remoteVideoRef]
  );

  const handleAcceptCall = useCallback(
    (call: MediaConnection) => {
      setIncommingCall(false);
      setIsActive(true);
      setCallStatus("In call...");
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (currentUserVideoRef.current) {
            currentUserVideoRef.current.srcObject = stream;
            currentUserVideoRef.current.onloadedmetadata = () => {
              currentUserVideoRef.current?.play().catch((error) => {
                console.error("Error playing local video", error);
              });
            };
          }
          mediaStreamRef.current = stream;
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            renderVideo(remoteStream);
          });
          setCurrentCall(call);
        })
        .catch((err) => {
          console.error("Failed to get local stream for incoming call", err);
        });
    },
    [
      currentUserVideoRef,
      mediaStreamRef,
      renderVideo,
      setCallStatus,
      setCurrentCall,
      setIncommingCall,
    ]
  );

  const handleRejectCall = useCallback(
    (call: MediaConnection) => {
      call.close();
      onClose();
      setIncommingCall(false);
      setCurrentCall(null);
    },
    [onClose, setCurrentCall, setIncommingCall]
  );

  const initiateCall = (remotePeerId: string) => {
    console.log("Calling to", remotePeerId);
    setIsActive(true);
    setCallStatus("In call...");
    if (peer) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (currentUserVideoRef.current) {
            currentUserVideoRef.current.srcObject = stream;
            currentUserVideoRef.current.onloadedmetadata = () => {
              currentUserVideoRef.current?.play().catch((error) => {
                console.error("Error playing local video", error);
              });
            };
          }
          mediaStreamRef.current = stream;
          const call = peer.call(remotePeerId, stream);
          call.on("stream", (remoteStream) => {
            renderVideo(remoteStream);
            setIsActive(true);
            setCallStatus("In call...");
          });
          call.on("close", () => {
            setCallStatus("Call ended");
            setIsActive(false);
          });
          call.on("error", (error) => {
            console.error("Call error:", error);
            setCallStatus("Call failed");
            setIsActive(false);
          });
          setCurrentCall(call);
        })
        .catch((err) => {
          console.error("Failed to get local stream", err);
        });
    } else {
      setCallStatus("User is offline");
    }
  };

  const endCall = () => {
    console.log("Ending call");
    if (currentCall) {
      currentCall.close();
      setCurrentCall(null);
    }
    releaseMediaDevices();
    onClose();
    setIsActive(false);
    setCallStatus("start video call");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function onClose() {
    setIsVideoCall(false);
  }
  return (
    <Transition.Root show={isVideoCall} as={Fragment}>
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
                  <div className="flex flex-col items-center justify-center">
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
                        {callStatus}
                      </p>
                    </div>
                    {isActive && (
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
                    )}
                    {incommingCall ? (
                      <div className="flex mt-5 gap-4">
                        <IoVideocam
                          className="h-12 w-12 p-3 bg-green-500 hover:bg-green-600 rounded-full text-gray-800"
                          onClick={() =>
                            currentCall && handleAcceptCall(currentCall)
                          }
                        />

                        <IoClose
                          className="h-12 w-12 p-2 bg-rose-600 rounded-full text-white"
                          onClick={() =>
                            currentCall && handleRejectCall(currentCall)
                          }
                        />
                      </div>
                    ) : (
                      <div className="flex mt-5 gap-4">
                        {!isActive && (
                          <IoVideocam
                            className="h-12 w-12 p-3 bg-sky-500 hover:bg-sky-600 rounded-full text-gray-100"
                            onClick={() =>
                              initiateCall(remotePeerIdValue as string)
                            }
                          />
                        )}

                        <IoClose
                          className="h-12 w-12 p-2 bg-rose-600 rounded-full text-white"
                          onClick={endCall}
                        />
                      </div>
                    )}
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
