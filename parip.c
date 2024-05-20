
  const [remotePeerIdValue, setRemotePeerIdValue] = useState<string>("");
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const currentCallRef = useRef<MediaConnection | null>(null);

  const endCall = useCallback(() => {
    {
      if (currentCallRef.current) {
        currentCallRef.current.close();
      }
      releaseMediaDevices();
    }
  }, []);

  const answerCall = useCallback(
    (call: MediaConnection) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          mediaStreamRef.current = mediaStream;
          currentUserVideoRef.current!.srcObject = mediaStream;
          currentUserVideoRef.current!.play();

          call.answer(mediaStream);

          call.on("stream", (remoteStream) => {
            console.log("Received remote stream: ", remoteStream);
            remoteVideoRef.current!.srcObject = remoteStream;
            remoteVideoRef.current!.play();
          });

          call.on("close", () => {
            console.log("Call closed");
            endCall();
          });

          call.on("error", (err) => {
            console.error("Call error: ", err);
            endCall();
          });
        })
        .catch((error) => {
          console.error("Error accessing media devices.", error);
          toast.error("Failed to access media devices");
        });
    },
    [endCall]
  );

  const handleIncomingCall = useCallback(
    (call: MediaConnection) => {
      toast((t) => (
        <div>
          <div>
            <span>Incoming call from {call.peer}</span>
            <button
              onClick={() => {
                rejectCall(call);
                toast.dismiss(t.id);
              }}
            >
              Reject
            </button>
            <button
              onClick={() => {
                answerCall(call);
                toast.dismiss(t.id);
              }}
            >
              Reject
            </button>
          </div>
        </div>
      ));
    },
    [answerCall]
  );

  useEffect(() => {
    const channel = pusherClient.subscribe("video-call-channel");

    channel.bind("call", (data: any) => {
      console.log("Received call from:", data.from);
      // Handle the call event
      handleIncomingCall(data.from);
    });

    return () => {
      pusherClient.unsubscribe("video-call-channel");
      pusherClient.disconnect();
    };
  }, [handleIncomingCall]);

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id: string) => {
      console.log("My peer ID is: " + id);
      if (session?.id) {
        setRemotePeerIdValue(session?.id);
      }
    });

    peer.on("call", (call: MediaConnection) => {
      console.log("Receiving call from: " + call.peer);
      currentCallRef.current = call;
      answerCall(call);
    });

    peerInstance.current = peer;

    return () => {
      peer.destroy();
      releaseMediaDevices();
    };
  }, [answerCall, session?.id]);

  const initiateCall = (remotePeerId: string) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        mediaStreamRef.current = mediaStream;
        currentUserVideoRef.current!.srcObject = mediaStream;
        currentUserVideoRef.current!.play();

        const call = peerInstance.current!.call(remotePeerId, mediaStream);
        currentCallRef.current = call;

        call.on("stream", (remoteStream) => {
          console.log("Received remote stream: ", remoteStream);
          remoteVideoRef.current!.srcObject = remoteStream;
          remoteVideoRef.current!.play();
        });

        call.on("close", () => {
          console.log("Call closed");
          endCall();
        });

        call.on("error", (err) => {
          console.error("Call error: ", err);
          endCall();
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
        toast.error("Failed to access media devices", { icon: "❌" });
      });
  };

  const rejectCall = (call: MediaConnection) => {
    if (currentCallRef.current) {
      currentCallRef.current.close();
    }
    toast.error("Call rejected", { icon: "📞" });
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
