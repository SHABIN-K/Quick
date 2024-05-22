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
import useActiveListStore from "@/store/useActiveList";

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
  const { session } = useAuthStore();
  const otherUser = useOtherUser(data);
  const { call } = useActiveListStore();

  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string>("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentCall, setCurrentCall] = useState<MediaConnection | null>(null);
  const [callStatus, setCallStatus] = useState<string>("start video call");

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const myId = call.find((info) => info.email === session?.email)?.socket_id;
    const otherUserId = call.find(
      (info) => info.email === otherUser?.email
    )?.socket_id;
    setPeerId(myId as string);
    setRemotePeerIdValue(otherUserId as string);
  }, [call, otherUser?.email, session?.email]);

  const renderVideo = useCallback((stream: MediaStream) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
      remoteVideoRef.current.onloadedmetadata = () => {
        remoteVideoRef.current?.play();
      };
    }
  }, []);

  const handleAcceptCall = useCallback(
    (call: MediaConnection) => {
      setIsActive(true);
      setCallStatus("In call...");
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (currentUserVideoRef.current) {
            currentUserVideoRef.current.srcObject = stream;
            currentUserVideoRef.current.onloadedmetadata = () => {
              currentUserVideoRef.current?.play();
            };
          }
          mediaStreamRef.current = stream;
          call.answer(stream);
          call.on("stream", renderVideo);
          setCurrentCall(call);
        })
        .catch((err) => {
          console.error("Failed to get local stream", err);
        });
    },
    [renderVideo]
  );

  const handleRejectCall = useCallback((call: MediaConnection) => {
    call.close();
    setCurrentCall(null);
    setCallStatus("Caller is busy");
    toast("Call rejected");
  }, []);

  useEffect(() => {
    const peerInstance = new Peer(peerId);
    setPeer(peerInstance);

    peerInstance.on("open", (id) => {
      console.log("Connected with ID:", id);
    });

    peerInstance.on("error", (error) => {
      console.error(error);
    });

    peerInstance.on("call", (call: MediaConnection) => {
      toast((t) => (
        <span>
          Incoming call
          <button
            className="h-12 w-12 p-3 bg-red-500 hover:bg-red-600 rounded-full text-gray-100"
            onClick={() => {
              handleRejectCall(call);
              toast.dismiss(t.id);
            }}
          >
            reject
          </button>
          <button
            className="h-12 w-12 p-3 bg-green-500 hover:bg-green-600 rounded-full text-gray-100"
            onClick={() => {
              handleAcceptCall(call);
              toast.dismiss(t.id);
            }}
          >
            answer
          </button>
        </span>
      ));
    });

    return () => {
      peerInstance.destroy();
      releaseMediaDevices();
    };
  }, [handleAcceptCall, handleRejectCall, peerId, renderVideo]);

  const initiateCall = (remotePeerId: string) => {
    if (peer) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (currentUserVideoRef.current) {
            currentUserVideoRef.current.srcObject = stream;
            currentUserVideoRef.current.onloadedmetadata = () => {
              currentUserVideoRef.current?.play();
            };
          }
          mediaStreamRef.current = stream;
          setIsActive(false); // Reset active state until the call is connected
          const call = peer.call(remotePeerId, stream);
          call.on("stream", (remoteStream) => {
            renderVideo(remoteStream);
            setIsActive(true); // Activate video elements when remote stream is received
            setCallStatus("In call...");
          });
          call.on("close", () => {
            setCallStatus("Call ended");
            setIsActive(false);
          });
          call.on("error", () => {
            setCallStatus("Call failed");
            setIsActive(false);
          });
          setCurrentCall(call);
        })
        .catch((err) => {
          console.error("Failed to get local stream", err);
          setCallStatus("Failed to access media devices");
        });
    } else {
      setCallStatus("User is offline");
    }
  };

  const releaseMediaDevices = () => {
    console.log("Releasing media devices");
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
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
    console.log("Ending call");
    if (currentCall) {
      currentCall.close();
      setCurrentCall(null);
    }
    releaseMediaDevices();
    setIsActive(false); // Deactivate the video elements
    setCallStatus("Call ended");
    toast("Call ended");
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
                        onClick={() =>
                          initiateCall(remotePeerIdValue as string)
                        }
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
