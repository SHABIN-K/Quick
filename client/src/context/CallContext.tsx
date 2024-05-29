"use client";

import Peer, { MediaConnection } from "peerjs";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
         
import useAuthStore from "@/store/useAuth";
import useOpenStore from "@/store/useOpen";
import useActiveListStore from "@/store/useActiveList";

interface CallContextType {
  peer: Peer | null;
  callStatus: string;
  currentCall: MediaConnection | null;
  setCallStatus: React.Dispatch<React.SetStateAction<string>>;
  setCurrentCall: React.Dispatch<React.SetStateAction<MediaConnection | null>>;
  incommingCall: boolean;
  setIncommingCall: React.Dispatch<React.SetStateAction<boolean>>;
  releaseMediaDevices: () => void;
  mediaStreamRef: React.MutableRefObject<MediaStream | null>;
  currentUserVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session } = useAuthStore();
  const { call } = useActiveListStore();
  const { setIsVideoCall } = useOpenStore();

  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [incommingCall, setIncommingCall] = useState<boolean>(false);
  const [currentCall, setCurrentCall] = useState<MediaConnection | null>(null);
  const [callStatus, setCallStatus] = useState<string>("start video call");

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const ringtoneRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (call && session) {
      const myId = call.find((info) => info.email === session.email)?.socket_id;
      console.log("my session id:", myId);
      setPeerId(myId || null);
    }
  }, [call, session]);

  const releaseMediaDevices = useCallback(() => {
    console.log("Releasing media devices");
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
    if (currentUserVideoRef.current) {
      currentUserVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    mediaStreamRef.current = null;
  }, []);

  useEffect(() => {
    if (peerId) {
      const peerInstance = new Peer(peerId);

      peerInstance.on("open", (id) => {
        console.log("Connected with ID:", id);
      });

      peerInstance.on("disconnected", () => {
        console.warn("Peer disconnected, attempting to reconnect...");
        peerInstance.reconnect();
      });

      peerInstance.on("error", (error) => {
        console.error("PeerJS error:", error);
      });

      peerInstance.on("call", (call: MediaConnection) => {
        console.log("Incoming call from:", call.peer);
        setIsVideoCall(true);
        setIncommingCall(true);
        setCurrentCall(call);
        handleRingtoneButtonClick();
        setCallStatus("Incoming call...");
      });

      setPeer(peerInstance);

      return () => {
        peerInstance.destroy();
        releaseMediaDevices();

        if (ringtoneRef.current) {
          ringtoneRef.current.pause();
          // eslint-disable-next-line react-hooks/exhaustive-deps
          ringtoneRef.current.currentTime = 0;
        }
      };
    }
  }, [peerId, releaseMediaDevices, setIsVideoCall]);

  useEffect(() => {
    if (ringtoneRef.current && incommingCall) {
      ringtoneRef.current.play().catch((error) => {
        console.error("Error playing ringtone", error);
      });
    }

    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ringtoneRef.current.currentTime = 0;
      }
    };
  }, [incommingCall]);

  const handleRingtoneButtonClick = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.play().catch((error) => {
        console.error("Error playing ringtone", error);
      });
    }
  };

  const contextValue: CallContextType = {
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
  };

  return (
    <CallContext.Provider value={contextValue}>
      {children}
      <audio ref={ringtoneRef} src="/audio/ringtone.mp3" loop />
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
