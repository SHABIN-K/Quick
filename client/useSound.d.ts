// useSound.d.ts
declare module "use-sound" {
  export type PlayOptions = {
    id?: string;
    interrupt?: boolean;
    delay?: number;
    volume?: number;
    soundEnabled?: boolean;
    sprite?: Record<string, [number, number]>;
    playbackRate?: number;
    onFinish?: () => void;
    onError?: (error: Error) => void;
  };

  type UseSound = (
    src: string,
    options?: PlayOptions
  ) => [() => void, { loading: boolean }];

  const useSound: UseSound;

  export default useSound;
}
