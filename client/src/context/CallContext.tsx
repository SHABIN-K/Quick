"use client";

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import Peer, { MediaConnection } from "peerjs";
import toast from "react-hot-toast";
import useAuthStore from "@/store/useAuth";
import useActiveListStore from "@/store/useActiveList";

interface CallContextType {
  initiateCall: (remotePeerId: string) => void;
  endCall: () => void;
  acceptCall: (call: MediaConnection) => void;
  rejectCall: (call: MediaConnection) => void;
  setPeerId: (id: string) => void;
  peerId: string | null;
  callStatus: string;
  currentCall: MediaConnection | null;
  isActive: boolean;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session } = useAuthStore();
  const { call } = useActiveListStore();
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [currentCall, setCurrentCall] = useState<MediaConnection | null>(null);
  const [callStatus, setCallStatus] = useState<string>("start video call");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isIncomingCall, setIsIncomingCall] = useState<boolean>(false);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const ringtoneRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (call && session) {
      const myId = call.find((info) => info.email === session.email)?.socket_id;
      console.log("my session id:", myId);
      setPeerId(myId || null);
    }
  }, [call, session]);

  const renderVideo = useCallback((stream: MediaStream) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
      remoteVideoRef.current.onloadedmetadata = () => {
        remoteVideoRef.current?.play();
      };
    }
  }, []);

  const acceptCall = useCallback(
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

  const rejectCall = useCallback((call: MediaConnection) => {
    call.close();
    setCurrentCall(null);
    setCallStatus("Caller is busy");
    toast("Call rejected");
  }, []);

  const releaseMediaDevices = useCallback(() => {
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
  }, []);

  useEffect(() => {
    if (isIncomingCall) {
      const audio = ringtoneRef.current;
      if (audio) {
        audio.play();
      }
    } else {
      const audio = ringtoneRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }, [isIncomingCall]);

  useEffect(() => {
    if (peerId) {
      const peerInstance = new Peer(peerId);
      setPeer(peerInstance);

      peerInstance.on("open", (id) => {
        console.log("my peer ID:", id);
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
                rejectCall(call);
                toast.dismiss(t.id);
              }}
            >
              reject
            </button>
            <button
              className="h-12 w-12 p-3 bg-green-500 hover:bg-green-600 rounded-full text-gray-100"
              onClick={() => {
                acceptCall(call);
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
    }
  }, [acceptCall, peerId, rejectCall, releaseMediaDevices]);

  const initiateCall = (remotePeerId: string) => {
    console.log("remote id::", remotePeerId);
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

  const endCall = () => {
    console.log("Ending call");
    if (currentCall) {
      currentCall.close();
      setCurrentCall(null);
    }
    releaseMediaDevices();
    setIsActive(false);
    setCallStatus("Call ended");
  };

  return (
    <CallContext.Provider
      value={{
        initiateCall,
        endCall,
        acceptCall,
        rejectCall,
        setPeerId,
        peerId,
        callStatus,
        currentCall,
        isActive,
      }}
    >
      {children}
      <audio ref={ringtoneRef} src="/client/public/audio/ringtone.mp3" />
    </CallContext.Provider>
  );
};

export const useCallContext = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCallContext must be used within a CallProvider");
  }
  return context;
};
