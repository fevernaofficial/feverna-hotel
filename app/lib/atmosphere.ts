export const HOTEL_ATMOSPHERE_EVENT = "feverna:atmosphere";

export type AtmosphereEnvironment = "interior" | "exterior";

export type AtmosphereEvent =
  | { action: "fadeOut"; seconds?: number }
  | { action: "fadeIn"; seconds?: number }
  | { action: "fadeInAfterSilence"; silenceSeconds?: number; seconds?: number }
  | {
      action: "setEnvironment";
      environment: AtmosphereEnvironment;
      seconds?: number;
    }
  | { action: "stop" };

export function setAtmosphereEnvironment(
  environment: AtmosphereEnvironment,
  seconds = 1.8
) {
  window.dispatchEvent(
    new CustomEvent<AtmosphereEvent>(HOTEL_ATMOSPHERE_EVENT, {
      detail: { action: "setEnvironment", environment, seconds },
    })
  );
}
